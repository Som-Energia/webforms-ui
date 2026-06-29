# Flux: Generation

Flux d'aportació a generació kWh, amb identificació, possible alta de soci, aportació econòmica, revisió i signatura.

## Quick path

1. Comença a `src/containers/Generation/GenerationForm/GenerationForm.jsx`.
2. Revisa si el canvi és de membre, alta de soci, aportació, revisió o signatura.
3. Si canvies imports o límits, revisa `contributionParams`, salts per `is_member` i validacions `Yup` embegudes al container.

## Detalls

| Tema | Context |
|---|---|
| Container arrel | `src/containers/Generation/GenerationForm/GenerationForm.jsx` |
| Flux | identificació, dades personals opcionals, aportació, revisió i `GenerationSignaturit` abans del submit real |
| Validació | gran part de les `Yup` schemas viuen dins del mateix fitxer |
| Navegació | si `member.is_member` és `true`, es salta el pas de dades personals tant endavant com enrere |
| Gating | `has_generation_enabled_zone` i `generation_zone_checked` poden bloquejar o substituir el botó següent per un `ExitButton` |
| Submit | si no és sòcia, primer crea membre via `member()`, després envia `generationkWhContribution()` |
| Idioma | `useSyncLanguage(language)` i valor inicial de `member.language` |
| Dependències | reaprofita peces de `HolderChange` per dades personals |

## Riscos reals

- Aquest flux concentra molta lògica en un sol fitxer: és fàcil tocar una validació i impactar un altre pas.
- Hi ha dependència de límits i passos econòmics (`contributionStep`, mínims i màxims).
- El salt de passos canvia si la persona ja és sòcia.
- El submit real no passa al review sinó a la pantalla de signatura.

## Checklist

- [ ] Has verificat si el canvi afecta membres existents i nous.
- [ ] Has comprovat el comportament quan la zona de generació no permet continuar.
- [ ] Si canvies imports o càlculs, has revisat totes les validacions econòmiques.
- [ ] Has comprovat el camí fins a `GenerationSignaturit` i el submit final posterior.
