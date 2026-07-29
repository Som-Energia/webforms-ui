# Holder Change: Casos Especials

Els casos especials són on més fàcilment es trenquen validacions perquè combinen motiu, adjunts i requisits condicionals.

## Quick path

1. Revisa l'schema `Yup` de `especial_cases` a `src/containers/HolderChange.jsx`.
2. Localitza els motius: `reason_default`, `reason_death`, `reason_merge`, `reason_electrodep`.
3. Si canvies adjunts, revisa `attachments` per cada branca.

## Detalls

| Motiu | Requisit |
|---|---|
| `reason_death` | adjunt `death` obligatori |
| `reason_merge` | adjunt `merge` obligatori |
| `reason_electrodep` | adjunts `medical` i `resident` obligatoris |
| conjunt de motius | almenys un motiu ha d'estar marcat |

## Checklist

- [ ] Si canvies un motiu, has revisat també els adjunts associats.
- [ ] Has comprovat la regla “almenys un motiu”.
- [ ] Has verificat l'impacte al pas `SpecialCases` i al payload final.
