#!/usr/bin/env -S yarn node
const { calculateFee, GasPrice } = require("@cosmjs/stargate");
const { toBinary } = require("@cosmjs/cosmwasm-stargate");
const utils = require('./utils');

async function main() {
  const rows = []
  // const config = await utils.getChainConfig()
  // const coinConfig = await utils.getChainCoinConfig(config)
  // const userWallet = await utils.getLabelledWallet(config, utils.agentnyms[0])
  // const user = await utils.getAgentClient(config, utils.agentnyms[0])
  // const managerWallet = await utils.getLabelledWallet(config, utils.catnyms[0])
  // const managerContract = `${managerWallet.contractAddress}`
  // const iftttSimpleWallet = await utils.getLabelledWallet(config, utils.catnyms[1])
  // const iftttSimpleContract = `${iftttSimpleWallet.contractAddress}`
  // const gasPrice = GasPrice.fromString(`0.025${coinConfig.gas}`)
  // const fee = calculateFee(200_000, gasPrice)
  // const endpoint = config.apis.rpc[0].address;
  // const dummy = await utils.generateTempDummy(config, endpoint)
  const memo = `Simulator MEOW!`;
  // const userAddress = `${userWallet.accounts[0].address}`

  // The percent of gas to adjust by, for successful TXNs. Informed by binary search on bank send.
  const gasBaseAdjustment = 0.13;

  const config = {
    apis: { rpc: [{ address: 'https://rpc.uni.juno.deuslabs.fi' }] },
    bech32_prefix: 'juno'
  }
  const userWallet = await utils.getLabelledWallet(config, 'devburner')
  const user = await utils.getAgentClient(config, 'devburner')
  const userAddress = `${userWallet.accounts[0].address}`
  console.log('user', userAddress, user.gasPrice);

  const baseMessages = [
    {
      msg: {
        typeUrl: '/cosmos.bank.v1beta1.MsgSend',
        value: {
          fromAddress: userAddress,
          toAddress: 'juno1z8tvmvjes5wug59wcm87rszxn47mgd7rzw9qsh',
          amount: [{
            amount: '1',
            denom: 'ujunox'
          }],
        }
      },
      funds: [],
      gas_limit: 280000,
    },
    {
      msg: {
        typeUrl: '/cosmos.staking.v1beta1.MsgDelegate',
        value: {
          delegatorAddress: userAddress,
          // See template/.wasmd/config/genesis.json
          // validator: 'wasmvaloper1tjgue6r5kqj5dets24pwaa9u7wuzucpwfsgndk',
          validatorAddress: 'junovaloper1z8tvmvjes5wug59wcm87rszxn47mgd7rann0tw',
          amount: {
            amount: '1',
            denom: 'ujunox'
          },
        }
      },
      funds: [{ amount: '0', denom: 'ujunox' }],
      gas_limit: 280000,
    },
    // {
    //   msg: {
    //     typeUrl: '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
    //     value: {
    //       delegatorAddress: userAddress,
    //       // See template/.wasmd/config/genesis.json
    //       // validator: 'wasmvaloper1tjgue6r5kqj5dets24pwaa9u7wuzucpwfsgndk',
    //       validatorAddress: 'junovaloper1z8tvmvjes5wug59wcm87rszxn47mgd7rann0tw',
    //     }
    //   },
    //   funds: [{ amount: '0', denom: 'ujunox' }],
    //   gas_limit: 280000,
    // },
  ]

  // Loop sample messages and generate Tasks for it
  let i = 0;
  for await (const m of baseMessages) {
    try {
      const gasEstimation = await user.simulate(
        userAddress,
        [m.msg],
        // memo,
      );
      // const r_tx = await user.signAndBroadcast(
      //   userAddress,
      //   [m.msg],
      //   memo,
      // );
      // console.log('sim tx data', JSON.stringify(gasEstimation));
      const gasPriceAvg = GasPrice.fromString(`0.025ujunox`)
      const gasPriceMin = GasPrice.fromString(`0.0125ujunox`)
      const gasThreshold = Math.round(gasEstimation * 1.13)
      const x = calculateFee(gasThreshold, gasPriceAvg).amount[0]
      const xx = `${x.amount * 100 / 1e6} ${x.denom.replace('u', '')}`
      const feeMinRaw = calculateFee(gasThreshold, gasPriceMin).amount[0]
      const feeMin = `${feeMinRaw.amount} ${feeMinRaw.denom}`
      const feeAvgRaw = calculateFee(gasThreshold, gasPriceAvg).amount[0]
      const feeAvg = `${feeAvgRaw.amount} ${feeAvgRaw.denom}`
      rows.push({
        typeUrl: m.msg.typeUrl,
        gasUsed: gasEstimation,
        gasThreshold,
        gasWanted: 100_000_000,
        feeMin,
        feeAvg,
        '100x': xx || 'n/a',
      })
    } catch (e) {
      console.log('TASK CREATE FAILED', e);
      return;
    }
    i++;
  }

  // // TODO: Add more messages to test
  // const sampleActions = [
  //   {
  //     msg: {
  //       wasm: {
  //         execute: {
  //           contract_addr: iftttSimpleContract,
  //           funds: [],
  //           /// msg is the json-encoded ExecuteMsg struct (as raw Binary)
  //           msg: toBinary({ increment: {} }),
  //         }
  //       }
  //     },
  //     gas_limit: 280000,
  //   },
  //   {
  //     msg: {
  //       staking: {
  //         delegate: {
  //           // See template/.wasmd/config/genesis.json
  //           validator: 'wasmvaloper1tjgue6r5kqj5dets24pwaa9u7wuzucpwfsgndk',
  //           amount: {
  //             amount: '100',
  //             denom: coinConfig.gas
  //           },
  //         }
  //       }
  //     },
  //     gas_limit: 280000,
  //   },
  //   {
  //     msg: {
  //       distribution: {
  //         withdraw_delegator_reward: {
  //           validator: 'wasmvaloper1tjgue6r5kqj5dets24pwaa9u7wuzucpwfsgndk',
  //         }
  //       }
  //     },
  //     gas_limit: 280000,
  //   },
  // ]


  // const task = actions => ({
  //   interval: 'Immediate',
  //   boundary: { start: null, end: null, },
  //   stop_on_fail: true,
  //   actions,
  //   rules: [],
  // })

  // // Loop sample messages and generate Tasks for it
  // for await (const actions of sampleActions) {
  //   const funds = [{ amount: '150000', denom: coinConfig.gas }]
  //   try {
  //     const r_tx = await user.execute(
  //       userAddress,
  //       managerContract,
  //       { create_task: { task: task(actions) } },
  //       fee,
  //       memo,
  //       funds,
  //     );
  //     console.log('sim tx hash', r_tx.transactionHash, JSON.stringify(r_tx));
  //   } catch (e) {
  //     console.log('TASK CREATE FAILED', e);
  //     return;
  //   }
  // }

  // // Get list of tasks
  // try {
  //   const q_tx = await user.queryContractSmart(
  //     managerContract,
  //     { get_tasks: {} },
  //   );
  //   console.log('get tasks', JSON.stringify(q_tx));
  // } catch (e) {
  //   console.log('GET FAILED', e);
  //   return;
  // }

  // // TODO: Extrapolate gas base fee & message fees

  // Exported Table:
  const columns = ['typeUrl', 'gasUsed', 'gasThreshold', 'gasWanted', 'feeMin', 'feeAvg', '100x']
  console.table(rows, columns)
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