import { Router } from "express";

import UserModel from "../db/models/User";
import { ensureConnected } from "../db/util";
import { UserSpec } from "../db/schemas/User";

declare global {
  namespace Express {
    interface Request {
      userRecord?: UserSpec;
    }
  }
}

const registration = Router();

registration.use(async (req, res, next) => {
  await ensureConnected();
  const { user_id } = req.body;

  console.log("seaching by suid: " + user_id);
  const userRecord = (
    await UserModel.where({ slack_user_id: user_id })
  ).shift();

  console.log("found:" + userRecord);

  if (!userRecord)
    return res.end(
      "Unregistered. Use `/register` to get started with bagelbot"
    );

  req.userRecord = userRecord as UserSpec;

  next();
});

export default registration;
