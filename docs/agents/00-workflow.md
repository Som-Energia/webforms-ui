# Workflow D'Agent

## Objectiu

Actuar amb context minim, llegint nomes el que cal per al canvi concret.

## Abans d'editar

1. Localitza la ruta o el flux afectat a `src/App.jsx`.
2. Detecta si el canvi viu a `src/containers/*` o `src/components/*`.
3. Si hi ha formulari, revisa el container, les pagines del flux i les validations associades.
4. Si es toca un component o pantalla que s'utilitza en diferents formularis, assegurar que no es trenca compatibilitat.
5. Si hi ha text visible o ruta amb idioma, revisa `04-i18n.md`.
6. Si hi ha IO extern, revisa `06-integracions.md`.

## Regles practiques

- Fes canvis petits i locals abans d'introduir helpers nous.
- No assumeixis que un formulari es d'un sol pas: molts fluxos depenen d'`activeStep`, esquemes `Yup` i resum final.
- No toquis operativa de deploy si no es demana explicitament.
- Verifica sempre amb el test mes proper al canvi, no nomes amb lectura de codi.
- Si un canvi deixa desalineat algun fitxer de `docs/agents/*`, actualitza'l dins la mateixa branca.
- Si l'usuari et demana revisar la documentacio, contrasta els docs amb el codi actual i corregeix el que hagi quedat vell.

## Verificacio minima

1. `npm test` si el canvi afecta logica o components amb proves.
2. `npm run lint` si has introduit o reestructurat codi.
3. `npm run cypress:smoke` o l'spec rellevant si el canvi afecta rutes o formularis principals.
