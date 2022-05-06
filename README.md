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

If you intend to launch on a local node, [follow this guide for a docker instance supporting cosmwasm](https://github.com/cosmos/cosmjs/tree/main/scripts/wasmd).

This should be run in a diff terminal, or docker runtime. See the `start.sh` file runs properly and is ready before proceeding.

## 🚀 Lauch Sequence

NOTE: You will need to check files for the networks specified. When possible, modify the env files to suit needs.

```bash
# Deploy and Instantiate
node instantiate.js
```
