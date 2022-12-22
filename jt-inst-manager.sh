#!/bin/bash
junod tx wasm instantiate "$1" '{"denom":"ujunox","cw_rules_addr":"'"$2"'"}' --node https://rpc.uni.junonetwork.io:443 --chain-id uni-5 --gas-prices 0.025ujunox --gas auto --gas-adjustment 1.3 -b block --from mikereg -o json --label "CronCat-manager-alpha" --admin "$(junod keys show mikereg -a)" -y | jq | head -n 42
#junod tx wasm instantiate "$1" '{"denom":"ujunox","cw_rules_addr":"'"$2"'"}' --node https://juno-testnet-rpc.polkachu.com:443 --chain-id uni-5 --gas-prices 0.025ujunox --gas auto --gas-adjustment 1.3 -b block --from mikereg -o json --label "CronCat-manager-alpha" --admin "$(junod keys show mikereg -a)" -y | jq | head -n 42

# juno176dmc2566wd42sqt2yhzgew7n6669u6vmdp527szlyn8ehnht49qkphgr0