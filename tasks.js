#!/usr/bin/env -S yarn node
const utils = require('./utils');

async function main() {
  const config = await utils.getChainConfig();
  const managerWallet = utils.getLabelledWallet(config, utils.catnyms[0])
  const userWallet = utils.getLabelledWallet(config, utils.agentnyms[1])
  const user = getAgentClient(config, utils.agentnyms[1])
  const fee = calculateFee(500_000, "0.000037ujuno");
  const memo = `Meow meow meow`;
  const managerAddress = `${managerWallet.accounts[0].address}`
  const userAddress = `${userWallet.accounts[0].address}`

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
      task: {
        // TODO: Is this right?!
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
                amount: 100,
                denom: 'ucosm'
              },
            }
          }
        },
        rules: [],
      }
    },
    {
      task: {
        interval: {
          Cron: '*/5 * * * * *'
        },
        boundary: { start: null, end: null, },
        stop_on_fail: false,
        action: {
          withdraw_delegator_reward: {
            validator: 'junovaloper1ka8v934kgrw6679fs9cuu0kesyl0ljjy2kdtrl',
          }
        },
        rules: [],
      }
    },
  ]

  // 1. Create several tasks
  // CreateTask { task: TaskRequest }
  for await (const task of tasks) {
    try {
      const r_tx = await user.execute(
        userAddress,
        managerAddress,
        { create_task: { task } },
        fee,
        memo
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