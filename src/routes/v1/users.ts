import { Router } from "express";
import { ensureConnected } from "../../db/util";
import UserModel from "../../db/models/User";
import { getSlackProfilePhotoBySlackId } from "../../slack/api/profiles";

const usersRouter = Router();

usersRouter.get("/", async (req, res) => {
  await ensureConnected();
  return res.json(
    await Promise.all(
      (
        await UserModel.find({})
      ).map(async (ent) => ({
        _id: ent._id,
        first_name: ent.first_name,
        last_name: ent.last_name,
        slack_user_id: ent.slack_user_id,
        bryxcoin_address: ent.bryxcoin_address,
        slack_profile_photo: await getSlackProfilePhotoBySlackId(ent.slack_user_id!),
      }))
    )
  );
});

usersRouter.get("/:token", async (req, res) => {
  await ensureConnected();

  try {
    const decoded: string = Buffer.from(req.params.token, "base64").toString("ascii");
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
