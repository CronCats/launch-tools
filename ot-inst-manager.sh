#!/bin/bash
osmosisd tx wasm instantiate "$1" '{"denom":"uosmo","cw_rules_addr":"'"$2"'"}' --node https://rpc-test.osmosis.zone:443 --chain-id osmo-test-4 --gas auto --gas-prices 0.1uosmo --gas-adjustment 1.3 -b block --from mikereg -o json --label "CronCat-manager-alpha" --admin "$(osmosisd keys show mikereg -a)" -y | jq | head -n 42
