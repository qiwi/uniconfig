#!/usr/bin/env bash

value=$(git diff HEAD $(git rev-list -n 1 $(git describe --abbrev=0 --tags)) --name-only | grep packages | sed -E 's/^[^/]+\/([^/]+)\/.*$/\1/' | sort | uniq | wc -l)

echo $value > $(dirname $0)/count.tmp
echo $value > $(dirname $0)/total.tmp

echo "changed packages: "$value
