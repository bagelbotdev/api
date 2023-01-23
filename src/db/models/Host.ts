import mongoose from "mongoose";
import HostSchema from "../schemas/Host";

const HostModel = mongoose.model("Host", HostSchema);
/**
 * @deprecated - this feature is no longer supported by the bagelbot/bryxcoin ecosystem
 */
export default HostModel;
