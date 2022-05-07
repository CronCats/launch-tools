#!/usr/bin/env -S yarn node
const utils = require('./utils');

async function main() {
  const config = await utils.getChainConfig();
  
  // List of easy-to-remember accounts to generate
  const pseudonyms = ['angela', 'bob', 'creed', 'dwight', 'jim', 'kevin', 'michael', 'oscar', 'pam']
  const wallets = await utils.generateWalletsFromLabelList(config, pseudonyms)
  console.log('Wallets Created:', Object.keys(wallets));
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