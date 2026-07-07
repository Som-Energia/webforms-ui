# Flux: Holder Change

Flux llarg i antic, amb molta validació embeguda, casos especials i dependència forta de dades i adjunts.

## Quick path

1. Comença a `src/containers/HolderChange.jsx`.
2. Localitza el pas concret entre VAT, CUPS, membre, dades personals, casos especials, IBAN i review.
3. Si canvies payload o semàntica, revisa `normalizeHolderChange()` i `holderChange()`.

## Detalls

| Tema | Context |
|---|---|
| Container arrel | `src/containers/HolderChange.jsx` |
| Flux | multi-step llarg amb components sota `src/containers/HolderChange/*` |
| Validació | gran part de l'schema `Yup` està embegut al mateix container |
| Casos especials | morts, fusions, electrodependència i adjunts obligatoris |
| Eines ocultes | hi ha inspector activable per hotkeys (`ctrl+alt+shift+d`) |
| Submit | normalitza amb `normalizeHolderChange()` i envia a `holderChange()` |

## Diagrama ràpid

```text
0 VAT
  -> 1 CUPS
  -> 2 BecomeMember
       |
       +--> se salta si ja es membre
       +--> se salta si es comunitat de propietaris
       v
  -> 3 HolderCase
       |
       +--> se salta si ja es membre
       +--> se salta si es fa soci ara
       +--> se salta si `isMemberMandatoryForHolderchange`
       v
  -> 4 MemberIdentifier
       |
       +--> se salta si ja es membre
       +--> se salta si es fa soci ara
       +--> se salta si no es obligatori i no vol vincular soci
       v
  -> 5 PersonalData
  -> 6 VoluntaryCent
  -> 7 SpecialCases
  -> 8 IBAN
  -> 9 Review
  -> submit `holderChange()`

finalment
  |
  +--> Success
  |
  +--> Failure (amb codi d'error derivat del backend)
```

## Riscos reals

- Molta lògica històrica en un sol fitxer.
- Camps i adjunts molt condicionals.
- És fàcil tocar validacions de comunitats, representants o casos especials sense veure efectes laterals.

## Checklist

- [ ] Has revisat si el canvi impacta una branca especial.
- [ ] Si hi ha adjunts, has comprovat les regles per tipus de motiu.
- [ ] Has verificat el resum i el payload final, no només el camp visible.

## Subdivisió útil

- `holder-change/README.md`: índex del flux.
- `holder-change/navigation.md`: salts de pas, `skipStep` i navegació real.
- `holder-change/special-cases.md`: motius especials, adjunts i validacions condicionals.
- `holder-change/submit-and-errors.md`: normalització, enviament i tractament d'errors.
