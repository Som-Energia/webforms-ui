# Holder Change: Navegació

El flux actiu avança per passos numerats; no utilitza el `skipStep()` del container antic, que s'ha eliminat.

## Quick path

1. Comença a `getStep()`, `nextStep()` i `prevStep()` a `src/containers/NewHolderChange/NewHolderChange.jsx`.
2. Revisa `NEW_HOLDER_CHANGE_FORM_SUBSTEPS` i les validacions per pas.
3. Comprova l'entrada al resum des de `summaryField` i el pas de signatura després de crear la sol·licitud.

## Detalls

| Tema             | Context                                                                                                        |
| ---------------- | -------------------------------------------------------------------------------------------------------------- |
| Render de passos | Punt de subministrament, soci, titular, dades personals, casos especials, donació, pagament, resum i signatura |
| Navegació        | `nextStep()` i `prevStep()` mouen l'índex; `summaryField` pot saltar directament a un camp del resum           |
| Validació        | `validationSchemas` està alineat amb els passos al container arrel                                             |
| Finalització     | El resum crea la sol·licitud; la resposta decideix entre pagament, signatura o resultat                        |

## Checklist

- [ ] Si canvies navegació, has provat avançar i retrocedir.
- [ ] Has revisat l'efecte en comunitats de propietaris.
- [ ] Has verificat si el canvi impacta només passos visibles o també els saltats.
