import { Router } from "express";
import { ensureConnected } from "../db/util";
import UserModel from "../db/models/User";
import { canAfford, createTransactionBySlackId } from "../coin/payment";
import { newCoinUser } from "../coin/utils";
import { addToCart } from "../balsam/cart";
import { getItem } from "../balsam/items";
import { sendMessage } from "../slack/utils";
import { MenuItemSpec } from "../db/schemas/MenuItem";
import mapConfigureOrderToBlockKit from "../slack/blockkit/mappers/configureOrder";

import { sendInteractionResponse } from "../slack/utils";
import MenuItemModel from "../db/models/MenuItem";
import OrderTabModel from "../db/models/OrderTab";
import OrderModel from "../db/models/Order";
import total_orders from "../prom/total_orders";

const interactionRouter = Router();

const ACTION_DISPATCH: { [k: string]: (payload: any) => Promise<unknown> } = {
  "registration-submit": handleRegistrationSubmit,
  "unregistration-submit": handleUnregistrationSubmit,
  "confirm-custom-order": handleConfirmOrder,
  "schedule-custom-order": handleScheduleOrder,
  "configure-order": handleConfigureOrder,
};

type Selection = {
  text: {
    type: "plain_text";
    text: string;
    emoji?: boolean;
  };
  value: string;
};

type SlackState = {
  values: {
    [groupGuid: string]: {
      [actionId: string]:
      | {
        type: "multi_static_select";
        selected_options: Selection[];
      }
      | {
        type: "static_select";
        selected_option: Selection | null;
      };
    };
  };
};

function generateItem(
  item: Awaited<ReturnType<typeof getItem>>,
  slackState: SlackState
): MenuItemSpec {
  const menuItem: MenuItemSpec = {
    price: item.price,
    balsam_item_guid: item.itemGuid,
    balsam_group_guid: item.itemGroupGuid,
    balsam_modifiers: [],
  };
  for (const groupGuid in slackState.values) {
    const modifierGroup = item.modifierGroups.find(
      (modifierGroup) => modifierGroup.guid == groupGuid
    );
    if (!modifierGroup) {
      throw new Error(`Unknown modifier: ${groupGuid}`);
    }

    const state = Object.entries(slackState.values[groupGuid])[0][1];
    const selectedOptions = (
      state.type == "static_select" ? [state.selected_option] : state.selected_options
    ).filter((j) => j !== null) as Selection[];

    const dbModifier: MenuItemSpec["balsam_modifiers"][number] = {
      modifier_set_guid: groupGuid,
      modifiers: [],
    };
    menuItem.balsam_modifiers.push(dbModifier);

    for (const selectedOption of selectedOptions) {
      const optionGuid = selectedOption.value;
      const option = modifierGroup.modifiers.find((modifier) => modifier.itemGuid == optionGuid);
      if (!option) {
        throw new Error(`Unknown option: ${optionGuid}`);
      }
      dbModifier.modifiers.push({
        modifier_group_guid: option.itemGroupGuid || item.itemGroupGuid,
        modifier_guid: option.itemGuid,
      });
      if (modifierGroup?.pricingMode == "ADJUSTS_PRICE") {
        menuItem.price += option.price;
      }
    }
  }
  return menuItem;
}

async function handleConfigureOrder(payload: any) {
  const [_, cartGuid, itemGuid, itemGroupGuid, groupGuid] = payload.actions
    .at(0)
    .action_id.split(":");
  console.log(payload.state.values);
  const item = await getItem(itemGuid, itemGroupGuid);

  await fetch(payload.response_url, {
    method: "POST",
    body: JSON.stringify({
      replace_original: true,
      ...mapConfigureOrderToBlockKit(cartGuid, item, generateItem(item, payload.state).price),
    }),
  });
}

async function handleScheduleOrder(payload: any) {
  await ensureConnected();
  const [_cartGuid, itemGuid, itemGroupGuid] = payload.actions.at(0).value.split(":");
  const item = await getItem(itemGuid, itemGroupGuid);
  const menuItem = generateItem(item, payload.state);

  const user = await UserModel.findOne({ slack_user_id: payload.user.id });
  if (!user)
    return sendMessage(
      "error! I attempted to look up a user by slack_id " +
      payload.user.id +
      " but found no record!!",
      "#ff0033"
    );

  const order = new OrderModel({
    user: user._id,
    item: menuItem,
    future: true,
    created: Date.now(),
  });
  await order.save();

  return await sendInteractionResponse(payload.response_url, "All set! You order is scheduled.");
}

