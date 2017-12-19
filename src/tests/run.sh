#!/bin/bash

TESTCOUNT=$(ls | grep test*.js | wc -l)

for((i=1; i<=$TESTCOUNT; i++))
    do
        node "test"$i".js"
    done
