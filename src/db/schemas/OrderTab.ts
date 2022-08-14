import { Schema } from "mongoose";

export default new Schema({
  opener: { type: "string" },
  opened_at: { type: "number" },
  balsam_cart_guid: { type: "string" },
  closed: { type: "boolean" },
});
