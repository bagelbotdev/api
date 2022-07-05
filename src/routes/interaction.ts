import { Router } from "express";
import { ensureConnected } from "../db/util";
import UserModel from "../db/models/User";

import fetch from "node-fetch";

const interactionRouter = Router();

const ACTION_DISPATCH: { [k: string]: (payload: any) => Promise<void> } = {
  "registration-submit": handleRegistrationSubmit,
};

async function handleRegistrationSubmit(payload: any) {
  const parsedState = parseState(payload.state);
  const slack_user_id = payload.user.id;
  const venmo_user_name = parsedState["textbox-venmo-username"];
  const first_name = parsedState["textbox-pref-first-name"];
  const last_name = parsedState["textbox-pref-last-name"];

  await ensureConnected();
  const curRecord = await UserModel.findOne({ slack_user_id });

  if (!curRecord)
    await UserModel.create({
      slack_user_id,
      venmo_user_name,
      first_name,
      last_name,
    });
  else {
    curRecord.venmo_user_name = venmo_user_name;
    curRecord.first_name = first_name;
    curRecord.last_name = last_name;

    await curRecord.save();
  }

  console.log(payload.response_url);

  await fetch(payload.response_url, {
    method: "POST",
    body: JSON.stringify({
      text: ":+1: You're all set!. You can use `/register` to update your information at any time",
    }),
  });
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
  await ACTION_DISPATCH[payload.actions.pop().action_id](payload);

  res.end();
});

export default interactionRouter;
