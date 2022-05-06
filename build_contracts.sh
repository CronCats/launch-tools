#!/bin/bash
set -e

rm -rf res
cd node_modules/cw-croncat && ./build.sh
cd ../../
mkdir res
cp node_modules/cw-croncat/target/wasm32-unknown-unknown/release/cw_croncat.wasm res/