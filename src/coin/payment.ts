import { getCoinEndpoint } from "./utils";
import { ensureConnected } from "../db/util";
import UserModel from "../db/models/User";

export async function canAfford(address: string, coinQuantity: number) {
  return await getBalance(address) >= coinQuantity;
}

export async function getBalance(address: string) {
  try {
    const res = await fetch(getCoinEndpoint(`operator/${address}/balance`));
    return (await res.json()).balance;
  } catch {
    return -1; // address with no transactions will error. Use -1 to represent a fresh address
  }
}

export async function createTransaction(
  payerWallet: string,
  payerPassword: string,
  payerAddress: string,
  payeeAddress: string,
  coinQuantity: number
) {
  const payload = {
    fromAddress: payerAddress,
    toAddress: payeeAddress,
    amount: coinQuantity
  }

  console.log({ payload });
  console.log('str: ' + JSON.stringify(payload));

  const res = await fetch(getCoinEndpoint(`operator/wallets/${payerWallet}/transactions`), {
    method: 'POST',
    headers: { 'content-type': 'application/json', password: payerPassword },
    body: JSON.stringify(payload)
  });

  return await res.json();
}

export async function createTransactionBySlackId(
  payerSlackId: string,
  payeeSlackId: string,
  coinQuantity: number
) {
  await ensureConnected();

  const payer = await UserModel.findOne({ slack_user_id: payerSlackId });
  const payee = await UserModel.findOne({ slack_user_id: payeeSlackId });

  if (!payee || !payer) throw "failed to load payer/payee records from bagelbot.users";

  return await createTransaction(
    payer.bryxcoin_wallet!,
    payer.bryxcoin_password!,
    payer.bryxcoin_address!,
    payee.bryxcoin_address!,
    coinQuantity
  );
}
