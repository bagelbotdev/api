import { Router } from "express";
import MenuItemModel from "../../db/models/MenuItem";
import { ensureConnected } from "../../db/util";
import registration from "../../middlewares/registration";

const menuRouter = Router();
menuRouter.use(registration); // require users to be registered

menuRouter.post("/", async (req, res) => {
  await ensureConnected();
  const items = await MenuItemModel.find({ });

  return res.json({ text: '```\n' + items.map(item => item.name!).sort((a, b) => a.localeCompare(b)).join('\n') + '```'});
});

export default menuRouter;
