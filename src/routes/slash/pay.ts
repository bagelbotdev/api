import { Router } from "express";
import registration from "../../middlewares/registration";
import promptForPaymentConfirmation from "../../slack/blockkit/prefab/prompt-for-payment-confirmation.json";

const payRouter = Router();
payRouter.use(registration); // require registration

payRouter.post("/", async (req, res) => {
  console.log(req.userRecord);
  console.log(req.body);

  res.json(promptForPaymentConfirmation);
});

export default payRouter;
