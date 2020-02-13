#!/bin/sh

set -e

if [[ $(git remote -v | grep 'upstream' | wc -l) -eq 0 ]]; then
  echo "Remote origin not found, adding one"
  git remote add upstream https://github.com/freeCodeCamp/chapter.git
fi

git fetch upstream

git checkout master
git rebase upstream/master

echo ""
echo "To reset to upstream master do 'git reset --hard upstream/master'"