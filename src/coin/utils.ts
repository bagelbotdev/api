import randomWords from "random-words";
import fetch from "node-fetch";
import semver from "semver-compare";

import { min_host_ver } from "../../package.json";

type Password = string;
type Wallet = string;
type Address = string;

export function getCoinEndpoint(path: string) {
  if (path.includes('operator/wallets')) return `https://tx01.bxcn.org/${path}`;
  else return `${process.env.COIN_ENDPOINT}/${path}`;
}

export function createNewPassword(): Password {
  return randomWords(10).join(" ") as Password;
}

export async function createWallet(password: string): Promise<Wallet> {
  const res = await fetch(getCoinEndpoint("operator/wallets"), {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      password,
    }),
  });

  return (await res.json()).id as Wallet;
}

export async function createAddress(wallet: string, password: string): Promise<Address> {
  const res = await fetch(getCoinEndpoint(`operator/wallets/${wallet}/addresses`), {
    method: "POST",
    headers: {
      password,
    },
  });

  return (await res.json()).address as Address;
}

export async function newCoinUser(): Promise<[Password, Wallet, Address]> {
  const password = createNewPassword();
  const wallet = await createWallet(password);
  const address = await createAddress(wallet, password);

  return [password, wallet, address];
}

export function isHostAlive(host: string): Promise<boolean> {
  return new Promise(async (resolve, reject) => {
    setTimeout(() => resolve(false), 1000); // only wait for 1 sec

    try {
      const res = await fetch(`https://${host}/blockchain`, {
        method: "GET",
        headers: {
          accept: "text/html",
        },
      });

      resolve(res.status - 400 < 0); // status code is not in the 4XX range or above
    } catch {
      resolve(false);
    }
  });
}

export async function checkHostVer(host: string) {
  try {
    const res = await fetch(`https://${host}/meta/pkg`);
    const reportedVer = (await res.json()).version;
    return semver(reportedVer, min_host_ver) != -1;
  } catch {
    return false;
  }
}
