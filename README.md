# launch-tools

A collection of simple node utilities for launching to different testnets & mainnets.

## 💅 Setup

Install the stuff

```bash
# Step 1
yarn

# Step 2
./build_contracts.sh

# Step 3: Optional, for local
# create all demo accounts & setup
yarn bootstrap
```

### Optional: Setup a local node

If you intend to launch on a local node, [follow this guide for a docker instance supporting cosmwasm](https://github.com/cosmos/cosmjs/tree/main/scripts/wasmd).

This should be run in a diff terminal, or docker runtime. See the `start.sh` file runs properly and is ready before proceeding.

## 🚀 Lauch Sequence

NOTE: You will need to check files for the networks specified. When possible, modify the env files to suit needs.

```bash
# Step 1
# Deploy and Instantiate
yarn init

# Step 2
# Register an Agent
yarn agent

# Step 3
# Create a Task or TWO!
yarn tasks

# Step 4
# Run Some things, with your purrbox
yarn purr
```
