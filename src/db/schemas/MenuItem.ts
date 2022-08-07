import { Schema } from "mongoose";

const BalsamItemModifier = new Schema({
  modifier_group_guid: { type: "string" },
  modifier_guid: { type: "string" },
});

const BalsamItemModifierSet = new Schema({
  modifier_set_guid: { type: "string" },
  modifiers: [{ type: BalsamItemModifier }],
});

export default new Schema({
  name: { type: "string" },
  keywords: [{ type: Schema.Types.String }],
  balsam_item_guid: { type: "string" },
  balsam_group_guid: { type: "string" },
  balsam_modifiers: [{ type: BalsamItemModifierSet }],
  price: { type: "number" },
});

export interface MenuItemSpec {
  name: string;
  price: number;
  keywords: string[];
  balsam_item_guid: string;
  balsam_group_guid: string;
  balsam_modifiers: {
    modifier_set_guid: string;
    modifiers: {
      modifier_group_guid: string;
      modifier_guid: string;
    }[];
  }[];
}
