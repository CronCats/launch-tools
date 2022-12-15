#!/bin/bash

junod tx wasm execute "$1" '{"remove_task":{"task_hash":"'"$2"'"}}' --node https://juno-testnet-rpc.polkachu.com:443 --chain-id uni-5 -o json --from mikereg --gas-prices 0.025ujunox --gas auto --gas-adjustment 1.3 --broadcast-mode block | jq
