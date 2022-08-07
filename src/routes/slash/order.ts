import { Router } from "express";
import { searchMenuItemsByKeyword } from "../../db/util";
import registration from "../../middlewares/registration";
const orderRouter = Router();

orderRouter.use(registration);

orderRouter.post("/", async (req, res) => {
  const { text } = req.body;
  res.end(
    req.userRecord!.first_name +
      " would like a `" +
      ((await searchMenuItemsByKeyword(text))?.name || "no record found :(") +
      "`"
  );
});

export default orderRouter;
