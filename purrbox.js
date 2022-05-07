#!/usr/bin/env -S yarn node
const utils = require('./utils');

async function main() {
  const config = await utils.getChainConfig();

  // TODO:
  // 0. Load agent
  // 1. Check active tasks in loop until find some
  // 2. Execute proxy_call
  // 3. Let it repeat and run 3+ task executions then exit
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