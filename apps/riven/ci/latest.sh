#!/usr/bin/env bash

channel=$1
if [[ "${channel}" == "dev" ]]; then
    version="feature/torbox"
	printf "%s" "${version}"
else
	version="$(curl -sX GET "https://api.github.com/repos/rivenmedia/riven/releases/latest" --header "Authorization: Bearer ${TOKEN}" | jq --raw-output '.tag_name')"
fi

printf "%s" "${version}"