import mongoose from "mongoose";
import OrderSchema from "../schemas/Order";

const OrderModel = mongoose.model("Order", OrderSchema);
export default OrderModel;
