import { getCoinEndpoint } from "./utils";
import { ensureConnected } from "../db/util";
import UserModel from "../db/models/User";
import { cacheSync } from "../db/caching";

export async function canAfford(address: string, coinQuantity: number) {
  return (await getBalance(address)) > coinQuantity + 20; // 20 bxcn fee per tx, and 1 bxcn must be in the wallet at all times
}

export async function getBalance(address: string): Promise<number> {
    const res = await fetch(getCoinEndpoint('ledger'));
    const balance = (await res.json()).ledger[address]; 

    return typeof balance == 'number' ? balance : -1;
}

export async function createTransaction(tx: {
  from_addr: string,
  to_addr: string,
  amt: number,
  secret: string
}) {
  const res = await fetch(getCoinEndpoint('tx'), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(tx),
  });

  const response = await res.text();
  console.log("Finished BXCN transaction", response, res.status, tx);
  return JSON.parse(response);
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

  return await createTransaction({
    from_addr: payer!.bryxcoin_address!,
    to_addr: payee!.bryxcoin_address!,
    secret: payer!.bryxcoin_password!,
    amt: coinQuantity
  });
}
