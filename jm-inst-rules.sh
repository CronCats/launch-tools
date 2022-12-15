#!/bin/bash
junod tx wasm instantiate "$1" '{}' --node https://rpc-juno.itastakers.com:443/ --chain-id juno-1 --gas-prices 0.025ujuno --gas auto --gas-adjustment 1.3 -b block --from mikereg -o json --label "CronCat-rules-alpha" --admin "$(junod keys show mikereg -a)" -y | jq | head -n 42

# juno1526j2ltxmzd5wvxq6lg5h043lrmvputlhtg9fl8uc95gwfpgm5qq9053kw