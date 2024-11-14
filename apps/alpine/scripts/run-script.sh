#!/usr/bin/env bash

# Execute any scripts found in /setupscripts
for SCRIPT in $(ls /setupscripts); do
    bash -c $SCRIPT
done