import { queryFromBalsam } from "./utils";
import { MENU_ITEM_DETAILS_QUERY, MENU_ITEM_DETAILS_VARIABLES } from "../../gql/menu_item.gql";

export async function getItem(itemGuid: string, itemGroupGuid: string) {
  const vars: MENU_ITEM_DETAILS_VARIABLES = {
    input: {
      itemGroupGuid,
      itemGuid,
    },
  };

  const balsamRes = await queryFromBalsam(MENU_ITEM_DETAILS_QUERY, vars);
  const { description, name, price, modifierGroups } = balsamRes.data;

  return { itemGuid, itemGroupGuid, description, name, price, modifierGroups };
}
