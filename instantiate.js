#!/usr/bin/env -S yarn node
const { calculateFee, GasPrice } = require("@cosmjs/stargate");
const fs = require("fs");
const utils = require('./utils');

async function main() {
  const config = await utils.getChainConfig()
  const coinConfig = await utils.getChainCoinConfig(config)
  const managerWallet = await utils.getLabelledWallet(config, utils.catnyms[0])
  const managerAddress = `${managerWallet.accounts[0].address}`
  const manager = await utils.getClient(managerWallet.mnemonic, config)

  const wasm = fs.readFileSync(__dirname + "/res/cw_croncat.wasm")
  const gasPrice = GasPrice.fromString(`0.00000${coinConfig.gas}`)
  const uploadFee = calculateFee(4_000_000, gasPrice)
  const uploadReceipt = await manager.upload(
    managerAddress,
    wasm,
    uploadFee,
    "Upload cw_croncat contract",
  );
  console.info(`Upload succeeded. Receipt: ${JSON.stringify(uploadReceipt)}`);

  const inits = [
    {
      label: "Croncat Manager",
      msg: {
        denom: coinConfig.gas,
        owner_id: managerAddress,
      },
      admin: managerAddress,
    },
  ];

  const instantiateFee = calculateFee(1_500_000, gasPrice);
  for (const { label, msg, admin } of inits) {
    const { contractAddress } = await manager.instantiate(
      managerAddress,
      uploadReceipt.codeId,
      msg,
      label,
      instantiateFee,
      "auto",
      {
        memo: `MEOW! Cron.cat`,
        admin: admin,
      },
    );
    console.info(`Contract instantiated at ${contractAddress}`);

    // update the wallet to use the contract address later
    await utils.updateContractWallet(config, utils.catnyms[0], {
      contractAddress,
    })
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