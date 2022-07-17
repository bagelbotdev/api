import { Router } from "express";
const healthcheckRouter = Router();

healthcheckRouter.get("/", (req, res) => res.end("i love bagels!"));

export default healthcheckRouter;
