#!/usr/bin/env bash

value=$(git diff HEAD $(git rev-list -n 1 $(git describe --abbrev=0 --tags)) --name-only | grep packages | sed -E 's/^[^/]+\/([^/]+)\/.*$/\1/' | sort | uniq | wc -l)
RH_TOTAL=$value
RH_COUNT=$value

export RH_TOTAL
export RH_COUNT

echo "changed packages: "$RH_TOTAL
