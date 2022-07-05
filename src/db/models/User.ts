import mongoose from "mongoose";
import userSchema from "../schemas/User";

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
