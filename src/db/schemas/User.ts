import { Schema } from "mongoose";

export default new Schema({
  slack_user_id: { type: "string" },
  slack_user_name: { type: "string" },
  venmo_user_name: { type: "string" },
  first_name: { type: "string" },
  last_name: { type: "string" },
});

export interface UserSpec {
  slack_user_id: string;
  slack_user_name: string;
  venmo_user_name: string;
  first_name: string;
  last_name: string;
}
