# Flux: New Contract Member

És un dels fluxos més crítics i complexos del repo: contractació multi-step amb branques segons tipus de membre, autoconsum, resum i integracions externes.

## Quick path

1. Comença a `src/containers/NewContractMember/NewContractMember.jsx`.
2. Revisa `src/services/steps.js` per entendre la numeració real del flux.
3. Si canvies dades finals, revisa `newNormalizeContract()` i `newContract()`.

## Detalls

| Tema | Context |
|---|---|
| Container arrel | `src/containers/NewContractMember/NewContractMember.jsx` |
| Variants | flux diferent per `member-on`, `member-off` i `member-link` |
| Pasos | lògica repartida entre `pages/*` i arrays de `validationSchemas` |
| Branques | depèn de `gurb-code`, `mtm_*`, `initStep`, `tariff` i flags injectats |
| Submit | normalitza amb `newNormalizeContract(values, gurbCode)` i envia a `newContract()` |
| Tracking | molts events Matomo i pixel al llarg del flux |
| UI | `data-cy='contract-form'`, `SomStepper`, resum i passos condicionals |

## Diagrama ràpid

```text
pas 0: pregunta inicial (`has_member`)
        |
        +--> member-off
        |      |
        |      v
        |   alta nou soci
        |   -> punt subministrament
        |   -> potencia
        |   -> [si te llum] autoconsum?
        |   -> titular
        |   -> donacio
        |   -> pagament
        |   -> resum
        |
        +--> member-on
        |      |
        |      v
        |   validar soci existent
        |   -> punt subministrament
        |   -> potencia
        |   -> [si no te llum] pot saltar cap a donacio
        |   -> [si te llum] pot passar per autoconsum
        |   -> identificar dades membre/titular
        |   -> pagament
        |   -> resum
        |
        +--> member-link / campaign-offer
               |
               v
            validar soci patrocinador
            -> punt subministrament
            -> potencia
            -> [si no te llum] member info
            -> [si te llum] autoconsum opcional
            -> titular
            -> member info
            -> pagament
            -> resum

resum
  |
  v
submit `newContract()`
  |
  +--> sense `redsys_endpoint` -> resultat local
  |
  +--> amb `redsys_endpoint` -> TPV
                               |
                               +--> si venia de Gurb (`gurb-code`) -> redirect posterior cap a join Gurb
```

## Riscos reals

- Desalinear `activeStep`, noms de passos i schemas.
- Canviar `initialValues` sense tocar resum o payload final.
- Trencar branques de soci vinculat o autoconsum.
- Tocar un pas legal o de pagament sense revisar tracking i resposta final.

## Checklist

- [ ] Has identificat quina variant del flux toques realment.
- [ ] Has revisat si el canvi afecta `validationSchemasLinkMember` o `validationSchemasNewMember`.
- [ ] Has comprovat l'impacte en resum, pagament i submit final.

## Subdivisió útil

- `new-contract-member/README.md`: índex del flux gran.
- `new-contract-member/variants.md`: diferències entre alta nova, soci vinculat i campanya.
- `new-contract-member/steps-and-navigation.md`: `activeStep`, `steps.js`, salts i resum.
- `new-contract-member/payment-and-submit.md`: payload final, Redsys, tracking i resposta.
