#!/bin/bash

## Run this script from the tools directory

in_a_only=$(python3 check-translation-files.py --en translation-test-data/a.json --fr translation-test-data/b.json | grep "only_a" | wc -l)
in_b_only=$(python3 check-translation-files.py --en translation-test-data/a.json --fr translation-test-data/b.json | grep "only_b" | wc -l)

if [ $in_a_only -eq 3 ] && [ $in_b_only -eq 3 ]; then
    echo "OK"
    exit 0
else
    echo "KO"
    exit 1
fi