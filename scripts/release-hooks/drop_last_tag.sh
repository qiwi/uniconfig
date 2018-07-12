#!/usr/bin/env bash

tag=$(git describe --abbrev=0 --tags)

echo -e current $tag

git tag -d $tag
git push --delete origin $tag
git push origin :refs/tags/$tag

echo -e next $(git describe --abbrev=0 --tags)
