import { performBalsamMutation } from "./utils";
import { ADD_ITEM_TO_EMPTY_CART } from "../../gql/cart.gql";

export async function addToEmptyCart(itemGuid: string, itemGuidGroup: string) {
  const gqlRes = await performBalsamMutation(ADD_ITEM_TO_EMPTY_CART, {
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
