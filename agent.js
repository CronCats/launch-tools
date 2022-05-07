#!/usr/bin/env -S yarn node
const utils = require('./utils');

async function main() {
  const config = await utils.getChainConfig();

  // TODO:
  // 1. Register 1 or more agents
  // 2. Check status via agent info
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