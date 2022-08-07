import mognoose from "mongoose";
import MenuItemSchema from "../schemas/MenuItem";

const MenuItemModel = mognoose.model("MenuItem", MenuItemSchema);
export default MenuItemModel;
