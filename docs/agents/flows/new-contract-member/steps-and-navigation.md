# New Contract Member: Passos I Navegació

La complexitat real del flux és la navegació. No és un `activeStep + 1` normal.

## Quick path

1. Revisa `nextStep()` i `prevStep()` a `src/containers/NewContractMember/NewContractMember.jsx`.
2. Mira `src/services/steps.js` per la numeració declarada.
3. Si el problema és de resum, revisa `summaryField`.

## Detalls

| Tema        | Context                                                                                                                          |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Inici       | Normalment comença al pas 0; `initStep` té prioritat i `tt=sponsoredContract` comença al pas 2 si no hi ha `initStep`             |
| Pas següent | es calcula amb `NextStep`, `keyByValue` i `valueByKey` segons respostes (`has_light`, `has_selfconsumption`, `has_member`, etc.) |
| Historial   | `prevSteps` guarda la navegació real per poder tornar enrere                                                                     |
| Resum       | `summaryField` pot reobrir un pas i després reenviar al resum final                                                              |
| Render      | `getStep()` canvia completament segons variant i `activeStep`                                                                    |

## Branques que realment salten passos

- `campaign-offer` pot entrar des de la quarta opció de la pregunta inicial quan `VITE_FEATURE_FLAGS.isNonMemberCampaignEnabled` està activat, o per les URLs dedicades `/:language/100parati` i `/:language/100peratu`; després comença al pas 2.
- `tt=sponsoredContract` comença al pas 2 sense botó per tornar enrere, amb `has_member=member-link` i els passos i esquemes de soci vinculat. Les dades del soci patrocinador encara no s'inicialitzen en aquest punt.
- `has_light === 'light-off'` pot saltar parts del flux i canvia el procés final.
- `has_selfconsumption !== 'selfconsumption-on'` evita el pas de detall d'autoconsum.
- a la família `member-on`, alguns camins van directament a `DONATION` i eviten `MEMBER_INFO`.
- a `member-link` i `campaign-offer`, si no hi ha llum, la navegació va a `MEMBER_INFO` en lloc de la branca del soci existent.

## Checklist

- [ ] Si canvies un pas, has revisat `getStep()` en les dues variants.
- [ ] Si canvies salts, has revisat `NextStep` i `steps.js` a la vegada.
- [ ] Si canvies resum o edició des del resum, has verificat el flux amb `summaryField`.
