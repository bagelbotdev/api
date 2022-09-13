import { Schema } from "mongoose";

const BalsamItemModifier = new Schema({
  modifier_group_guid: { type: String },
  modifier_guid: { type: String },
});

const BalsamItemModifierSet = new Schema({
  modifier_set_guid: { type: String },
  modifiers: [{ type: BalsamItemModifier }],
});

export default new Schema({
  name: { type: String },
  keywords: [{ type: Schema.Types.String }],
  balsam_item_guid: { type: String },
  balsam_group_guid: { type: String },
  balsam_modifiers: [{ type: BalsamItemModifierSet }],
  price: { type: Number },
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
