import { queryFromBalsam, performBalsamMutation } from "./utils";
import mongoose from "mongoose";
import MenuItemModel from "../db/models/MenuItem";
import { ensureConnected } from "../db/util";
import { MenuItemSpec } from "../db/schemas/MenuItem";
import { GET_CART } from "../../gql/get_cart";
import { ADD_ITEM_TO_CART } from "../../gql/add_item_to_cart";
import { DELETE_ITEM_FROM_CART } from "../../gql/delete_item_from_cart";

export async function getCart(cartGuid: string) {
  const gqlRes = await queryFromBalsam(GET_CART, { guid: cartGuid });
  return gqlRes.data;
}

export async function requestNewCart() {
  const cartGuid = (
    await performBalsamMutation(ADD_ITEM_TO_CART, {
      input: {
        createCartInput: {
          restaurantGuid: "7fb7d7c2-7204-4fbe-ae03-ce2324ecab68",
          orderSource: "ONLINE",
          cartFulfillmentInput: {
            fulfillmentDateTime: null,
            fulfillmentType: "ASAP",
            diningOptionBehavior: "TAKE_OUT",
          },
        },
        selection: {
          itemGuid: "7bc2c647-4ef9-4f99-b940-272c62e6f71c",
          itemGroupGuid: "300383f2-6b47-49c8-85ee-7af133061c6e",
          quantity: 1,
          modifierGroups: [
            {
              guid: "3bd023bc-0cac-41e1-84e8-847aa0cbf2c0",
              modifiers: [
                {
                  itemGuid: "6e886c8f-6338-4c2e-9ebf-c3bab79cda99",
                  itemGroupGuid: "300383f2-6b47-49c8-85ee-7af133061c6e",
                  quantity: 1,
                  modifierGroups: [],
                },
              ],
            },
          ],
          specialInstructions: "",
          itemMasterId: "400000000008715250",
        },
      },
    })
  ).data.addItemToCartV2.cart.guid;

  const selectedEntry = (await queryFromBalsam(GET_CART, { guid: cartGuid })).data.cartV2.cart.order
    .selections[0].guid;

  await deleteSelectedEntryFromCart(cartGuid, selectedEntry);

  return cartGuid;
}

export async function addToCart(cartGuid: string, prefab: MenuItemSpec) {
  const gqlRes = await performBalsamMutation(ADD_ITEM_TO_CART, {
    input: {
      cartGuid,
      selection: {
        itemGuid: prefab.balsam_item_guid,
        itemGroupGuid: prefab.balsam_group_guid,
        quantity: 1,
        modifierGroups: prefab.balsam_modifiers.map((modifierSet) => ({
          guid: modifierSet.modifier_set_guid,
          modifiers: modifierSet.modifiers.map((modifier) => ({
            itemGuid: modifier.modifier_guid,
            itemGroupGuid: modifier.modifier_group_guid,
            modifierGroups: [],
            quantity: 1,
          })),
        })),
      },
    },
  });

  return gqlRes.data;
}

export async function deleteSelectedEntryFromCart(cartGuid: string, cartSelectionGuid: string) {
  const gqlRes = await performBalsamMutation(DELETE_ITEM_FROM_CART, {
    input: { cartGuid, selectionGuid: cartSelectionGuid },
  });
  return gqlRes.data;
}

export async function addToEmptyCart(oid: string) {
  await ensureConnected();
  const item = (await MenuItemModel.findById(oid)) as MenuItemSpec;

  const gqlRes = await performBalsamMutation(ADD_ITEM_TO_CART, {
    input: {
      createCartInput: {
        restaurantGuid: "7fb7d7c2-7204-4fbe-ae03-ce2324ecab68",
        orderSource: "ONLINE",
        cartFulfillmentInput: {
          fulfillmentDateTime: null,
          fulfillmentType: "ASAP",
          diningOptionBehavior: "TAKE_OUT",
        },
      },
      selection: {
        itemGuid: "7bc2c647-4ef9-4f99-b940-272c62e6f71c",
        itemGroupGuid: "300383f2-6b47-49c8-85ee-7af133061c6e",
        quantity: 1,
        modifierGroups: [
          {
            guid: "3bd023bc-0cac-41e1-84e8-847aa0cbf2c0",
            modifiers: [
              {
                itemGuid: "6e886c8f-6338-4c2e-9ebf-c3bab79cda99",
                itemGroupGuid: "300383f2-6b47-49c8-85ee-7af133061c6e",
                quantity: 1,
                modifierGroups: [],
              },
            ],
          },
        ],
        specialInstructions: "",
        itemMasterId: "400000000008715250",
      },
    },
  });

  return gqlRes.data;
}
