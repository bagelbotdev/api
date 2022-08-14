import { Schema } from "mongoose";

export default new Schema({
  opener: { type: "string" },
  opened_at: { type: "number" },
  orders: [
    {
      for: { type: "string" },
      balsam_item_guid: { type: "string" },
    },
  ],
  balsam_cart_guid: { type: "string" },
  closed: { type: "boolean" },
});
