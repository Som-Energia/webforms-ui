# Flux: Indexed

Flux de canvi a tarifa indexada, amb dependència forta de dades injectades del contracte i comprovació prèvia de si el canvi és permès.

## Quick path

1. Comença a `src/containers/Indexed.jsx`.
2. Revisa `contractJSON` i la resposta de `can_modify_tariff(token)` abans de tocar UI.
3. Si canvies acceptacions legals o submit, revisa `modify_tariff()`.

## Detalls

| Tema | Context |
|---|---|
| Dada base | llegeix `contract-data` directament del DOM |
| Precheck | `checkCanModifyTariff()` consulta backend i determina tarifa objectiu i coeficient |
| Short-circuit | pot tallar el flux amb `Loading`, `Alert`, `Failure` o errors menors abans del formulari complet |
| Flux | dues pantalles d'informació i una revisió final de termes |
| Validació | schemas molt simples però condicionals segons `isTariffIndexed` i `isIndexedPilotOngoing` |
| Idioma/data | sincronitza `i18n` i també `dayjs` |
| UI lateral | hi ha `DropDownMenu` amb seccions legals construïdes dinàmicament |
| Submit | envia acceptacions a `modify_tariff()` amb `token` |

## Riscos reals

- Tocar la UI sense entendre si la tarifa és modificable.
- Trencar la construcció de textos legals per variants de tarifa.
- Oblidar que part del flux depèn de dades DOM, no només de props React.
- Confondre errors bloquejants amb `lesserErrors` que poden conviure amb la primera pantalla.

## Checklist

- [ ] Has verificat `contractJSON` i el precheck backend.
- [ ] Has comprovat el comportament amb `loadingTariff`, amb `targetTariff` absent i amb errors menors.
- [ ] Si canvies termes legals, has revisat totes les variants condicionals.
- [ ] Has comprovat el camí d'error del backend, no només el d'èxit.
