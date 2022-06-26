import fetch from "node-fetch";
import { createClient, TypedDocumentNode, OperationResult } from "@urql/core";

// @ts-ignore
globalThis.fetch = fetch;

export function queryFromBalsam(
  query: TypedDocumentNode<any, object>,
  variables?: any
) {
  return new Promise<OperationResult<any, object>>((resolve, reject) => {
    createClient({
      url: "https://ws-api.toasttab.com/consumer-app-bff/v1/graphql",
    })
      .query(query, {
        input: {
          shortUrl: "balsam-bagels",
          dateTime: new Date().toISOString(),
          restaurantGuid: "7fb7d7c2-7204-4fbe-ae03-ce2324ecab68",
          menuApi: "DO",
        },
        ...variables,
      })
      .toPromise()
      .catch(reject)
      .then((opRes: any) => resolve(opRes));
  });
}
