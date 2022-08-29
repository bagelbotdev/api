import { Router } from "express";
import { ensureConnected } from "../../db/util";
import UserModel from "../../db/models/User";

const usersRouter = Router();

usersRouter.get("/", async (req, res) => {
  await ensureConnected();
  return res.json(
    (await UserModel.find({})).map((ent) => ({
      first_name: ent.first_name,
      last_name: ent.last_name,
      slack_user_id: ent.slack_user_id
    }))
  );
});

export default usersRouter;
