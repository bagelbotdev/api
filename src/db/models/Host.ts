import mongoose from "mongoose";
import HostSchema from "../schemas/Host";

const HostModel = mongoose.model("Host", HostSchema);
export default HostModel;
