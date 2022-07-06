import { Router } from "express";
import registration from "../../middlewares/registration";
import unregisterConfirmation from "../../slack/blockkit/prefab/unregister-confirmation.json";

const unregisterRoute = Router();

unregisterRoute.use(registration); // require users to be registered
unregisterRoute.post("/", (req, res) => res.json(unregisterConfirmation));

export default unregisterRoute;
