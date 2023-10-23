import dotenv from "dotenv";
import { CosmWasmClient, SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { stringToPath } from "@cosmjs/crypto";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { GasPrice } from "@cosmjs/stargate";

import { Cw721BaseClient, Cw721BaseQueryClient } from "@hieu_le/cw721-contracts-sdk";

dotenv.config();
export type UserWallet = {
  address: string;
  client: SigningCosmWasmClient;
};

export async function setupWallet(
  mnemonic: string,
  config: {
    hdPath?: string;
    rpcUrl?: string;
    gasPrices?: string;
    prefix?: string;
  },
  cosmwasmClient?: SigningCosmWasmClient
): Promise<UserWallet> {
  if (!mnemonic || mnemonic.length < 48) {
    throw new Error("Must set MNEMONIC to a 12 word phrase");
  }
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
    hdPaths: [stringToPath(config.hdPath ?? "m/44'/118'/0'/0/0")],
    prefix: config.prefix ?? "comdex",
  });
  const [firstAccount] = await wallet.getAccounts();
  const address = firstAccount.address;
  const client =
    cosmwasmClient ??
    (await SigningCosmWasmClient.connectWithSigner(config.rpcUrl || "https://rpc-nova.comdex.one:443", wallet, {
      gasPrice: GasPrice.fromString(`${config.gasPrices ?? "0.0625"}ucmdx`),
    }));

  return { address, client };
}

(async () => {
  const rpcUrl = process.env.RPC_URL ?? "https://rpc-nova.comdex.one:443";

  const sender = await setupWallet(process.env.MNEMONIC ?? "", {
    hdPath: process.env.HD_PATH ?? "m/44'/118'/0'/0/0",
    rpcUrl,
    prefix: "comdex",
  });

  if (typeof sender === "string") {
    throw new Error("Cannot get sender - err: " + sender);
  }

  const { amount } = await sender.client.getBalance(sender.address, "ucmdx");
  console.log(`balance of ${sender.address} is ${amount}`);
  const cw721Contract = "comdex10a3xtmqcz2mqam9fzsjzmtyqzfr3f0gdcw9wqy4druhg0xh025pqntq9zw";
  const cw721Client = new Cw721BaseClient(
    sender.client,
    sender.address,
    cw721Contract
  );
  const cw721QueryClient = new Cw721BaseQueryClient(
    sender.client,
    cw721Contract
  );

  // Mint token
  // await cw721Client.mint({
  //   extension: {},
  //   owner: sender.address,
  //   tokenId: '123',
  //   tokenUri: "https://www.simplilearn.com/ice9/free_resources_article_thumb/what_is_image_Processing.jpg"
  // });
  
  const allToken = await cw721QueryClient.allTokens({ limit: 100 });
  console.log({ allToken });

  const tokenInfo = await cw721QueryClient.nftInfo({ tokenId: 'test' });
  console.log({ tokenInfo });
  
  const walletTokens = await cw721QueryClient.tokens({ owner: "comdex12zyu8w93h0q2lcnt50g3fn0w3yqnhy4fcp6ucx"})
  console.log({ walletTokens });
  
})();
