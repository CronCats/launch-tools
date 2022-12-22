#!/bin/bash
osmosisd tx wasm store artifacts/cw_rules-aarch64.wasm --from mikereg --node https://rpc-test.osmosis.zone:443 --chain-id osmo-test-4 --gas auto --gas-prices 0.1uosmo --gas-adjustment 1.3 -b block -o json -y | jq | head -n 42