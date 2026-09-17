# Gurb: Requirements

Aquest subflux decideix si la persona pot continuar directament a `join` o si abans ha de sortir temporalment a contractació.

## Quick path

1. Comença a `src/containers/Gurb/GurbFormRequirements.jsx`.
2. Revisa `nextStep()` i els bloquejos de `NextButton`.
3. Si canvies el final, mira `GurbRequirementsResult` i `GurbRequirementsTariffSelection`.

## Detalls

| Tema                   | Context                                                                                                 |
| ---------------------- | ------------------------------------------------------------------------------------------------------- |
| Pasos                  | `SupplyPoint`, `Address`, `LightQuestion` i, opcionalment, `GurbRequirementsTariffSelection`            |
| Finalització           | pot acabar al pas 3 sense nova contractació o al 4 si `new_contract === true`                           |
| Sortida a contractació | `GurbRequirementsTariffSelection` construeix la URL final de contractació amb `?gurb-code={{gurbCode}}` |
| Bloquejos              | `inside_perimeter`, `has_light` i `redirectUrl` bloquegen el següent pas                                |
| Tracking               | event per `activeStep` amb `gurbCode`                                                                   |

Els índexs de la navegació estan centralitzats a `GURB_REQUIREMENTS_FORM_SUBSTEPS` dins de `src/services/steps.js`. El resultat es detecta dinàmicament amb `steps.length`, ja que la selecció de tarifa només existeix per a una nova contractació.

## Què passa si el CUPS no el tenim a Som

El camí important no és només "no compleix". Si el flux determina `new_contract === true`, el resultat no envia a `join` directament, sinó a la contractació (`periods` o `indexed`) amb el `gurb-code` incrustat a la URL.

Des d'aquí la persona surt temporalment de Gurb, però no perd el context perquè després la contractació el reutilitza.

## Checklist

- [ ] Has comprovat si el teu canvi afecta el camí amb `new_contract` o sense.
- [ ] Si el canvi toca la sortida a contractació, has revisat la construcció de `redirectUrl` i el manteniment de `gurbCode`.
- [ ] Si canvies navegació, has revisat `maxStepNum` i `completed`.
- [ ] Si canvies elegibilitat, has revisat els bloquejos del botó següent.
