import { Router } from "express";
import registrationForm from "../../slack/blockkit/prefab/registration-form.json";

const registerRouter = Router();

registerRouter.post("/", (req, res) => {
  res.json(registrationForm);
});

export default registerRouter;
