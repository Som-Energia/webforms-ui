#!/bin/bash
# This script checks for errors in the translation files

languages="es eu ca gl"
reflang=es

step() { echo -en "\033[34;1m$@\033[0m" >&2 ; }
error() { echo -e "\033[31;1m$@\033[0m" >&2; }
success() { echo -e "\033[36;1m$@\033[0m" >&2; }
die() { error "$@"; exit -1; }

[ -d scripts ] || die "Run the script from the project root, please"

check() {
  if output="$("$@")"
  then
    success OK
  else
    error FAILED
    echo "$output"
  fi
}

check_every_lang() {
  for lang in $languages; do
    check "$@" $lang
  done
}

color_diff() {
  ! (
    diff "$1" "$2" |
    sed 's/^[<] \(.*\)$/\x1b[31;1m<<\x1b[0m \1/' |
    sed 's/^[>] \(.*\)$/\x1b[33;1m>> \1\x1b[0m/' |
    sort |
    grep  '[<>]'
  )
}

ids_from_src() {
  npm run extract
  step "Extracting ids from source: red maybe obsolete, yellow new... "
  color_diff <(json_ids $reflang) <(json_ids xx)
}

json_ids() {
  lang=$1
  python -c "import json; [print(id) for id in json.load(open('src/i18n/locale-$lang.json'))]" | sort
}

untranslated_ids() {
  lang=$1
  step "Checking missing translations: $lang... "
  color_diff <(json_ids $reflang) <(json_ids $lang)
}

faq_lang() {
  lang=$1
  step "Checking FAQ links with wrong language: $lang... "
  ! ( grep support.somenergia src/i18n/locale-$lang.json | sort | grep -v $lang.support.somenergia )
}

utm_query_params() {
  lang=$1
  step "Checking FAQ links with utm query params: $lang... "
  ! ( grep support.somenergia.*utm src/i18n/locale-$lang.json )
}

unused_ids() {
  lang=$1
  step "Checking unused ids: $lang... "
  missing=$(
    json_ids $lang | while read id; do
      # Allow to exclude IDS
      grep "^$id$" scripts/i18n-external-ids.conf -q 2> /dev/null && continue
      grep -r \\\<"$id"\\\> src --exclude-dir=i18n --exclude-dir=static -q || echo $id
    done
  )
  echo "$missing"
  [ -z "$missing" ] && return 0
  return -1
}

find_external_id() {
  lang=$1
  external_dir=$2
  step "Look for ids in $2... "
  missing=$(
    json_ids $lang | while read id; do
      grep -r \\\<"$id"\\\> $d --exclude-dir=i18n --exclude-dir=static -q || echo $id
    done
  )
  echo "$missing"
  [ -z "$missing" ] && return 0
  return -1
}

# Calling t() with a non-literal expression as parameter prevents
# gettext and similar tools to identify translations IDs to extract.
# For conditional expresions t(cond?id1:id2) -> cond?t(id1):t(id2)
# If you construct the id, start by using the constructed as a key
# for a dictionary, and in the dictionary, use t(id) as the value,
# then refactor.
# If the id comes from an external source (ie. API error codes),
# a dictionary is also a solution and an opportunity to handle
# unexpected error IDs properly.
# For external id's prepend 
non_literal_t_calls() {
  step "Locating t calls with non literals... "
  ! grep "\<t([^'\"]" src/ -r 
}

# Usually multiline calls to t are expressions as well.
# In a separate query to simplify the query and separate
# possible false positives.
multiline_t_calls() {
  step "Locating t calls with multiline parameters... "
  ! grep "\<t(\s*$" src/ -r
}

check ids_from_src # wait the migration merge to add "run extract"
check_every_lang untranslated_ids
check_every_lang faq_lang
check_every_lang utm_query_params
check unused_ids $reflang
check non_literal_t_calls
check multiline_t_calls


#find_external_id $reflang ../oficinavirtual/src
#find_external_id $reflang ../webforms-api/webforms

