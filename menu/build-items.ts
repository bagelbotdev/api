import { ensureConnected } from "../src/db/util";
import MenuItem from "../src/db/models/MenuItem";

import { MenuItemSpec } from "../src/db/schemas/MenuItem";
import items from "./items.json";

import dotenv from 'dotenv';

dotenv.config();

(async () => {
  console.log("☁️  Connecting to mongo.erwijet.com...");
  await ensureConnected();
  console.log("⚙️  Purging old items...");
  await MenuItem.deleteMany({});
  for (let item of items as MenuItemSpec[]) {
    await new MenuItem(item).save();
    console.log("👉 Inserted " + item.name);
  }
  console.log("🎉 Rebuilt MenuItem Collection");

  process.exit(0);
})();
