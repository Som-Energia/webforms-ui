#!/bin/bash

GREEN='\033[0;32m' # Green
BLUE='\033[0;34m' # Blue
RED='\033[1;31m' # Red
NC='\033[0m' # No Color
die() {
	echo -e $RED"$*"$NC >&2
	exit -1
}
step() {
	echo -e $BLUE"$*"$NC >&2
}

if [ "$(dirname $0)" != "." ]; then
    echo "You must run the program from the scripts directory."
    exit -1
fi



SCRIPTPATH=$(dirname $0)
REPOPATH=$(dirname $0)/..
BUILD=${REPOPATH}/forms/
OVDIR=${1:-${REPOPATH}/../oficinavirtual}
TARGET=${OVDIR}/src/front/static/webforms
environment_file="$SCRIPTPATH/deploy-ovlocal.conf"
source "$environment_file"

build=build

if [ -z "$DEPLOYMENT_BUILD" ]; then
  die "DEPLOYMENT_BUILD is not set in deploy-ovlocal.conf"
else
  build="build:$DEPLOYMENT_BUILD"
fi

function build () {
    step "INFO" "Building project $build"
    npm run $build

    if [ $? != 0 ]
    then
        echo "ERROR" "An error ocurred building app $?"
        exit -1
    fi
}


function checkOV () {
    [ -d "$OVDIR" ] || die "Django repository '$OVDIR' does not exist, provide it as first parameter"
    [ -d "$(dirname $TARGET)" ] || die "Target directory $(dirname $TARGET) does not exist. Maybe the oficinavirtual repo is not at '$OVDIR' as expected"
}




TODAY=$(date +"%Y-%m-%d_%H%M%S")
DEPLOY_PREFIX="${DEPLOYMENT_PREFIX:-forms}"
VERSION_DIR="$DEPLOY_PREFIX-$TODAY"
DEST_DIR="$DEPLOYMENT_CURRENT_PATH/$VERSION_DIR"

function copyBuildToDest () {
    step "Copying build to builds directory $DEST_DIR"
    cp -r $BUILD $DEST_DIR
    echo "Copied build to $DEST_DIR"
}

function updateCurrentLink () {
	step "Updating current_forms link to point to $DEST_DIR"
	if [ -L "$DEPLOYMENT_CURRENT_PATH/current_forms" ]; then
		rm -f $DEPLOYMENT_CURRENT_PATH/current_forms
	fi
	ln -s $DEST_DIR $DEPLOYMENT_CURRENT_PATH/current_forms
	echo "Updated current_forms link to $DEST_DIR"
}

function createStaticLink () {
	
	if [ -L "$DEPLOYMENT_STATIC_PATH" ]; then
		echo "$DEPLOYMENT_STATIC_PATH already exists"
		rm -f $DEPLOYMENT_STATIC_PATH
	fi
    
	step "Creating soft link from static to current version"
    echo "$DEPLOYMENT_STATIC_PATH -> $DEPLOYMENT_CURRENT_PATH/current_forms"
    ln -s $DEPLOYMENT_CURRENT_PATH/current_forms $DEPLOYMENT_STATIC_PATH
}

echo "Let's go! Deploying local OV instance..."


build
checkOV
copyBuildToDest
updateCurrentLink
createStaticLink