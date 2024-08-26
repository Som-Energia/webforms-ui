#!/bin/bash

SCRIPTPATH=$(dirname $0)
RED="\033[31;1m"
GREEN="\033[32m"
ORANGE="\033[33m"
NC="\033[0m"

usage () {
    echo "Usage: $0 <environment>" 1>&2
    echo "$(available_deploys)" >&2
    exit 1
}

die() {
    echo -e "$RED$@$NC" >&2
    exit -1
}
log_message () {
    level="$1"
    msg="$2"
    echo -e "$GREEN[$level]$NC $ORANGE[$(date -u +"%Y-%m-%d %H:%M:%S")]$NC $msg"
}

available_deploys() {
    echo "Available environments:"
    for f in $SCRIPTPATH/deploy-*.conf;
    do
        mode=$(echo $f | sed 's/^.*deploy-\(.*\).conf/\1/')
        [ -f "$f" ] && echo "✓ $mode" || echo "✘ $mode (may be a broken link)"
    done
}

environment="$1"
environment_file="$SCRIPTPATH/deploy-$environment.conf"
    
[ "$1" == "" ]  && {
    usage
}       
        
[ -f "$environment_file" ] || {
    die "Environment '$environment' not available since '$environment_file' does not exist. Read the README for more info"
}

source "$environment_file"
echo configuration loaded

for var in \
    DEPLOYMENT_HOST \
    DEPLOYMENT_PORT \
    DEPLOYMENT_USER \
    DEPLOYMENT_PATH \
; do
    [ -z "${!var}" ] && die "Config $environment_file missing value for $var"
done
build=build
[ -z "$DEPLOYMENT_BUILD" ] || build="build:$DEPLOYMENT_BUILD"
deploy_server=$DEPLOYMENT_HOST
deploy_path=$DEPLOYMENT_PATH
port="$DEPLOYMENT_PORT"
user="$DEPLOYMENT_USER"
deploy_prefix="${DEPLOYMENT_PREFIX:-build}"

today=$(date +"%Y-%m-%d_%H%M%S")
version_dir="$deploy_prefix-$today"
dest_dir="$deploy_path/$version_dir"
app_dir="$deploy_path/$deploy_prefix"

function build () {
    log_message "INFO" "Building project $build"
    npm run $build

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
    script_path=$(dirname $0)
    rsync -avz $script_path/../build/* $user@$deploy_server:$dest_dir
    if [ $? != 0 ]
    then
        log_message "ERROR" "An error ocurred uploading code: $?"
        exit -1
    fi

    log_message "INFO" "Linking new build... "
    ssh $user@$deploy_server -p $port "rm $app_dir; ln -s $version_dir $app_dir"
    if [ $? != 0 ]
    then
        log_message "ERROR" "An error ocurred linking new build $?"
        exit -1
    fi
    unset RSYNC_RSH
}

log_message "INFO" "Build with env: $build"

build
upload
[ -z "$DEPLOYMENT_URL" ] || {
  log_message "INFO" "Opening browser at $DEPLOYMENT_URL"
  open "$DEPLOYMENT_URL"
}
log_message "INFO" "Build finished, I did well my job!!"
log_message "INFO" "REMIND TO CLEAR THE WORDPRESS CACHE! "
