import { Schema } from "mongoose";

export default new Schema({
  opener: { type: String, required: true },
  opened_at: { type: Number, required: true },
  order_logs: { type: String },
  balsam_cart_guid: { type: String, required: true },
  closed: { type: Boolean, required: true },
});

export interface OrderTabSpec {
  opener: string,
  opened_at: number,
  order_logs: string,
  balsam_cart_guid: string,
  closed: boolean
}