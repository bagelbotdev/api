import { getItem } from "../../../balsam/items";
import { MenuItemSpec } from "../../../db/schemas/MenuItem";
import { TAX, roundUSD } from "../../../balsam/utils";

export default function mapConfigureOrderToBlockKit(
  cartGuid: string,
  item: Awaited<ReturnType<typeof getItem>>,
  menuItem: MenuItemSpec
) {
  return {
    blocks: [
      {
        type: "divider",
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `Configuring ${menuItem.name || item.name}...`,
        },
      },
      ...item.modifierGroups
        .map((group) => {
          const isSingleSelect = group.maxSelections == 1 && group.minSelections == 1;
          // Ignore nested modifiers, they suck!
          const modifiers = group.modifiers.filter((modifier) => !modifier.modifierGroups.length);
          if (!modifiers.length) return null;
          const options = modifiers.map((modifier) => ({
            text: {
              type: "plain_text",
              text:
                modifier.name +
                (modifier.price ? ` (+$${roundUSD(modifier.price * TAX).toFixed(2)})` : ""),
            },
            value: modifier.itemGuid,
          }));
          const prefabOption = menuItem.balsam_modifiers.find(
            (modifier) => modifier.modifier_set_guid == group.guid
          );
          const initialOptions = prefabOption
            ? prefabOption.modifiers.map(
              (modifier) => options.find((option) => option.value == modifier.modifier_guid)!
            )
            : [];
          return {
            type: "section",
            block_id: group.guid,
            text: { type: "mrkdwn", text: group.name },
            accessory: {
              action_id:
                "configure-order:" +
                cartGuid +
                ":" +
                item.itemGuid +
                ":" +
                item.itemGroupGuid +
                ":" +
                group.guid,
              type: isSingleSelect ? "static_select" : "multi_static_select",
              max_selected_items: (!isSingleSelect && group.maxSelections) || undefined,
              [isSingleSelect ? "initial_option" : "initial_options"]: initialOptions.length
                ? isSingleSelect
                  ? initialOptions[0]
                  : initialOptions
                : undefined,
              placeholder: {
                type: "plain_text",
                text: isSingleSelect ? group.name : "Select",
              },
              options,
            },
          };
        })
        .filter((entry) => !!entry),
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: `Add to Tab ($${roundUSD(menuItem.price).toFixed(2)})`,
              emoji: true,
            },
            value: cartGuid + ":" + item.itemGuid + ":" + item.itemGroupGuid,
            action_id: "confirm-custom-order",
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "Schedule for Next Tab",
              emoji: true,
            },
            value: cartGuid + ":" + item.itemGuid + ":" + item.itemGroupGuid,
            action_id: "schedule-custom-order",
          },
        ],
      },
    ],
  };
}
