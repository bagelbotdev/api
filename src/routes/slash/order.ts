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

  if (!curTab)
    return res.end("There is no active tab! You can open a new tab for everyone with `/tab open`");

  const prefabMenuItem = await searchMenuItemsByKeyword(text);
  if (!prefabMenuItem)
    return res.end("I couldn't find any valid Menu Item with those keywords :sob:");

  const cartGuid = curTab.balsam_cart_guid;
  return res.json(
    mapOrderConfirmationToBlockKit(cartGuid!, prefabMenuItem._id.toString(), prefabMenuItem.name!)
  );
});

export default orderRouter;
