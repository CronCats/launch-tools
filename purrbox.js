#!/usr/bin/env -S yarn node
const utils = require('./utils');

async function main() {
  // 0. Load agent
  const config = await utils.getChainConfig();
  const managerWallet = utils.getLabelledWallet(config, utils.catnyms[0])
  const agentWallet = utils.getLabelledWallet(config, utils.agentnyms[0])
  const agent = getAgentClient(config, utils.agentnyms[0])
  const fee = calculateFee(500_000, "0.000037ujuno");
  const memo = `Purrrrrrrr...`;
  const managerAddress = `${managerWallet.accounts[0].address}`
  const agentAddress = `${agentWallet.accounts[0].address}`

  // 1. Check active tasks in loop until find some
  // GetAgentTasks { account_id: Addr }
  try {
    const q_tx = await agent.queryContractSmart(
      managerAddress,
      { get_agent_tasks: { account_id: agentAddress } },
    );
    console.log('get agent tasks', q_tx);
  } catch (e) {
    console.log('GET AGENT FAILED');
    return;
  }

  // TODO: Finish
  // 2. Execute proxy_call
  // ProxyCall {}
  try {
    const r_tx = await agent.execute(
      agentAddress,
      managerAddress,
      { proxy_call: {} },
      fee,
      memo
    );
    console.log('proxy_call tx hash', r_tx.transactionHash, r_tx);
  } catch (e) {
    console.log('PROXY_CALL FAILED', e);
    return;
  }
  
  // TODO:
  // 3. Let it repeat and run 3+ task executions then exit
  // 
}

main().then(
  () => {
    console.info("All purring complete.");
    process.exit(0);
  },
  (error) => {
    console.error(error);
    process.exit(1);
  },
);