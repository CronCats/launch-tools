#!/usr/bin/env -S yarn node
const { calculateFee, GasPrice } = require("@cosmjs/stargate");
const utils = require('./utils');

async function main() {
  const config = await utils.getChainConfig()
  const coinConfig = await utils.getChainCoinConfig(config)
  const agentWallet = await utils.getLabelledWallet(config, utils.agentnyms[0])
  const agent = await utils.getAgentClient(config, utils.agentnyms[0])
  const gasPrice = GasPrice.fromString(`0.025${coinConfig.gas}`)
  const fee = calculateFee(500_000, gasPrice)
  const memo = `Agent MEOW!`;
  const agentAddress = `${agentWallet.accounts[0].address}`
  const managerContract = 'wasm1qwlgtx52gsdu7dtp0cekka5zehdl0uj3fhp9acg325fvgs8jdzksu3v4ff'
  console.log('agentAddress', agentAddress);

  // 1. Register 1 or more agents
  // RegisterAgent {}
  try {
    const r_tx = await agent.execute(
      agentAddress,
      managerContract,
      { register_agent: { payable_account_id: null } },
      fee,
      memo,
    );
    console.log('register tx hash', r_tx.transactionHash, r_tx);
  } catch (e) {
    console.log('REGISTER AGENT FAILED', e);
    return;
  }

  // 2. Check status via agent info
  // GetAgent { account_id: Addr }
  try {
    const q_tx = await agent.queryContractSmart(
      managerContract,
      { get_agent: { account_id: agentAddress } },
    );
    console.log('get agent', q_tx);
  } catch (e) {
    console.log('GET AGENT FAILED', e);
    return;
  }
}

main().then(
  () => {
    console.info("Officially purr time.");
    process.exit(0);
  },
  (error) => {
    console.error(error);
    process.exit(1);
  },
);