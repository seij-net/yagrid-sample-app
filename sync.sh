#!/usr/bin/env sh

DEST=./imports/yagrid
cd ../yagrid
./build-fast.sh 
cd ../yagrid-sample-app
yarn remove @seij/yagrid
rm -rf $DEST
mkdir -p $DEST
cp -Rp ../yagrid/package.json $DEST/
cp -Rp ../yagrid/dist $DEST/
yarn add file:./imports/yagrid