#!/usr/bin/env bash

((rest=$(cat $(dirname $0)/count.tmp) - 1))
echo $rest > $(dirname $0)/count.tmp
