import { Schema } from "mongoose";

export default new Schema({
  host: { type: "string" },
  owner_id: { type: "string" },
});

export interface HostSpec {
  host: string;
  owner_id: { type: "string" };
}
