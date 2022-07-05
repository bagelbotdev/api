import { Router } from "express";
import menuRouter from "./menu";
import registerRouter from "./register";

const slashRouter = Router();

slashRouter.use("/register", registerRouter);
slashRouter.use("/menu", menuRouter);

export default slashRouter;
