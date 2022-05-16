#!/usr/bin/env -S yarn node
const { calculateFee, GasPrice } = require("@cosmjs/stargate");
const fs = require("fs");
const utils = require('./utils');

const inits = [
  {
    catnym: utils.catnyms[0],
    label: "Croncat Manager",
    msg: {
      denom: coinConfig.gas,
      owner_id: managerAddress,
    },
    contractFile: 'cw_croncat',
    uploadFee: 4_000_000,
    initFee: 1_500_000,
  },
  {
    catnym: utils.catnyms[1],
    label: "IFTTT Simple",
    msg: {
      count: 1,
    },
    contractFile: 'ifttt_simple',
    uploadFee: 4_000_000,
    initFee: 1_500_000,
  },
];

async function initContract(initMsg, config) {
  const coinConfig = await utils.getChainCoinConfig(config)
  const managerWallet = await utils.getLabelledWallet(config, initMsg.catnym)
  const managerAddress = `${managerWallet.accounts[0].address}`
  const manager = await utils.getClient(managerWallet.mnemonic, config)

  const wasm = fs.readFileSync(__dirname + `/res/${initMsg.contractFile}.wasm`)
  const gasPrice = GasPrice.fromString(`0.00000${coinConfig.gas}`)
  const uploadFee = calculateFee(initMsg.uploadFee, gasPrice)
  const uploadReceipt = await manager.upload(
    managerAddress,
    wasm,
    uploadFee,
    "Upload cw_croncat contract",
  );
  console.info(`Upload succeeded. Receipt: ${JSON.stringify(uploadReceipt)}`);

  const instantiateFee = calculateFee(initMsg.initFee, gasPrice);
  const { label, msg } = initMsg
  const { contractAddress } = await manager.instantiate(
    managerAddress,
    uploadReceipt.codeId,
    msg,
    label,
    instantiateFee,
    "auto",
    {
      memo: `MEOW! Cron.cat`,
      admin: managerAddress,
    },
  );
  console.info(`Contract instantiated at ${contractAddress}`);

  // update the wallet to use the contract address later
  await utils.updateContractWallet(config, initMsg.catnym, { contractAddress })
}

async function main() {
  const config = await utils.getChainConfig()
  
  for (const init of inits) {
    await initContract(init, config)
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