#!/bin/bash
junod tx wasm store artifacts/cw_croncat-aarch64.wasm --node https://rpc.uni.junonetwork.io:443 --chain-id uni-5 --gas-prices 0.025ujunox --gas auto --gas-adjustment 1.3 -b block --from mikereg -o json -y | jq | head -n 42
#junod tx wasm store artifacts/cw_croncat-aarch64.wasm --node https://juno-testnet-rpc.polkachu.com:443 --chain-id uni-5 --gas-prices 0.025ujunox --gas auto --gas-adjustment 1.3 -b block --from mikereg -o json -y | jq | head -n 42