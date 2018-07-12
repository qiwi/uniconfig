#!/usr/bin/env bash

tag=$(git describe --abbrev=0 --tags)

echo current $tag

git tag -d $tag
git push --delete origin $tag

echo next $(git describe --abbrev=0 --tags)