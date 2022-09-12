import { Router } from "express";
import { ensureConnected } from "../../db/util";
import { getBalance } from "../../coin/payment";
import UserModel from "../../db/models/User";

const coinRouter = Router();

coinRouter.get("/", async (req, res) => {
  await ensureConnected();

  const users = await UserModel.find({});
  const ret = [] as { first_name: string; last_name: string; bryxcoin_balance: number }[];

  for (let usr of users) {
    const balance = await getBalance(usr.bryxcoin_address!);
    ret.push({
      first_name: usr.first_name!,
      last_name: usr.last_name!,
      bryxcoin_balance: balance,
    });
  }

  return res.json(ret);
});

export default coinRouter;
