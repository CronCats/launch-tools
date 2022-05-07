#!/usr/bin/env -S yarn node
const utils = require('./utils');

async function main() {
  const config = await utils.getChainConfig()
  const managerWallet = utils.getLabelledWallet(config, utils.catnyms[0])
  const agentWallet = utils.getLabelledWallet(config, utils.agentnyms[0])
  const agent = getAgentClient(config, utils.agentnyms[0])
  const fee = calculateFee(500_000, "0.000037ujuno");
  const memo = `Agent MEOW!`;
  const managerAddress = `${managerWallet.accounts[0].address}`
  const agentAddress = `${agentWallet.accounts[0].address}`

  // 1. Register 1 or more agents
  // RegisterAgent {}
  try {
    const r_tx = await agent.execute(
      agentAddress,
      managerAddress,
      { register_agent: {} },
      fee,
      memo
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
      managerAddress,
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