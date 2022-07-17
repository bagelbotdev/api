import mongoose from "mongoose";
import DebtSchema from "../schemas/Debt";

const DebtModel = mongoose.model("Debt", DebtSchema);
export default DebtModel;
