import { Router } from "express";
import { addToCart } from "../../balsam/cart";
import OrderTabModel from "../../db/models/OrderTab";
import { MenuItemSpec } from "../../db/schemas/MenuItem";
import mapOrderConfirmationToBlockKit from "../../slack/blockkit/mappers/confirmOrder";
import { ensureConnected, searchMenuItemsByKeyword } from "../../db/util";
import registration from "../../middlewares/registration";
import { sendMessage } from "../../slack/utils";
const orderRouter = Router();

orderRouter.use(registration);

orderRouter.post("/", async (req, res) => {
  const { text } = req.body;
  await ensureConnected();
  const curTab = (await OrderTabModel.find({ closed: false })).shift();

  const [prefabMenuItem, score] = await searchMenuItemsByKeyword(text);

  if (!prefabMenuItem)
    return res.end("I couldn't find any valid Menu Item with those keywords :sob:");

  const cartGuid = curTab?.balsam_cart_guid ?? "<NONE>";
  return res.json(
    mapOrderConfirmationToBlockKit(
      cartGuid!,
      prefabMenuItem._id!.toString(),
      prefabMenuItem.name,
      prefabMenuItem.price,
      text.trim(),
      score
    )
  );
});

export default orderRouter;
