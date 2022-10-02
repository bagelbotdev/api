import { Schema, SchemaType, Types } from "mongoose";

export interface OrderSpec {
    user: Types.ObjectId,
    item: Types.ObjectId,
    tab?: Types.ObjectId,
    created: number,
    future: boolean
}

export default new Schema<OrderSpec>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  tab: { type: Schema.Types.ObjectId, ref: 'OrderTab' },
  item: { type: Schema.Types.ObjectId, ref: 'MenuItem', required: true },
  created: { type: 'number', required: true },
  future: { type: 'boolean', default: false, required: true }
});