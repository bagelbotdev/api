import { Router } from "express";
import { requestNewCart } from "../../balsam/cart";
import OrderTabModel from "../../db/models/OrderTab";
import registration from "../../middlewares/registration";
import { sendMessage } from "../../slack/utils";
const tabRouter = Router();

tabRouter.use(registration);

tabRouter.post("/", async (req, res) => {
  const { text } = req.body;
  const curTab = (await OrderTabModel.find({ closed: false })).shift();

  if (text.toLowerCase() == "new") {
    if (curTab == null) {
      const newTab = new OrderTabModel();
      newTab.opened_at = Date.now();
      newTab.opener = req.userRecord?.slack_user_id;
      newTab.closed = false;
      newTab.orders = [];
      newTab.balsam_cart_guid = await requestNewCart();

      await newTab.save();
      return res.end("Success! You have opened a new bagel tab");
    } else {
      return res.end(
        `Nope! It looks like <@${curTab.opener}>'s tab from ${new Date(
          curTab.opened_at!
        ).toLocaleString()} is still open. They can close it with \`/tab close\``
      );
    }
  } else if (text.toLowerCase() == "close") {
    if (!curTab) {
      return res.end("There is no tab to close!");
    } else if (curTab.opener != req.userRecord?.slack_user_id) {
      return res.end(`Silly goose, this is <@${curTab.opener}>'s tab. Only they can close it.`);
    } else {
      curTab.closed = true;
      await curTab.save();
      await sendMessage(`-- <@${curTab.opener}> CLOSED THE BAGEL TAB --`);
      return res.end("Success! Your cart guid is `" + curTab.balsam_cart_guid + "`");
    }
  } else if (text.toLowerCase() == "inspect") {
  } else {
    return res.end("Invalid option! Usage: `/tab <new|close|inspect>`");
  }
});

export default tabRouter;
