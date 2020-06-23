#!/bin/bash

switcheroo_main() {
  set -eu

  local REPO_DIR=$1
  local BRANCH=$2
  cd /tmp/$REPO_DIR
  git push origin --delete $BRANCH
}

switcheroo_main $@