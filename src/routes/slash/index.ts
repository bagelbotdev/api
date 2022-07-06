import { Router } from "express";
import menuRouter from "./menu";
import registerRouter from "./register";
import unregisterRoute from "./unregister";

const slashRouter = Router();

slashRouter.use("/register", registerRouter);
slashRouter.use("/unregister", unregisterRoute);
slashRouter.use("/menu", menuRouter);

export default slashRouter;
