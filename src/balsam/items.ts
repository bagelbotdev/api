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

export async function getItem(itemGuid: string, itemGroupGuid: string) {
  const vars: MENU_ITEM_DETAILS_VARIABLES = {
    input: {
      itemGroupGuid,
      itemGuid,
    },
  };

  const balsamRes = await queryFromBalsam(MENU_ITEM_DETAILS_QUERY, vars);
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
