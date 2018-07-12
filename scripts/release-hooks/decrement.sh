#!/usr/bin/env bash

expr $(cat $(dirname $0)/count.tmp) - 1 > $(dirname $0)/count.tmp
