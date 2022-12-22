#!/bin/bash

#source .env
#CONTRACT=$(echo $SETTINGS | jq -r '.["contracts"]["manager"]["address"]')

SIMPLE_PAYROLL='{
  "create_task": {
    "task": {
      "interval": "Immediate",
      "boundary": null,
      "cw20_coins": [],
      "stop_on_fail": false,
      "actions": [
        {
          "msg": {
            "bank": {
              "send": {
                "amount": [
                  {
                    "amount": "1001",
                    "denom": "ujunox"
                  }
                ],
                "to_address": "juno1njf5qv8ryfl07qgu5hqy8ywcvzwyrt4kzqp07d"
              }
            }
          }
        },
        {
          "msg": {
            "bank": {
              "send": {
                "amount": [
                  {
                    "amount": "1002",
                    "denom": "ujunox"
                  }
                ],
                "to_address": "juno1pd43m659naajmn2chkt6tna0uud2ywyp5dm4h3"
              }
            }
          }
        },
        {
          "msg": {
            "bank": {
              "send": {
                "amount": [
                  {
                    "amount": "1003",
                    "denom": "ujunox"
                  }
                ],
                "to_address": "juno15w7hw4klzl9j2hk4vq7r3vuhz53h3mlzug9q6s"
              }
            }
          }
        }
      ],
      "rules": []
    }
  }
}'

junod tx wasm execute juno1v3p9fshhnngmfndgj58e0f35lz0ndl38rc72knuv2f3y2jpanhlq564clt "$SIMPLE_PAYROLL" --amount 1000000ujunox --from mikereg --node https://rpc.uni.juno.deuslabs.fi:443 --chain-id uni-5 --gas-prices 0.025ujunox --gas auto --gas-adjustment 1.3 -b block -y -o json | jq | head -n 42
#TXFLAG="--node https://rpc.uni.juno.deuslabs.fi:443 --chain-id uni-5 --gas-prices 0.025ujunox --gas auto --gas-adjustment 1.3 -b block"
#junod tx wasm execute $CONTRACT "$SIMPLE_PAYROLL" --amount 96994ujunox --from mikereg $TXFLAG -y
#echo "Done creating simple payroll"

# remove task
#junod tx wasm execute juno1v3p9fshhnngmfndgj58e0f35lz0ndl38rc72knuv2f3y2jpanhlq564clt "$SIMPLE_PAYROLL" --amount 1000000ujunox --from mikereg --node https://rpc.uni.juno.deuslabs.fi:443 --chain-id uni-5 --gas-prices 0.025ujunox --gas auto --gas-adjustment 1.3 -b block -y -o json | jq | head -n 42

#3006 + 96994

#3006 + 100000
