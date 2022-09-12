import randomWords from "random-words";
import fetch from "node-fetch";
import semver from 'semver-compare';

type Password = string;
type Wallet = string;
type Address = string;

export function getCoinEndpoint(path: string) {
  return `${process.env.COIN_ENDPOINT}/${path}`;
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

export async function isHostAlive(host: string) {
  try {
    const res = await fetch(`https://${host}/blockchain`, {
      method: 'GET',
      headers: {
	accept: 'text/html'
      }
    });

    return res.status - 400 < 0; // status code is not in the 4XX range or above
  } catch { return false; }
}

export async function checkHostVer(host: string) {
  const MIN_VER = '1.0.0';

  try {
    const res = await fetch(`https://${host}/meta/pkg`);
    const reportedVer = (await res.json()).version;
    return semver(reportedVer, MIN_VER) != -1;
  } catch { return false }
}