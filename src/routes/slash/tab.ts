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

  if (text.toLowerCase() == "open") {
    if (curTab == null) {
      const newTab = new OrderTabModel();
      newTab.opened_at = Date.now();
      newTab.opener = req.userRecord?.slack_user_id!;
      newTab.closed = false;
      newTab.order_logs = `Tab created by ${req.userRecord?.first_name} ${req.userRecord?.last_name}`;
      newTab.balsam_cart_guid = await requestNewCart();

      await newTab.save();
      sendMessage(`-- <@${req.userRecord?.slack_user_id}> OPENED A NEW TAB --`);
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
      await sendMessage('```\nToday\'s Tab\n\n' + curTab.order_logs! + '\n```');
      return res.end("Success! Access your cart at https://www.toasttab.com/balsam-bagels/v3/?rl=1&cart=" + curTab.balsam_cart_guid);
    }
  } else {
    return res.end("Invalid option! Usage: `/tab <open|close>`");
  }
});

export default tabRouter;
