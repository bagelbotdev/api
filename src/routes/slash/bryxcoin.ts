import { Router } from "express";
const bryxcoinRouter = Router();

import registration from "../../middlewares/registration";
import OrderTabModel from "../../db/models/OrderTab";
import { sendMessage } from "../../slack/utils";
import specifyPayment from "../../slack/blockkit/prefab/specify-payment.json";
import HostModel from "../../db/models/Host";
import { getRandomHostByOwner } from "../../coin/hosts";

bryxcoinRouter.use(registration);

bryxcoinRouter.post("/", async (req, res) => {
  const cmd = req.body.text as string;

  if (/send\s*$/.test(cmd)) {
    res.json(specifyPayment);
  } else if (/mine$/.test(cmd)) {
    const host = await getRandomHostByOwner(req.userRecord?._id.toString() ?? "");
    console.log(req.userRecord?._id.toString(), host);

    return res.end(host || `:sadge: It doesn't look like you have any hosts registered!`);
  }

  return res.end(
    ":sadge: No action could be found for command`" +
      cmd +
      "`. Avalible actions are: `/bryxcoin send` and `/bryxcoin mine`"
  );
});

export default bryxcoinRouter;
