#!/usr/bin/env bash

#shellcheck disable=SC1091
test -f "/scripts/plex-preferences.sh" && source "/scripts/plex-preferences.sh"

#shellcheck disable=SC2155
export PLEX_MEDIA_SERVER_INFO_MODEL=$(uname -m)
#shellcheck disable=SC2155
export PLEX_MEDIA_SERVER_INFO_PLATFORM_VERSION=$(uname -r)

[[ -f "${PLEX_MEDIA_SERVER_APPLICATION_SUPPORT_DIR}/Plex Media Server/plexmediaserver.pid" ]] && \
    rm -f "${PLEX_MEDIA_SERVER_APPLICATION_SUPPORT_DIR}/Plex Media Server/plexmediaserver.pid"

#shellcheck disable=SC1091
source "/scripts/vpn.sh"

if [[ "${WAIT_FOR_WARP:-"false"}" == "true" ]]; then
    echo "Waiting for WARP to be connected..."
    while true; do
        # Wait to confirm WARP is ready
        if (curl --silent --socks5 127.0.0.1:1080 https://www.cloudflare.com | grep -q cloudflare ); then
            echo "WARP Connected, starting application..."
            break
        fi    
        echo "WARP not connected"
        sleep 2
    done
fi


#shellcheck disable=SC2086
exec \
    /usr/lib/plexmediaserver/Plex\ Media\ Server \
    "$@"