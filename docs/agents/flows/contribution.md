# Flux: Contribution

Flux d'aportació genèrica, semblant a Generation però més simple i sense la part específica de generació kWh ni la signatura final.

## Quick path

1. Comença a `src/containers/Contribution.jsx`.
2. Revisa si el canvi és d'identificació, alta de soci, dades personals, import o review.
3. Si canvies el submit, revisa `normalizeContribution()`, `normalizeMember()`, `contribution()` i `member()`.

## Detalls

| Tema | Context |
|---|---|
| Container arrel | `src/containers/Contribution.jsx` |
| Flux | identificació, dades personals opcionals, aportació, revisió i resultat |
| Validació | `Yup` embegut al mateix container |
| Navegació | si `member.is_member` és `true`, es salta el pas de dades personals tant endavant com enrere |
| Lògica econòmica | usa `contributionParams` per mínims, màxims i salts |
| Submit | si no és sòcia, primer crea membre via `member()`, després envia `contribution()` |
| Idioma | `useSyncLanguage(language)` i `member.language` inicial |
| UI antiga | encara reutilitza `OldComponents` en diversos punts |

## Riscos reals

- Té patrons semblants a Generation però no és el mateix flux.
- Les validacions econòmiques són sensibles a imports i multiplicitats.
- Barreja components més antics amb patrons nous.
- El pas de dades personals no sempre existeix si la persona ja és sòcia.

## Checklist

- [ ] Has distingit si el canvi és només de contribution o també afecta Generation.
- [ ] Has provat el camí de sòcia existent i el de nova sòcia.
- [ ] Has revisat límits econòmics i payload final.
- [ ] Has comprovat si el canvi impacta components antics reutilitzats.
