# New Contract Member: Variants

Aquí hi havia massa simplificació. `has_member` és només la primera partició. El flux real varia per múltiples dimensions que afecten UI, salts i payload final.

## Quick path

1. Comença a `setValidationSchemaAndSteps()` dins `src/containers/NewContractMember/NewContractMember.jsx`.
2. Mira `values.has_member`, però NO t'aturis aquí.
3. Revisa després `NextStep`, `getStep()` i `newNormalizeContract()`.

## Detalls

| Dimensió | Com es detecta | Efecte |
|---|---|---|
| Família grossa: `member-off` | alta de nou soci | usa `validationSchemasNewMember` i `NEW_MEMBER_CONTRACT_FORM_SUBSTEPS` |
| Família grossa: `member-on` | soci existent | usa la família link-member i pot saltar passos segons llum/titularitat |
| Família grossa: `member-link` | soci apadrinador o vinculat | usa la família link-member i introdueix `linked_member_info` al payload |
| Família grossa: `campaign-offer` | campanya 15 anys | entra nomes per la URL dedicada, preomple soci i força una entrada especial |
| Llum existent o no | `has_light === 'light-on'/'light-off'` | canvia la navegació, el `process` final (`A3/C1/C2`) i pot saltar autoconsum o member info |
| Autoconsum | `has_selfconsumption` | decideix si hi ha pas `SELFCONSUMPTION_INFO` i afegeix `self_consumption` al payload |
| Titularitat prèvia | `previous_holder === 'previous-holder-yes'` | canvia el `process` final via `contractProcess()` |
| Titular vs nou membre | `member_is_holder` i dades a `NewContractHolder` | impacta el model de dades del contract owner |
| Dades de soci verificades | `member.link_member` des de `checkMember()` | decideix si el backend rep `linked_member_info`, `new_member_info` o `contract_owner` |
| Context Gurb | `gurbCode` i `gurb_id` | afecta payload, tracking i pantalla final d'èxit |
| Campanya/feature flags | `specialCampaign`, `VITE_FEATURE_FLAGS` | poden injectar soci predefinit i alterar l'entrada del flux |
| Resum reeditable | `summaryField` | pot reobrir un pas intermedi i tornar després al resum |

## Casos concrets importants

| Cas | Conseqüència real |
|---|---|
| Es fa soci nou mentre contracta | acaba generant `new_member_info` |
| Ja és soci | pot acabar com `linked_member: 'already_member'` |
| El patrocinen / l'apadrinen | es tracta com `linked_member: 'sponsored'` |
| És campanya | es comporta com patrocinat pero amb soci preinjectat (`campaign-offer`) i accés exclusiu per URL |
| Té autoconsum i té llum | s'obre la branca de dades d'autoconsum |
| No té llum | el procés final és `A3` i la navegació canvia |
| Les dades del soci venen validades per backend | `LinkMemberDetails` usa `checkMember(number, nif)` per marcar `member.link_member` |

## Sobre "dades de l'ERP"

En aquest flux no he vist una càrrega massiva automàtica de dades personals des de frontend. El que sí hi ha verificat al codi és:

- validació remota de soci existent amb `checkMember()`
- validació de NIF amb `checkVat()` en components reutilitzats
- validació de CUPS amb `checkCups()`

Això vol dir que el frontend pren decisions segons dades verificades pel backend, encara que no estigui omplint tot el formulari automàticament des de l'ERP.

## Checklist

- [ ] Has confirmat `has_member`, però també `has_light`, `has_selfconsumption`, `previous_holder` i si hi ha `gurbCode`.
- [ ] Has comprovat si el canvi impacta `checkMember()` o la generació de `linked_member_info/new_member_info/contract_owner`.
- [ ] Si hi ha campanya, has revisat `customInitialValues`, `campaign-offer`, la ruta dedicada i els flags d'entorn.
