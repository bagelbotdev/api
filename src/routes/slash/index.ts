import { Router } from "express";
import menuRouter from "./menu";

const slashRouter = Router();

slashRouter.use("/menu", menuRouter);

export default slashRouter;