async function handleConfirmOrder(payload: any) {
  await ensureConnected();

  const [cartGuid, itemGuid, itemGroupGuid] = payload.actions.at(0).value.split(":");
  const item = await getItem(itemGuid, itemGroupGuid);
  const menuItem = generateItem(item, payload.state);

  const user = await UserModel.findOne({ slack_user_id: payload.user.id });
  const tab = await OrderTabModel.findOne({ closed: false });

  if (!tab)
    return await sendInteractionResponse(
      payload.response_url,
      "It doesn't look like a tab is open right now! You can open one yourself with `/tab open`."
    );

  if (
    user!.slack_user_id != tab.opener &&
    !(await canAfford(user!.bryxcoin_address!, menuItem!.price! * 100))
  )
    return await sendInteractionResponse(
      payload.response_url,
      ":sadge:, looks like you can't afford that! Check you bryxcoin wallet with `/balance`. To get more bryxcoin, you can reach out to Tyler for a buyin, or you can host the next bagel tab! `/tab open`"
    );

  await addToCart(cartGuid!, menuItem, user!.first_name!);
  await sendMessage(`<@${user!.slack_user_id!}> ordered ${menuItem?.name}`, "#EADDCA");

  await OrderModel.create({
    tab: tab._id,
    user: user!._id,
    item: menuItem,
    created: Date.now(),
  });

  if (user!.slack_user_id != tab.opener)
    await createTransactionBySlackId(user!.slack_user_id!, tab!.opener!, menuItem!.price! * 100);

  await sendInteractionResponse(payload.response_url, "ok");
}

async function handleRegistrationSubmit(payload: any) {
  const parsedState = parseState(payload.state);

  const [bryxcoin_password, bryxcoin_wallet, bryxcoin_address] = await newCoinUser();

  const slack_user_id = payload.user.id;
  const slack_user_name = payload.user.username;
  const first_name = parsedState["textbox-pref-first-name"];
  const last_name = parsedState["textbox-pref-last-name"];

  await ensureConnected();

  const curRecord = (await UserModel.where({ slack_user_id })).shift();

  if (!curRecord)
    await UserModel.create({
      slack_user_id,
      slack_user_name,
      first_name,
      last_name,
      bryxcoin_address,
      bryxcoin_wallet,
      bryxcoin_password,
    });
  else {
    curRecord.first_name = first_name;
    curRecord.last_name = last_name;

    await curRecord.save();
  }

  await sendInteractionResponse(
    payload.response_url,
    ":+1: You're all set!. You can use `/register` to update your information at any time.\n\nYour wallet password is `" +
    bryxcoin_password +
    "`"
  );
}

async function handleUnregistrationSubmit(payload: any) {
  const slack_user_id = payload.user.id;
  const response_url = payload.response_url;

  await ensureConnected();

  const curRecord = (await UserModel.where({ slack_user_id })).shift();

  if (!curRecord)
    return sendInteractionResponse(
      response_url,
      ":confusedparrot: It doesn't look like you have a registration to remove... you can register with `/register`."
    );
  else {
    const suid = curRecord.slack_user_id;
    const firstName = curRecord.first_name;
    const lastName = curRecord.last_name;

    await curRecord.delete();
    return sendInteractionResponse(
      response_url,
      `:+1: User '${firstName} ${lastName}' associated with <@${suid}> has been unregistered. They can re-register with \`/register\``
    );
  }
}

// -- //

function parseState(incomingState: {
  values: { [k: string]: { [id: string]: { type: string; value: string } } };
}): { [id: string]: string } {
  return Object.values(incomingState.values).reduce((values, cur) => {
    const [key, { value }] = Object.entries(cur).pop()!;
    values[key] = value;

    return values;
  }, {} as { [id: string]: string });
}

// -- //

interactionRouter.post("/", async (req, res) => {
  const payload = JSON.parse(req.body.payload);
  console.log(payload.actions, payload);
  const action_id = payload.actions.at(0).action_id.replace(/^(.+?):.*$/, "$1");

  await ACTION_DISPATCH[action_id](payload);

  res.end();
});

export default interactionRouter;
