import { Schema, SchemaType, Types } from "mongoose";
import MenuItem, { MenuItemSpec } from "./MenuItem";

export interface OrderSpec {
  user: Types.ObjectId;
  // Name and keywords will never be set on an order, it will have been customized!
  item: MenuItemSpec;
  tab?: Types.ObjectId;
  created: number;
  future: boolean;
}

export default new Schema<OrderSpec>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  tab: { type: Schema.Types.ObjectId, ref: "OrderTab" },
  item: { type: MenuItem, required: true },
  created: { type: "number", required: true },
  future: { type: "boolean", default: false, required: true },
});
