# Integracions Externes

## API webforms

- `src/services/api.js` centralitza gran part de les crides HTTP amb `axios`, pero no totes les integracions externes del projecte.
- La base URL surt de `data-webforms-api-url` al `root` o de `VITE_WEBFORMS_API_URL` en entorns de test.
- Hi ha crides amb cancelacio manual via `axios.CancelToken` per evitar races a validacions remotes.
- Hi ha altres punts d'IO rellevants, com `apiGurb`, formularis HTML cap a TPV i fluxos de signatura externa.

## Analytics

- `src/trackers/matomo/MatomoProvider.jsx` exposa `trackEvent()` via context.
- Alguns fluxos, com `NewMember` i `NewContractMember`, emeten events de pas i enviament.
- Tambe hi ha rastreig pixel en alguns formularis nous.

## Pagament i signatura

- No tot el submit extern passa per `axios`.
- Diversos fluxos creen formularis HTML ocults i fan `POST` a `endpoint` o `redsys_endpoint` retornats pel backend.
- Alguns fluxos passen per signatura externa abans del submit real (`GenerationSignaturit`, `GurbSignature`).
- Quan toquis pagament o signatura, revisa tant la UI com el mecanisme de traspas extern.

## Google Places

- Hi ha integracio amb Places API.
- A Cypress es mockeja via `cypress/support/thirdParty/googlePlaces.js`.
- Si canvies autocomplete d'adreca, revisa tant la integracio real com els intercepts de test.

## Dades injectades pel backend

- `src/main.jsx` converteix `data-*` del DOM en props d'`App`.
- Algunes funcionalitats depenen de flags injectats a `VITE_FEATURE_FLAGS`.
- A `App.jsx` tambe es llegeixen blobs JSON des de nodes DOM concrets per a Generation.
- Alguns fluxos també depenen de query params per mantenir context extern (`gurb-code`, `gurbCode`, `gurb_id`, `mtm_*`).

## Regla d'edicio

Si un canvi depen de backend o tracking, no validis nomes la UI: comprova d'on surt la dada, com es normalitza, si passa per signatura o TPV, i on s'envia finalment.
