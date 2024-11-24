#!/usr/bin/env bash
channel=$1
version=$(curl -s "https://prowlarr.servarr.com/v1/update/${channel}/changes?os=linux&runtime=netcore" | jq --raw-output '.[0].version')
version="${version#*v}"
version="${version#*release-}"
printf "%s" "${version}"