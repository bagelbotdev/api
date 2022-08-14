import { gql } from "@urql/core";
export const DELETE_ITEM_FROM_CART = gql`
  mutation DELETE_ITEM_FROM_CART($input: DeleteItemFromCartInput!) {
    deleteItemFromCartV2(input: $input) {
      ... on CartResponse {
        ...cartResponse
        __typename
      }
      ... on CartModificationError {
        code
        message
        __typename
      }
      ... on CartOutOfStockError {
        cart {
          ...cart
          __typename
        }
        message
        items {
          name
          guid
          __typename
        }
        __typename
      }
      __typename
    }
  }

  fragment cartResponse on CartResponse {
    cart {
      ...cart
      __typename
    }
    warnings {
      code
      message
      __typename
    }
    info {
      code
      message
      __typename
    }
    __typename
  }

  fragment cart on Cart {
    guid
    order {
      deliveryInfo {
        address1
        address2
        city
        state
        zipCode
        latitude
        longitude
        notes
        __typename
      }
      numberOfSelections
      selections {
        guid
        groupingKey
        itemGuid
        itemGroupGuid
        name
        preDiscountPrice
        price
        quantity
        usesFractionalQuantity
        fractionalQuantity {
          unitOfMeasure
          quantity
          __typename
        }
        modifiers {
          guid
          name
          price
          groupingKey
          modifiers {
            guid
            name
            price
            groupingKey
            modifiers {
              guid
              name
              price
              groupingKey
              modifiers {
                guid
                name
                price
                groupingKey
                modifiers {
                  guid
                  name
                  price
                  groupingKey
                  modifiers {
                    guid
                    name
                    price
                    groupingKey
                    modifiers {
                      guid
                      name
                      price
                      groupingKey
                      modifiers {
                        guid
                        name
                        price
                        groupingKey
                        modifiers {
                          guid
                          name
                          price
                          groupingKey
                          modifiers {
                            guid
                            name
                            price
                            groupingKey
                            __typename
                          }
                          __typename
                        }
                        __typename
                      }
                      __typename
                    }
                    __typename
                  }
                  __typename
                }
                __typename
              }
              __typename
            }
            __typename
          }
          __typename
        }
        __typename
      }
      discounts {
        restaurantDiscount {
          guid
          name
          amount
          promoCode
          __typename
        }
        loyaltyDiscount {
          guid
          amount
          __typename
        }
        loyaltyDiscounts {
          type
          amount
          guid
          __typename
        }
        globalReward {
          amount
          name
          rewardType
          total
          __typename
        }
        __typename
      }
      discountsTotal
      deliveryChargeTotal
      serviceChargeTotal
      subtotal
      tax
      total
      __typename
    }
    quoteTime
    paymentOptions {
      atCheckout {
        paymentType
        __typename
      }
      uponReceipt {
        paymentType
        __typename
      }
      __typename
    }
    preComputedTips {
      percent
      value
      __typename
    }
    approvalRules {
      ruleType
      requiredAdjustment
      thresholdAmount
      __typename
    }
    diningOptionBehavior
    fulfillmentType
    fulfillmentDateTime
    takeoutQuoteTime
    deliveryQuoteTime
    deliveryProviderInfo {
      provider
      needsDeliveryCommunicationConsent
      __typename
    }
    cartUpsellInfo {
      upsellItems
      __typename
    }
    __typename
  }
`;

export type DELETE_ITEM_FROM_CART_VARIABLES = {
  input: {
    cartGuid: string;
    selectionGuid: string;
  };
};
