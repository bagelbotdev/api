import { getCoinEndpoint } from "./utils";

export function newBlock() {
  return fetch(getCoinEndpoint("miner/mine"), {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      rewardAddress: "90c65daf3faa89179ccbcb677ca3e4a65f33b9ba8521494b0e75a3a6f46cb897",
    }),
  });
}
