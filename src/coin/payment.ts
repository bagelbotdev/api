import { getCoinEndpoint } from "./utils";
import { ensureConnected } from "../db/util";
import UserModel from "../db/models/User";
import { cacheSync } from "../db/caching";

export async function canAfford(address: string, coinQuantity: number) {
  return (await getBalance(address)) >= coinQuantity;
}

export async function getBalance(address: string) {
  try {
    const res = await fetch(getCoinEndpoint(`operator/${address}/balance`));
    return (await res.json()).balance;
  } catch {
    return -1; // address with no transactions will error. Use -1 to represent a fresh address
  }
}

export const getUtxoByAddressForBlockset = cacheSync((address: string, blocks: any[]) => {
  const inputs = [] as { transaction: string; index: number; amount: number; address: string }[];
  const outputs = [] as { transaction: string; index: number; amount: number; address: string }[];

  blocks.forEach((block: any) => {
    block.transactions.forEach((tx: any) => {
      tx.data.outputs.forEach(
        (output: any, i: number) =>
          output.address == address &&
          outputs.push({
            transaction: tx.id,
            index: i,
            ...output,
          })
      );

      tx.data.inputs.forEach(
        (input: any) =>
          input.address == address &&
          inputs.push({
            ...input,
          })
      );
    });
  });

  // only consider transactions in blocks to allow for reliable caching

  const utxo = [] as typeof outputs;

  outputs.forEach((output) => {
    if (
      !inputs.some(
        (input) => input.transaction == output.transaction && input.index == output.index
      )
    )
      utxo.push(output);
  });

  return utxo;
});

export async function getBalanceOverTime(address: string) {
  const blocks = await (await fetch(getCoinEndpoint("blockchain/blocks"))).json();

  return Array.from(Array(blocks.length).keys()).map((i) => {
    const blockSubset = [...blocks].splice(0, i + 1);
    return getUtxoByAddressForBlockset(address, blockSubset).reduce(
      (balance, txo) => balance + txo.amount,
      0
    );
  });
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
    amount: coinQuantity,
  };

  const res = await fetch(getCoinEndpoint(`operator/wallets/${payerWallet}/transactions`), {
    method: "POST",
    headers: { "content-type": "application/json", password: payerPassword },
    body: JSON.stringify(payload),
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
