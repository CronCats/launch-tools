#!/usr/bin/env -S yarn node
const utils = require('./utils');

const BASE_DENOM = 1e3
const BASE_COIN = 1 * BASE_DENOM

async function main() {
  const config = await utils.getChainConfig();
  
  // List of easy-to-remember accounts to generate
  const catBanks = await utils.generateWalletsFromLabelList(config, utils.catnyms)
  const wallets = await utils.generateWalletsFromLabelList(config, utils.agentnyms)
  console.log('Croncat Created:', Object.keys(catBanks));
  console.log('Agent Wallets Created:', Object.keys(wallets));

  // Fund the wallets from the default account
  for await (const c of Object.values(catBanks)) {
    await utils.faucetSendCoins(config, c.accounts[0].address, 10_000 * BASE_COIN)
  }
  for await (const w of Object.values(wallets)) {
    await utils.faucetSendCoins(config, w.accounts[0].address, 500_000 * BASE_COIN)
  }
}

main().then(
  () => {
    console.info("All done, ready to purr.");
    process.exit(0);
  },
  (error) => {
    console.error(error);
    process.exit(1);
  },
);