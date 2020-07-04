#!/bin/bash

switcheroo_main() {
  set -e

  local REPO=$1
  local OLD_BRANCH=$2
  local NEW_BRANCH=$3
  [[ -n "$4" ]] && local REPO_NAME=$4 || local REPO_NAME=$(echo $REPO | rev | cut -f 1 -d/ | rev)

  git clone -q $REPO /tmp/$REPO_NAME
  cd /tmp/$REPO_NAME
  git branch -m $OLD_BRANCH $NEW_BRANCH
  git push origin $NEW_BRANCH
}

switcheroo_main $@