# Formularis I Validacio

## Model general

Molts fluxos usen `Formik` al container arrel i renderitzen un pas diferent segons `activeStep`, però NO tots segueixen exactament la mateixa recepta.

## Estructura habitual

1. `initialValues` grossos al container.
2. `validationSchemas` com a array ordenat per pas.
3. Component de pas a `pages/*`.
4. Navegacio amb `PrevButton`, `NextButton`, `SubmitButton` i `SomStepper`.

## Variants reals al repo

- `NewMember` i `NewContractMember`: patró bastant net de `pages/*` + array de schemas.
- `Gurb`: patró semblant, però separat en dos subfluxos.
- `HolderChange`, `Contribution`, `Generation`, `Indexed`: molta lògica i `Yup` embeguda directament al container.
- Alguns fluxos tenen `SomStepper`; d'altres no, o usen botons/components antics.

## Lectura Recomanada Si Es Un Formulari Nou

Si el flux és `Gurb`, `NewContractMember` o `NewMember`, llegeix també `07-formularis-nous.md` abans de reutilitzar patrons d'altres zones del repo.

## Exemple real

- `src/containers/NewMember/NewMember.jsx`: flux curt i lineal de 4 passos.
- `src/containers/NewContractMember/NewContractMember.jsx`: flux molt mes gran, amb branques segons tipus de membre, resum, query params i integracions externes.

## On es trenquen mes facilment

- Desalineacio entre `activeStep`, `steps.js` i `validationSchemas`.
- Canvis a `initialValues` sense actualitzar validacions o normalitzacio.
- Textos o valors inicials dependents de `i18n.language`.
- Branques condicionals segons query params com `gurb-code`, `mtm_*` o flags injectats.
- Fluxos amb salts de pas per dades de negoci (`is_member`, `has_light`, `has_selfconsumption`, `skipStep`, `summaryField`).
- Submits en dues fases: primer crear/validar entitat, després enviar l'operació principal.

## Regla d'edicio

Si canvies un camp, revisa sempre aquestes quatre peces:

1. `initialValues`
2. schema `Yup`
3. pagina/component que l'edita
4. normalitzacio o `POST` final

I abans d'assumir el patró, comprova dues coses més:

5. si el pas es pot saltar condicionalment
6. si el submit real depèn d'una fase extra (`endpoint`, TPV, signatura, creació de membre, etc.)

## Fitxers clau

- `src/services/steps.js`
- `src/containers/NewMember/*`
- `src/containers/NewContractMember/*`
- `src/containers/Gurb/*`
- `src/containers/HolderChange.jsx`
- `src/containers/Contribution.jsx`
- `src/containers/Generation/GenerationForm/GenerationForm.jsx`
- `src/containers/Indexed.jsx`
