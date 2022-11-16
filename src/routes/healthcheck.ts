import { Router } from "express";
import { getItem } from "../balsam/items";

const healthcheckRouter = Router();

healthcheckRouter.get("/", async (req, res) => {
  res.end("ok");
});

export default healthcheckRouter;
