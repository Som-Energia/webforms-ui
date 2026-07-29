# Flux: New Member

Alta de soci en 4 passos, relativament lineal i amb menys branques que la contractació.

## Quick path

1. Comença a `src/containers/NewMember/NewMember.jsx`.
2. Mira `pages/*` per al pas concret i `validations/*` per l'schema associat.
3. Si canvies el payload final, revisa `newNormalizeMember()` i la crida `member()`.

## Detalls

| Tema | Context |
|---|---|
| Container arrel | `src/containers/NewMember/NewMember.jsx` |
| Pasos | `MemberIdentifier`, `MemberPersonalData`, `PaymentMethod`, `MemberSummary` |
| Navegació | `activeStep` de 0 a 3 i `NEW_MEMBER_FORM_SUBSTEPS` |
| Navegació especial | `summaryField` pot reobrir un pas des del resum i tornar després al final |
| Submit | normalitza amb `newNormalizeMember(values)` i envia a `member()` |
| Pagament | si la resposta conté `endpoint` i `payment_data`, fa `POST` amb un formulari ocult |
| Tracking | events Matomo per canvi de pas i enviament |
| Idioma | `useSyncLanguage(language)` i camps inicials dependents d'`i18n.language` |

## Checklist

- [ ] Si canvies un camp, has revisat `initialValues`, validació, pàgina i normalització.
- [ ] Si canvies el resum, has comprovat salts via `summaryField`.
- [ ] Si canvies submit o resposta, has revisat el camí amb i sense `endpoint` de resposta.
