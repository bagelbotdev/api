import { Router } from "express";
import menuRouter from "./menu";
import registerRouter from "./register";
import unregisterRoute from "./unregister";
import payRouter from "./pay";

const slashRouter = Router();

slashRouter.use("/register", registerRouter);
slashRouter.use("/unregister", unregisterRoute);
slashRouter.use("/menu", menuRouter);
slashRouter.use("/pay", payRouter);

export default slashRouter;
