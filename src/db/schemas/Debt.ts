import { Schema } from "mongoose";

export default new Schema({
  debtor_slack_id: { type: "string" },
  payee_slack_id: { type: "string" },
  amount_due: { type: "number" },
});

export interface Debt {
  debtor_slack_id: string;
  payee_slack_id: string;
  amount_due: number;
}
