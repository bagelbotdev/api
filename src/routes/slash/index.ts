import { Router } from "express";
import menuRouter from "./menu";
import registerRouter from "./register";
import unregisterRoute from "./unregister";
import payRouter from "./pay";
import orderRouter from "./order";
import balanceRouter from "./balance";
import identityRouter from "./identity";
import tabRouter from "./tab";

const slashRouter = Router();

slashRouter.use("/register", registerRouter);
slashRouter.use("/unregister", unregisterRoute);
slashRouter.use("/identity", identityRouter);
slashRouter.use("/menu", menuRouter);
slashRouter.use("/balance", balanceRouter);
slashRouter.use("/pay", payRouter);
slashRouter.use("/order", orderRouter);
slashRouter.use("/tab", tabRouter);

export default slashRouter;
