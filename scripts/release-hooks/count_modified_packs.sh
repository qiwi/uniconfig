#!/usr/bin/env bash

git diff HEAD $(git rev-list -n 1 $(git describe --abbrev=0 --tags)) --name-only | grep packages | sed -E 's/^[^/]+\/([^/]+)\/.*$/\1/' | sort | uniq | wc -l > $(dirname $0)/count.tmp
