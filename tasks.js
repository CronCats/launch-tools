#!/usr/bin/env -S yarn node
const { calculateFee, GasPrice } = require("@cosmjs/stargate");
const utils = require('./utils');

async function main() {
  const config = await utils.getChainConfig()
  const coinConfig = await utils.getChainCoinConfig(config)
  const managerWallet = await utils.getLabelledWallet(config, utils.catnyms[0])
  const userWallet = await utils.getLabelledWallet(config, utils.agentnyms[0])
  const user = await utils.getAgentClient(config, utils.agentnyms[0])
  const gasPrice = GasPrice.fromString(`0.025${coinConfig.gas}`)
  const fee = calculateFee(200_000, gasPrice)
  const memo = `tasks MEOW!`;
  const managerAddress = `${managerWallet.accounts[0].address}`
  const userAddress = `${userWallet.accounts[0].address}`
  const managerContract = 'wasm1qwlgtx52gsdu7dtp0cekka5zehdl0uj3fhp9acg325fvgs8jdzksu3v4ff'

  // 
  // TaskRequest {
  //   pub interval: Interval,
  //   pub boundary: Boundary,
  //   pub stop_on_fail: bool,
  //   pub action: CosmosMsg,
  //   pub rules: Option<Vec<Rule>>,
  // }
  const tasks = [
    {
      // interval: 'Once',
      // interval: 'Immediate',
      interval: {
        Block: 15
      },
      // interval: {
      //   Cron: '*/5 * * * * *'
      // },
      boundary: {
        start: null,
        end: null,
      },
      stop_on_fail: false,
      action: {
        staking: {
          delegate: {
            validator: 'junovaloper1ka8v934kgrw6679fs9cuu0kesyl0ljjy2kdtrl',
            amount: {
              amount: '100',
              denom: coinConfig.gas
            },
          }
        }
      },
      // TODO: setup a rules example too
      rules: [],
    },
    {
      interval: {
        Cron: '*/5 * * * * *'
      },
      boundary: { start: null, end: null, },
      stop_on_fail: false,
      action: {
        distribution: {
          withdraw_delegator_reward: {
            validator: 'junovaloper1ka8v934kgrw6679fs9cuu0kesyl0ljjy2kdtrl',
          }
        }
      },
      rules: [],
    },
  ]

  // 1. Create several tasks
  // CreateTask { task: TaskRequest }
  for await (const task of tasks) {
    const funds = [{ amount: '150000', denom: coinConfig.gas }]
    try {
      const r_tx = await user.execute(
        userAddress,
        managerContract,
        { create_task: { task } },
        fee,
        memo,
        funds,
      );
      console.log('task create tx hash', r_tx.transactionHash, r_tx);
    } catch (e) {
      console.log('TASK CREATE FAILED', e);
      return;
    }
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