#!/usr/bin/env bash

git diff HEAD $(git rev-list -n 1 $(git describe --abbrev=0 --tags)) --name-only | grep packages