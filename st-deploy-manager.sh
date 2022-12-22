#!/bin/bash
starsd tx wasm store artifacts/cw_croncat-aarch64.wasm --node https://rpc.elgafar-1.stargaze-apis.com:443 --chain-id elgafar-1 --gas-prices 0.025ustars --gas-adjustment 1.7 --gas auto -b block --from mikereg -o json -y | jq | head -n 42

# https://testnet.publicawesome.dev

# check testnet balance
# starsd q bank balances stars1yhqft6d2msmzpugdjtawsgdlwvgq3samp4qg0r --node https://rpc.elgafar-1.stargaze-apis.com:443