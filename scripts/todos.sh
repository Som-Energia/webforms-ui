#!/bin/bash

CYAN=$(printf '\033[0;36m')
YELLOW=$(printf '\033[1;33m')
RED=$(printf '\033[0;31m')
BOLD=$(printf '\033[1m')
RESET=$(printf '\033[0m')

if [ -z "$1" ]; then
  echo "Usage: $0 <directory>" >&2
  exit 1
fi

DIR=$1

results=$(grep -rn --include='*.js' --include='*.jsx' -E '(TODO|FIXME)' "$DIR")

if [ -z "$results" ]; then
  echo -e "${CYAN}No TODO/FIXME comments found.${RESET}"
  exit 0
fi

count=$(echo "$results" | wc -l)
echo -e "${BOLD}Found ${count} TODO/FIXME comments:${RESET}\n"

echo "$results" | while IFS= read -r line; do
  file=$(echo "$line" | cut -d: -f1)
  lineno=$(echo "$line" | cut -d: -f2)
  content=$(echo "$line" | cut -d: -f3-)

  colored_content=$(echo "$content" \
    | sed "s/TODO/${YELLOW}TODO${RESET}/g" \
    | sed "s/FIXME/${RED}FIXME${RESET}/g")

  echo -e "  ${CYAN}${file}${RESET}:${YELLOW}${lineno}${RESET}:${colored_content}"
done
