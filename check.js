#!/usr/bin/env -S yarn node
const { calculateFee, GasPrice } = require("@cosmjs/stargate");
const { fromBase64, toHex, toUtf8 } = require("@cosmjs/encoding");
const { toBinary } = require("@cosmjs/cosmwasm-stargate");
const utils = require('./utils');

async function main() {
  const config = await utils.getChainConfig()
  const coinConfig = await utils.getChainCoinConfig(config)
  const userWallet = await utils.getLabelledWallet(config, utils.agentnyms[0])
  const user = await utils.getAgentClient(config, utils.agentnyms[0])
  const iftttSimpleWallet = await utils.getLabelledWallet(config, utils.catnyms[1])
  const iftttSimpleContract = `${iftttSimpleWallet.contractAddress}`
  console.log('iftttSimpleContract', iftttSimpleContract);

  try {
    const q_tx = await user.queryContractSmart(
      iftttSimpleContract,
      { get_count: {} },
      // { check_modulo: {} },
    );
    console.log('get', q_tx);
  } catch (e) {
    console.log('GET FAILED', e);
    return;
  }
}

main().then(
  () => {
    console.info("All meows complete.");
    process.exit(0);
  },
  (error) => {
    console.error(error);
    process.exit(1);
  },
);