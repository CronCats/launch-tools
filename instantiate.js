#!/usr/bin/env -S yarn node

/* eslint-disable @typescript-eslint/naming-convention */
const { SigningCosmWasmClient } = require("@cosmjs/cosmwasm-stargate");
const { DirectSecp256k1HdWallet } = require("@cosmjs/proto-signing");
const { calculateFee, GasPrice } = require("@cosmjs/stargate");
const juno = require("chain-registry/juno/chain.json");
const fs = require("fs");

const prefix = 'wasm';
const denom = 'cosm';

const alice = {
  mnemonic: "enlist hip relief stomach skate base shallow young switch frequent cry park",
  address0: "wasm14qemq0vw6y3gc3u3e0aty2e764u4gs5lndxgyk",
  address1: "wasm1hhg2rlu9jscacku2wwckws7932qqqu8xm5ca8y",
  address2: "wasm1xv9tklw7d82sezh9haa573wufgy59vmwnxhnsl",
  address3: "wasm17yg9mssjenmc3jkqth6ulcwj9cxujrxxg9nmzk",
  address4: "wasm1f7j7ryulwjfe9ljplvhtcaxa6wqgula3nh873j",
};

const getClient = async () => {
  const endpoint = "http://localhost:26659";
  // juno.bech32_prefix
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(alice.mnemonic, { prefix });
  let accounts = await wallet.getAccounts();
  let mnemonic = wallet.mnemonic;
  console.log(`New account:`, accounts[0].address);
  return SigningCosmWasmClient.connectWithSigner(endpoint, wallet);
}

const inits = [
  {
    label: "Croncat Manager",
    msg: {
      denom,
      owner_id: alice.address2,
    },
    admin: alice.address1,
  },
];

async function main() {
  const wasm = fs.readFileSync(__dirname + "/res/cw_croncat.wasm");
  const client = await getClient();
  const gasPrice = GasPrice.fromString(`0.025u${denom}`);
  const uploadFee = calculateFee(4_000_000, gasPrice);
  const uploadReceipt = await client.upload(
    alice.address0,
    wasm,
    uploadFee,
    "Upload cw_croncat contract",
  );
  console.info(`Upload succeeded. Receipt: ${JSON.stringify(uploadReceipt)}`);

  const instantiateFee = calculateFee(1_500_000, gasPrice);
  for (const { label, msg, admin } of inits) {
    const { contractAddress } = await client.instantiate(
      alice.address0,
      uploadReceipt.codeId,
      msg,
      label,
      instantiateFee,
      {
        memo: `MEOW! Cron.cat`,
        admin: admin,
      },
    );
    console.info(`Contract instantiated at ${contractAddress}`);
  }
}

main().then(
  () => {
    console.info("All done, purr time.");
    process.exit(0);
  },
  (error) => {
    console.error(error);
    process.exit(1);
  },
);