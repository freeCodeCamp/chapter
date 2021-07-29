#!/bin/sh

set -e

if [[ $(git remote -v | grep 'upstream' | wc -l) -eq 0 ]]; then
  echo "Upstream remote not found, adding one"
  git remote add upstream https://github.com/freeCodeCamp/chapter.git
fi

git fetch upstream

git checkout main
git reset --hard upstream/main

echo ""
echo "Git remotes have been setup successfully"
