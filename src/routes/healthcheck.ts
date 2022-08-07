import { Router } from "express";
import { getItem } from "../balsam/items";

const healthcheckRouter = Router();

healthcheckRouter.get("/", async (req, res) => {
  res.end("OK 1");
});

export default healthcheckRouter;
