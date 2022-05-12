# launch-tools

A collection of simple node utilities for launching to different testnets & mainnets.

## 💅 Setup

Install the stuff

```bash
# Step 1
yarn

# Step 2
./build_contracts.sh
```

### Optional: Setup a local node

If you intend to launch on a local node, you need to install the following:

1. Follow the [install guide for cosmjs](https://github.com/cosmos/cosmjs/blob/main/HACKING.md#checking-out-code)
2. `yarn install` at the root
3. `cd scripts/wasmd/` then `nano template/.wasmd/config/genesis.json` and change `"max_wasm_code_size": "614400"` to `"max_wasm_code_size": "654400"`
4. [Setup & run wasmd docker instance](https://github.com/cosmos/cosmjs/tree/main/scripts/wasmd)

This should be run in a diff terminal, or docker runtime. See the `start.sh` & `init.sh` files runs properly and is ready before proceeding.

## 🚀 Lauch Sequence

NOTE: You will need to check files for the networks specified. When possible, modify the env files to suit needs.

### Lazy mode

```bash
# If you're lazy and just want to run all the things below sequentially
yarn all
```

### Individual Cmds

```bash
# Step 0: Optional, for local
# create all demo accounts & setup
yarn bootstrap

# Step 1
# Deploy and Instantiate
yarn in

# Step 2
# Register an Agent
yarn agent

# Step 3
# Create a Task or TWO!
yarn tasks

# Step 4
# Run Some things, with your purrbox
yarn go
```
