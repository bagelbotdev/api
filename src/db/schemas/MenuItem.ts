import { Schema } from "mongoose";

const BalsamItemModifier = new Schema<
  MenuItemSpec["balsam_modifiers"][number]["modifiers"][number]
>({
  modifier_group_guid: { type: String },
  modifier_guid: { type: String },
});

const BalsamItemModifierSet = new Schema<MenuItemSpec["balsam_modifiers"][number]>({
  modifier_set_guid: { type: String },
  modifiers: [{ type: BalsamItemModifier }],
});

export function previewItem(item: MenuItemSpec): string {
  return item.receipt_name || item.name;
}

export default new Schema<MenuItemSpec>({
  name: { type: String },
  receipt_name: { type: String, required: false },
  keywords: [{ type: Schema.Types.String, required: false }],
  balsam_item_guid: { type: String },
  balsam_group_guid: { type: String },
  balsam_modifiers: [{ type: BalsamItemModifierSet }],
  price: { type: Number },
});

export interface MenuItemSpec {
  name: string;
  receipt_name?: string;
  price: number;
  keywords?: string[];
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
