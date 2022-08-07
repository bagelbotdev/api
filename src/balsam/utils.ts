import fetch from "node-fetch";
import { createClient, TypedDocumentNode, OperationResult } from "@urql/core";

// @ts-ignore
globalThis.fetch = fetch;

export function queryFromBalsam(
  query: TypedDocumentNode<any, object>,
  variables?: any
) {
  return new Promise<OperationResult<any, object>>((resolve, reject) => {
    const { input } = variables;

    createClient({
      url: "https://ws-api.toasttab.com/consumer-app-bff/v1/graphql",
    })
      .query(query, {
        ...variables,
        input: {
          shortUrl: "balsam-bagels",
          dateTime: new Date().toISOString(),
          restaurantGuid: "7fb7d7c2-7204-4fbe-ae03-ce2324ecab68",
          visibility: "TOAST_ONLINE_ORDERING",
          menuApi: "DO",
          ...input,
        },
      })
      .toPromise()
      .catch(reject)
      .then((opRes: any) => resolve(opRes));
  });
}

export function performBalsamMutation(
  mutation: TypedDocumentNode<any, object>,
  variables?: any
): Promise<any> {
  return new Promise((resolve, reject) => {
    createClient({
      url: "https://ws-api.toasttab.com/consumer-app-bff/v1/graphql",
    })
      .mutation(mutation, variables)
      .toPromise()
      .catch(reject)
      .then((opRes: any) => resolve(opRes));
  });
}
