#!/bin/bash
set -e

rm -rf res
cd node_modules/cw-croncat && ./build.sh
cd ../../
mkdir res
cp node_modules/cw-croncat/target/wasm32-unknown-unknown/release/cw_croncat.wasm res/
cd node_modules/cw-purrbox/contracts/ifttt-simple && cargo build --target wasm32-unknown-unknown --release
cd ../../../../
cp node_modules/cw-purrbox/contracts/ifttt-simple/target/wasm32-unknown-unknown/release/ifttt_simple.wasm res/