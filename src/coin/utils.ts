import randomWords from "random-words";
import fetch from "node-fetch";
import semver from "semver-compare";

import { min_host_ver } from "../../package.json";

type Password = string;
type Wallet = string;
type Address = string;

export function getCoinEndpoint(path: 'ledger' | 'tx') {
  return `${process.env.COIN_ENDPOINT}/${path}`;
}

export function createNewPassword(): Password {
  return randomWords(10).join(" ") as Password;
}

// export async function createWallet(password: string): Promise<Wallet> {
//   const res = await fetch(getCoinEndpoint("operator/wallets"), {
//     method: "POST",
//     headers: {
//       "content-type": "application/json",
//     },
//     body: JSON.stringify({
//       password,
//     }),
//   });

//   return (await res.json()).id as Wallet;
// }

// TODO: implement new address onboarding

// export async function createAddress(wallet: string, password: string): Promise<Address> {
//   const res = await fetch(getCoinEndpoint(`operator/wallets/${wallet}/addresses`), {
//     method: "POST",
//     headers: {
//       password,
//     },
//   });

//   return (await res.json()).address as Address;
// }

export async function newCoinUser(): Promise<[Password, Wallet, Address]> {
  const password = createNewPassword();
  // const wallet = await createWallet(password);
  // const address = await createAddress(wallet, password);

  const wallet = "00";
  const address = "00";

  return [password, wallet, address];
}