#!/usr/bin/env bash

tag=$(git describe --abbrev=0 --tags)

echo -e current $tag

git fetch
git tag -d $tag
git push origin --delete $tag
git push origin :refs/tags/$tag
git fetch

echo -e next $(git describe --abbrev=0 --tags)
