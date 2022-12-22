#!/bin/bash
starsd tx wasm instantiate "$1" '{"denom":"ujunox","cw_rules_addr":"'"$2"'"}' --node https://rpc.elgafar-1.stargaze-apis.com:443 --chain-id elgafar-1 --gas-prices 0.025ustars --gas-adjustment 1.7 --gas auto -b block --from mikereg -o json --label "CronCat-manager-alpha" --admin "$(starsd keys show mikereg -a)" -y | jq | head -n 42
