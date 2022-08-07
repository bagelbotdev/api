import { gql } from "@urql/core";

export const MENU_ITEM_DETAILS_QUERY = gql`
  query MENU_ITEM_DETAILS(
    $input: MenuItemDetailsInput!
    $nestingLevel: Int = 10
  ) {
    menuItemDetails(input: $input) {
      description
      name
      guid
      itemGroupGuid
      calories
      price
      imageUrl
      usesFractionalQuantity
      unitOfMeasure
      masterId
      modifierGroups(nestingLevel: $nestingLevel) {
        ...ModifierGroupFields
        modifiers {
          ...ModifierFields
          modifierGroups {
            ...ModifierGroupFields
            modifiers {
              ...ModifierFields
              modifierGroups {
                ...ModifierGroupFields
                modifiers {
                  ...ModifierFields
                  modifierGroups {
                    ...ModifierGroupFields
                    modifiers {
                      ...ModifierFields
                      modifierGroups {
                        ...ModifierGroupFields
                        modifiers {
                          ...ModifierFields
                          modifierGroups {
                            ...ModifierGroupFields
                            modifiers {
                              ...ModifierFields
                              modifierGroups {
                                ...ModifierGroupFields
                                modifiers {
                                  ...ModifierFields
                                  modifierGroups {
                                    ...ModifierGroupFields
                                    modifiers {
                                      ...ModifierFields
                                      modifierGroups {
                                        ...ModifierGroupFields
                                        modifiers {
                                          ...ModifierFields
                                          modifierGroups {
                                            ...ModifierGroupFields
                                            modifiers {
                                              ...ModifierFields
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
  }

  fragment ModifierGroupFields on ModifierGroup {
    guid
    minSelections
    maxSelections
    name
    pricingMode
    __typename
  }

  fragment ModifierFields on Modifier {
    itemGuid
    itemGroupGuid
    name
    price
    selected
    isDefault
    outOfStock
    allowsDuplicates
    __typename
  }
`;

export interface MENU_ITEM_DETAILS_VARIABLES {
  input: {
    itemGroupGuid: string;
    itemGuid: string;
  };
}
