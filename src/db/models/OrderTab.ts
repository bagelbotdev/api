import mongoose from "mongoose";
import OrderTabSchema from "../schemas/OrderTab";

const OrderTabModel = mongoose.model("OrderTab", OrderTabSchema);
export default OrderTabModel;
