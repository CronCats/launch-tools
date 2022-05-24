#!/usr/bin/env -S yarn node
const { calculateFee, GasPrice } = require("@cosmjs/stargate");
const utils = require('./utils');

async function main() {
  // 0. Load agent
  const config = await utils.getChainConfig()
  const coinConfig = await utils.getChainCoinConfig(config)
  const agentWallet = await utils.getLabelledWallet(config, utils.agentnyms[0])
  const agent = await utils.getAgentClient(config, utils.agentnyms[0])
  const managerWallet = await utils.getLabelledWallet(config, utils.catnyms[0])
  const managerContract = `${managerWallet.contractAddress}`
  const gasPrice = GasPrice.fromString(`0.025${coinConfig.gas}`)
  const fee = calculateFee(150_000, gasPrice)
  const memo = `Purrrrrrrr...`;
  const agentAddress = `${agentWallet.accounts[0].address}`

  // 1. Check active tasks in loop until find some
  // GetAgentTasks { account_id: Addr }
  const getTasks = async () => {
    try {
      const q_tx = await agent.queryContractSmart(
        managerContract,
        { get_agent_tasks: { account_id: agentAddress } },
      );
      console.log('get agent tasks', q_tx);
      return true
    } catch (e) {
      console.log('GET AGENT FAILED', e);
      return false;
    }
  }

  // 2. Execute proxy_call
  // ProxyCall {}
  const proxyCall = async () => {
    try {
      const r_tx = await agent.execute(
        agentAddress,
        managerContract,
        { proxy_call: {} },
        fee,
        memo
      );
      console.log('proxy_call tx hash', r_tx.transactionHash, JSON.stringify(r_tx));
    } catch (e) {
      console.log('PROXY_CALL FAILED', e);
      return;
    }
  }

  // 3. Let it repeat and run 3+ task executions then exit
  let prevTs = +new Date()
  let taskIdx = 0
  const baseTime = 10 * 1000
  const runLoop = async () => {
    const hasTasks = await getTasks()
    // do the things
    if (hasTasks) {
      await proxyCall()

      taskIdx++
      if (taskIdx > 3) return;

      let nextTs = Math.min(baseTime - (+new Date() - prevTs), 0)
      setTimeout(runLoop, nextTs)
    } else {
      setTimeout(runLoop, baseTime)
    }
  }

  await runLoop()
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