#!/usr/bin/env bash

channel=$1
version=$(curl -sX GET https://api.github.com/repos/debridmediamanager/zurg/releases --header "Authorization: Bearer ${TOKEN}" | jq --raw-output '. | first | .tag_name')
printf "%s" "${version}"