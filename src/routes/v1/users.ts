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

usersRouter.get('/:token', async (req, res) => {
  await ensureConnected();

  try {
    const decoded: string = Buffer.from(req.params.token, 'base64').toString('ascii')
    const userRecord = await UserModel.findById(decoded);

    return res.json({
      first_name: userRecord!.first_name,
      last_name: userRecord!.last_name,
      bryxcoin_address: userRecord!.bryxcoin_address,
    });
  } catch (ex) {
    return res.status(400).json(ex); // assume this is the user's fault for bad input
  }
});

export default usersRouter;
