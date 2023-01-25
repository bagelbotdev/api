import { queryFromBalsam } from "./utils";
import { MENU_ITEM_DETAILS_QUERY, MENU_ITEM_DETAILS_VARIABLES } from "../../gql/menu_item.gql";

type ModifierGroup = {
  guid: string;
  maxSelections: number | null;
  minSelections: number;
  modifiers: Modifier[];
  name: string;
  pricingMode: "INCLUDED" | "ADJUSTS_PRICE";
  __typename: "ModifierGroup";
};

type Modifier = {
  allowsDuplicates: boolean;
  isDefault: boolean;
  itemGroupGuid: null;
  itemGuid: string;
  modifierGroups: unknown[];
  name: string;
  outOfStock: boolean;
  price: number;
  selected: boolean;
  __typename: "Modifier";
};

export type BalsamItem = {
  itemGuid: string;
  itemGroupGuid: string;
  description: string;
  name: string;
  price: number;
  modifierGroups: ModifierGroup[];
};

export async function getItem(itemGuid: string, itemGroupGuid: string): Promise<BalsamItem | null> {
  const vars: MENU_ITEM_DETAILS_VARIABLES = {
    input: {
      itemGroupGuid,
      itemGuid,
    },
  };

  const balsamRes = await queryFromBalsam(MENU_ITEM_DETAILS_QUERY, vars);
  if (!balsamRes.data) {
    return null;
  }
  console.log(vars);
  console.log(balsamRes.data, balsamRes);
  const { description, name, price, modifierGroups } = balsamRes.data.menuItemDetails;

  return {
    itemGuid,
    itemGroupGuid,
    description,
    name,
    price,
    modifierGroups: modifierGroups as ModifierGroup[],
  };
}
