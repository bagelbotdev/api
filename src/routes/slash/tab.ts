import { Router } from "express";
import { addToCart, requestNewCart } from "../../balsam/cart";
import { canAfford, createTransactionBySlackId, getBalance } from "../../coin/payment";
import MenuItemModel from "../../db/models/MenuItem";
import OrderModel from "../../db/models/Order";
import OrderTabModel from "../../db/models/OrderTab";
import UserModel from "../../db/models/User";
import MenuItem, { MenuItemSpec } from "../../db/schemas/MenuItem";
import registration from "../../middlewares/registration";
import { sendMessage } from "../../slack/utils";

const tabRouter = Router();

tabRouter.use(registration);

tabRouter.post("/", async (req, res) => {
  const { text } = req.body;
  const curTab = (await OrderTabModel.find({ closed: false })).shift();

  if (text.toLowerCase().includes("open")) {
    if (curTab == null) {
      const newTab = new OrderTabModel();
      newTab.opened_at = Date.now();
      newTab.opener = req.userRecord?.slack_user_id!;
      newTab.closed = false;
      newTab.balsam_cart_guid = await requestNewCart();

      await newTab.save();

      sendMessage(
        `:bagel: <@${req.userRecord?.slack_user_id}> opened a tab!\n` +
          (text.includes("noping")
            ? ""
            : (await UserModel.find({ subscribed_tab_open: true })).reduce(
                (str, cur) => (str += `<@${cur.slack_user_id}> `),
                ""
              )),
        "#0cdc73"
      );

      res.end(); // basic ack

      // apply scheduled orders (future orders)

      const futures = await OrderModel.find({ future: true });

      for (let order of futures) {
        const user = await UserModel.findById(order.user);
        const item = await MenuItemModel.findById(order.item);

        if (
          user?._id != req.userRecord?._id &&
          !(await canAfford(user?.bryxcoin_address!, item?.price! * 100))
        ) {
          console.log("failed");
          await sendMessage(
            `Scheduled order \`${item?.name}\` for <@${user?.slack_user_id}> was ignored due to a lack of funds.`,
            "#ff0033"
          );
          continue;
        }

        console.log("passed");

        if (user?.slack_user_id != req.userRecord?.slack_user_id)
          await createTransactionBySlackId(
            user?.slack_user_id!,
            req.userRecord?.slack_user_id!,
            item?.price! * 100
          );

        await addToCart(
          newTab.balsam_cart_guid,
          item as unknown as MenuItemSpec,
          user?.first_name ?? ""
        );

        await sendMessage(
          `Scheduled order \`${item?.name}\` for <@${user?.slack_user_id!}> was applied!`,
          "#eaddca"
        );

        // convert to "resolved" order

        order.tab = newTab._id;
        order.future = false;

        await order.save();
      }

      return;
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

      res.end(); // basic ack

      const orders = await OrderModel.find({ tab: curTab._id });

      let orderReport = "";
      let totalPrice = 0;

      for (let order of orders) {
        const item = await MenuItemModel.findById(order.item);
        const user = await UserModel.findById(order.user);
        orderReport += `${user?.first_name + " " + user?.last_name} ordered ${item?.name} ($${
          item?.price
        })\n`;
        totalPrice += item?.price ?? 0;
      }

      await sendMessage(
        `Bagel tab closed!\nhttp://carts.bagelbot.net/${curTab.balsam_cart_guid}\n\n` +
          orderReport +
          "\n---\nTotal: $" +
          totalPrice,
        "#cc8899"
      );
      return;
    }
  } else {
    return res.end("Invalid option! Usage: `/tab <open|close>`");
  }
});

export default tabRouter;
