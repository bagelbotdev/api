import { Router } from "express";
import { addToCart } from "../../balsam/cart";
import OrderTabModel from "../../db/models/OrderTab";
import MenuItem, { MenuItemSpec } from "../../db/schemas/MenuItem";
import mapOrderConfirmationToBlockKit from "../../slack/blockkit/mappers/confirmOrder";
import { ensureConnected, searchMenuItemsByKeyword } from "../../db/util";
import registration from "../../middlewares/registration";
import { sendMessage } from "../../slack/utils";
import MenuItemModel from "../../db/models/MenuItem";
const orderRouter = Router();

orderRouter.use(registration);

orderRouter.post("/", async (req, res) => {
  const text: string = req.body.text;
  await ensureConnected();
  const curTab = (await OrderTabModel.find({ closed: false })).shift();

  const results = await searchMenuItemsByKeyword(text);

  if (text.trim().split(" ").shift() == "dryrun") {
    return res.end(
      `Found the following items:\n${(
        await Promise.all(results.map((result) => MenuItemModel.find({ _id: result.ref })))
      ).reduce((acc, cur) => acc + `${cur!.shift()!.name!}\n`, "")}`
    );
  }

  if (results.length == 0)
    return res.end("I couldn't find any valid Menu Item with those keywords :sob:");

  const bestResult = results.shift();

  const prefabMenuItem = await MenuItemModel.findById(bestResult!.ref);

  const cartGuid = curTab?.balsam_cart_guid ?? "<NONE>";
  return res.json(
    mapOrderConfirmationToBlockKit(
      cartGuid!,
      prefabMenuItem!._id!.toString(),
      prefabMenuItem!.name!,
      prefabMenuItem!.price!,
      text.trim(),
      bestResult!.score
    )
  );
});

export default orderRouter;
