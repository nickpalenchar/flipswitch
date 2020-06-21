#!/usr/bin/env bash

main() {
  set -e

  REPO_DIR=$1
  BRANCH=$2

  cd /tmp/$REPO_DIR
  git push origin --delete $BRANCH
}

main $@