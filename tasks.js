#!/usr/bin/env -S yarn node
const utils = require('./utils');

async function main() {
  const config = await utils.getChainConfig();

  // TODO:
  // 1. Create several tasks
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