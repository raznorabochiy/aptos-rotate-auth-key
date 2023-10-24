import { AptosAccount, AptosClient, HexString } from "aptos";
import { loadFromFile } from "./utils";

const RPC_URL = "https://rpc.ankr.com/http/aptos/v1";

const [originalPrivateKey] = await loadFromFile("original-private-key.txt");
const [newPrivateKey] = await loadFromFile("new-private-key.txt");

if (!originalPrivateKey || !newPrivateKey) {
  throw new Error("Заполните файлы с ключами");
}

const client = new AptosClient(RPC_URL);

// нужно раскомментировать и указать правильный адрес у originalAccount,
// если ранне уже меняли приватник у аккаунта и теперь его
// нельзя вывести из заменённого приватника

const originalAccount = new AptosAccount(
  new HexString(originalPrivateKey).toUint8Array(),
  // "0xaf4e5302430fa81571624017f76947f1468361d77de2a3c043870d93b7c7cd51",
);

const { address } = originalAccount.toPrivateKeyObject();
console.log(`Address: ${address}`);

const newAccount = new AptosAccount(
  new HexString(newPrivateKey).toUint8Array(),
);

try {
  const maxGasAmount = await client.estimateMaxGasAmount(address);
  const result = await client.rotateAuthKeyEd25519(
    originalAccount,
    newAccount.signingKey.secretKey,
    {
      maxGasAmount,
    },
  );

  console.log(
    `https://explorer.aptoslabs.com/txn/${result.hash}?network=mainnet`,
  );
} catch (error) {
  console.error(error.message);
}
