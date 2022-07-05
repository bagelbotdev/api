import mongoose from "mongoose";

export async function ensureConnected() {
  await mongoose.connect(
    "mongodb://sys-rw-bagelbot:Tna*ah2OOka@mongo.erwijet.com/bagelbot?authMechanism=DEFAULT&authSource=bagelbot"
  );
}
