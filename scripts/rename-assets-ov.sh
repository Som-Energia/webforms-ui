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

REPOPATH=$(dirname $0)/..
BUILD=${REPOPATH}/forms/
OVDIR=${1:-${REPOPATH}/../oficinavirtual}
TARGET=${OVDIR}/src/front/static/webforms


[ -d "$OVDIR" ] || die "Django repository '$OVDIR' does not exist, provide it as first parameter"
[ -d "$(dirname $TARGET)" ] || die "Target directory $(dirname $TARGET) does not exist. Maybe the oficinavirtual repo is not at '$OVDIR' as expected"

step "Removing existing $TARGET"
rm -rf "${TARGET}"
mkdir "${TARGET}"

step "Copying resources to $TARGET"
cp -r "${BUILD}/assets" "$TARGET"
cp -r "${BUILD}/static" "$TARGET"