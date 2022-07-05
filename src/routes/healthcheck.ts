import { Router } from "express";
const healthcheckRouter = Router();

healthcheckRouter.get("/", (_req, res) => res.end("bagel"));

export default healthcheckRouter;
