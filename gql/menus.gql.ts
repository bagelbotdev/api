import { gql } from "@urql/core";

export const MENUS_QUERY = gql`
  query MENUS($input: MenusInput!) {
    menusV3(input: $input) {
      ... on MenusResponse {
        menus {
          id
          name
          groups {
            name
            items {
              description
              guid
              name
              outOfStock
              price
            }
          }
        }
      }
      ... on GeneralError {
        code
        message
      }
    }
  }
`;
