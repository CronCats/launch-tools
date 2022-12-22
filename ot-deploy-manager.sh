#!/bin/bash
osmosisd tx wasm store artifacts/cw_croncat-aarch64.wasm --from mikereg --node https://rpc-test.osmosis.zone:443 --chain-id osmo-test-4 --gas auto --gas-prices 0.1uosmo --gas-adjustment 1.3 -b block -o json -y --note "CronCat-manager-alpha" | jq | head -n 42