#!/usr/bin/env python

from yamlns import ns
import json
import sys

reference = ns.load('locale-es.json')
translationFile = 'locale-{}.json'.format(sys.argv[1])

translation = ns.load(translationFile)

missing = [
    key
    for key in translation.keys()
    if key not in reference
]

output = ns([
    (key, translation[key])
    for key in reference
    if key in translation
] + [
    (key, translation[key])
    for key in missing
])


open(translationFile+'.new', 'w', encoding='utf8').write(json.dumps(output, indent=4, ensure_ascii=False))

    








