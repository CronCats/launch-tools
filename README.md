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

## 🤖 Setup a local node

#### Starting the blockchain

This should be run in a diff terminal, or docker runtime is ready before proceeding.
Run the following:

```
./start.sh && ./init.sh
```

## CLI

Docker-friendly access to `wasmd` is provided. Just use the `./cli.sh` script.
For example:

```
./cli.sh status
```

# 🚀 Launch Sequence

NOTE: You will need to check files for the networks specified. When possible, modify the env files to suit needs.

### Lazy mode

```bash
# If you're lazy and just want to run all the things below sequentially
yarn all
```

### Individual Cmds

```bash
#  Optional, for local
# create all demo accounts & setup
yarn bootstrap

# Deploy and Instantiate
yarn in

# Step 1
# Register an Agent
yarn agent

# Step 2
# Create a Task or TWO!
yarn tasks

# Step 3
# Run Some things, with your purrbox
yarn purr

# Step 4
# Read some data, spits out things that worked
yarn query
```

## Troubleshooting

If you see this error

>… realpath: command not found

Mac users may need to run:

    brew install coreutils

Other options may be found here: https://stackoverflow.com/a/3572105

---

The packages `cw-croncat` and `cw-purrbox` are currently being brought in by GitHub, which [has issues](https://github.com/npm/npm/issues/1727#issuecomment-354124625) with caching, it seems.

To ensure you have the latest code, consider running:

    yarn update-git