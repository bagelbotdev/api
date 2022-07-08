import { Router } from "express";
import { ensureConnected } from "../db/util";
import UserModel from "../db/models/User";

import { sendInteractionResponse } from "../slack/utils";

const interactionRouter = Router();

const ACTION_DISPATCH: { [k: string]: (payload: any) => Promise<unknown> } = {
  "registration-submit": handleRegistrationSubmit,
  "unregistration-submit": handleUnregistrationSubmit,
};

async function handleRegistrationSubmit(payload: any) {
  const parsedState = parseState(payload.state);

  const slack_user_id = payload.user.id;
  const slack_user_name = payload.user.username;
  const venmo_user_name = parsedState["textbox-venmo-username"];
  const first_name = parsedState["textbox-pref-first-name"];
  const last_name = parsedState["textbox-pref-last-name"];

  await ensureConnected();

  const curRecord = (await UserModel.where({ slack_user_id })).shift();

  if (!curRecord)
    await UserModel.create({
      slack_user_id,
      venmo_user_name,
      slack_user_name,
      first_name,
      last_name,
    });
  else {
    curRecord.venmo_user_name = venmo_user_name;
    curRecord.first_name = first_name;
    curRecord.last_name = last_name;

    await curRecord.save();
  }

  await sendInteractionResponse(
    payload.response_url,
    ":+1: You're all set!. You can use `/register` to update your information at any time"
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
  // const payload = req.body.payload;

  const action_id = payload.actions.pop().action_id;
  console.log(action_id);

  await ACTION_DISPATCH[action_id](payload);

  res.end();
});

export default interactionRouter;
