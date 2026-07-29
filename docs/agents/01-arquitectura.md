# Arquitectura

## Stack real

- `React 18`
- `Vite`
- `react-router-dom@6`
- `Formik` + `Yup`
- `MUI`
- `i18next`
- `Vitest` + `Testing Library`
- `Cypress`

## Punt d'entrada

- `src/main.jsx`: llegeix `data-*` del DOM, injecta `VITE_FEATURE_FLAGS` com props i munta `App` sobre múltiples nodes `#root` si existeixen.
- `src/App.jsx`: concentra el mapa de rutes, `lazy()` imports, contexts globals, dades JSON injectades al DOM i el tema visual per ruta.

## Organitzacio funcional

- `src/containers/*`: fluxos de pagina o formularis complets.
- `src/components/*`: peces reutilitzables de UI.
- `src/context/*`: estat transversal limitat a necessitats concretes.
- `src/services/*`: API, passos, normalitzacio i utilitats de negoci.
- `src/hooks/*`: sincronitzacions o comportament compartit.

## Patrons importants

- Les rutes sovint existeixen en variants amb i sense `:language`.
- `App.jsx` aplica temes diferents segons el flux: `webforms_old` i `webforms`.
- `App.jsx` també encapsula alguns fluxos amb combinacions diferents de providers (`LoadingContextProvider`, `SummaryContextProvider`, `PopUpContextProvider`, `GenerationContextProvider`).
- Diversos fluxos depenen de dades injectades des del backend via `data-*` al `root`.
- No tot entra per props simples: Generation i altres zones també llegeixen JSON des de nodes DOM específics.
- Els formularis principals no estan centralitzats en un engine generic; cada container governa els seus passos.

## Formularis Nous Vs Antics

- Hi ha una separació pragmàtica entre fluxos més antics (`webforms_old`, `OldComponents`, patrons més heterogenis) i formularis nous més alineats amb l'equip (`webFormsTheme`, botons nous, `SomStepper`, `useSyncLanguage`, providers de càrrega/resum).
- `Gurb` i `NewContractMember` són els exemples més clars dels formularis nous.
- `NewMember` també comparteix bona part del patró dels formularis nous, encara que sigui un flux més simple.

## No assumeixis això

- No és una SPA pura amb un únic `root`.
- No totes les rutes comparteixen el mateix tema ni els mateixos providers.
- No tota la lògica de contractació viu a `NewContractMember`; també hi ha `UnifiedContractForm` com a altre punt funcional.

## On començar segons el canvi

| Tipus de canvi | Primer lloc a mirar |
|---|---|
| Nova ruta o canvi de flux | `src/App.jsx` |
| Flags, dades injectades o bootstrapping | `src/main.jsx` |
| Pas d'un formulari | `src/containers/<Flow>/...` |
| Validacions | `src/containers/**/validations/*` |
| UI compartida | `src/components/*` |
| Crides HTTP | `src/services/api.js` |
