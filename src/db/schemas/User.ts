import mongoose, { Schema } from "mongoose";

export default new Schema({
  slack_user_id: { type: "string" },
  slack_user_name: { type: "string" },
  venmo_user_name: { type: "string" },
  first_name: { type: "string" },
  last_name: { type: "string" },
  bryxcoin_wallet: { type: "string" },
  bryxcoin_password: { type: "string" },
  bryxcoin_address: { type: "string" },
  subscribed_tab_open: { type: "boolean" },
});

export interface UserSpec {
  _id: mongoose.Types.ObjectId;
  slack_user_id: string;
  slack_user_name: string;
  venmo_user_name: string;
  first_name: string;
  last_name: string;
  bryxcoin_wallet: string;
  bryxcoin_password: string;
  bryxcoin_address: string;
  subscribed_tab_open: boolean;
}
