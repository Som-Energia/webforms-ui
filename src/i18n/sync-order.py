#!/usr/bin/env python
from yamlns import ns
import json
import sys
from consolemsg import fail


help=f"""\
Usage: {sys.argv[0]} <unorderedLanguage> [<referencelanguage> [<filepattern.json>]]

This script reorders a JSON translation file according
to the order of the keys in a reference translation file.
Keys not present in the reference file, are appended at the
end, keeping their relative order.

Often, translation utilities like Weblate and PoEdit,
just appends the new texts as they get translated and that
leads to arbitrary ordering.
The purpose is being able to edit them side to side and spot
the strings which are missing in each.

This will generate language-ca.json.new containing strings in
language-ca.json but ordered like language-es.json

    {sys.argv[0]} ca es 'locale-{{}}.json'

Since those are the default values for the reference language
and the file pattern, this will be equivalent to:

    {sys.argv[0]} ca
"""

unorderedLanguage = sys.argv[1] if len(sys.argv) > 1 else fail(help)
referenceLanguage = sys.argv[2] if len(sys.argv) > 2 else 'es'
filepattern = sys.argv[3] if len(sys.argv) > 3 else 'locale-{}.json'

referenceFile = filepattern.format(referenceLanguage)
unorderedFile = filepattern.format(unorderedLanguage)
outputFile = unorderedFile + '.new'

# yamlns keeps the reading order
reference = ns.load(referenceFile)
unordered = ns.load(unorderedFile)

missing = [
    key
    for key in unordered.keys()
    if key not in reference
]

output = ns([
    (key, unordered[key])
    for key in reference
    if key in unordered
] + [
    (key, unordered[key])
    for key in unordered
    if key not in reference
])

outputContent = json.dumps(
    output,
    indent=4, # weblate output does this
    ensure_ascii=False, # grown up utf8 citizens do not need \unnn codes
)

open(outputFile, 'w', encoding='utf8').write(outputContent)
