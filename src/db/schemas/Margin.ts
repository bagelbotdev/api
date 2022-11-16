import { Schema, Types } from "mongoose";

export default new Schema({
  borrower: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  lender: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  margin_fee: { type: "number", required: true, defualt: 200 },
  opened_at: { type: "number", required: true },
  amount: { type: "number", required: true },
});

export interface MarginSpec {
  borrower: Types.ObjectId;
  lender: Types.ObjectId;
  opened_at: number;
  margin_fee: number;
  amount: number;
}
