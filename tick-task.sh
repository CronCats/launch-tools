#!/bin/bash

#source .env
#CONTRACT=$(echo $SETTINGS | jq -r '.["contracts"]["manager"]["address"]')

# MSG='{ "tick": {} }'
# is actually just: eyAidGljayI6IHt9IH0K

TICK_TASK='{
             "create_task": {
               "task": {
                 "interval": {
                   "Block": 1000
                 },
                 "boundary": null,
                 "cw20_coins": [],
                 "stop_on_fail": false,
                 "actions": [
                   {
                     "msg": {
                       "wasm": {
                         "execute": {
                           "contract_addr": "juno174ncqgapq7fudqj64ut4ue47gevlqp93guecjelnkquruvnpjdgsuk046w",
                           "msg": "eyAidGljayI6IHt9IH0K",
                           "funds": []
                         }
                       }
                     },
                     "gas_limit": 300000
                   }
                 ]
               }
             }
           }'

echo $TICK_TASK

junod tx wasm execute juno174ncqgapq7fudqj64ut4ue47gevlqp93guecjelnkquruvnpjdgsuk046w "$TICK_TASK" --amount 1000000ujunox --from mikereg --node https://juno-testnet-rpc.polkachu.com:443 --chain-id uni-5 --gas-prices 0.025ujunox --gas auto --gas-adjustment 1.3 -b block -y -o json | jq | head -n 42
