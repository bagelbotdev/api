import mongoose from "mongoose";
import DebtModel from "./models/Debt";

export async function ensureConnected() {
  const PRIMARY_CONN_STR =
    "mongodb://bagelbot-sys:hAy&5mJAg;-@mongo.erwijet.com:30909/bagelbot?authMechanism=DEFAULT&authSource=bagelbot";

  await mongoose.connect(PRIMARY_CONN_STR);
}

export async function getVenmoPayableLink(debtor: string, payee: string) {
  await ensureConnected();

  const { amount_due } = (
    await DebtModel.where({
      debtor_slack_id: debtor,
      payee_slack_id: payee,
    })
  ).shift() || { amount_due: 0 };

  return `https://venmo.com/${payee}?txn=pay&amount=${amount_due}&memo=bagels`;
}
