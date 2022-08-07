import { Router } from "express";
import menuRouter from "./menu";
import registerRouter from "./register";
import unregisterRoute from "./unregister";
import payRouter from "./pay";
import orderRouter from "./order";
import adminRouter from "./admin";

const slashRouter = Router();

slashRouter.use("/register", registerRouter);
slashRouter.use("/unregister", unregisterRoute);
slashRouter.use("/menu", menuRouter);
slashRouter.use("/pay", payRouter);
slashRouter.use("/order", orderRouter);
slashRouter.use("/admin", adminRouter);

export default slashRouter;
