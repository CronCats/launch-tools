#!/bin/bash

junod q wasm contract-state smart "$1" '{"get_tasks":{}}' --node https://juno-testnet-rpc.polkachu.com:443 --chain-id uni-5 -o json | jq
