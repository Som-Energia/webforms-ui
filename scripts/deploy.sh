#!/bin/bash

deploy_server=$1
deploy_path=$2
testing=$3

function usage () {
    echo "Usage: $0 -s server -P path [-u user] [-p port] [-t testing] [-b env]" 1>&2
    exit 1
}

function log_message () {
    level="$1"
    msg="$2"
    echo "[$level] [$(date -u +"%Y-%m-%d %H:%M:%S")] $msg"
}

while getopts ":s:P:u:p:b:th" o; do
    case "${o}" in
        s)
            s=${OPTARG}
            ;;
        P)
            P=${OPTARG}
            ;;
        u)
            u=${OPTARG}
            ;;
        p)
            p=${OPTARG}
            ;;
        b)
            b=${OPTARG}
            ;;
        t)
            testing=1
            ;;
        h)
            usage
            ;;
        *)
            ;;
    esac
done
if [ -z "$s" ]; then usage; fi
if [ -z "$P" ]; then usage; fi
if [ -z "$u" ]; then user="somdevel"; else user=$u; fi
if [ -z "$p" ]; then port="22"; else port=$p; fi
if [ $testing != 1 ]; then testing=0; fi
if [ -z "$b" ]; then build="build"; else build="build:$b"; fi

deploy_server=$s
deploy_path=$P

today=$(date +"%Y-%m-%d_%H%M%S")
dest_dir="$deploy_path/build_$today"
app_dir="$deploy_path/build"

function build () {
    if [ $testing -eq 1 ]; then
        log_message "INFO" "Building project for oficinavirtual"
        yarn build:rename
    else
        log_message "INFO" "Building project"
        yarn $build
    fi;

    if [ $? != 0 ]
    then
        log_message "ERROR" "An error ocurred building app $?"
        exit -1
    fi
}

function upload () {
    RSYNC_RSH="ssh -p $port"
    export RSYNC_RSH
    log_message "INFO" "Uploading build build_$today to $deploy_server:$port"
    rsync -avz ../build/* $user@$deploy_server:$dest_dir
    if [ $? != 0 ]
    then
        log_message "ERROR" "An error ocurred uploading code: $?"
        exit -1
    fi

    log_message "INFO" "Linking new build... "
    ssh $user@$deploy_server -p $port "rm $app_dir; ln -s $dest_dir $app_dir"
    if [ $? != 0 ]
    then
        log_message "ERROR" "An error ocurred linking new build $?"
        exit -1
    fi
    unset RSYNC_RSH
}

log_message "INFO" "Build with env: $b"

build
upload
log_message "INFO" "Build finished, I did well my job!!"
log_message "INFO" "REMIND TO CLEAR THE WORDPRESS CACHE! "
