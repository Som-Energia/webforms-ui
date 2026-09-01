# Build I Execucio

## Scripts que importen

- `npm start`: arrenca Vite i injecta `VITE_APP_VERSION` des de `git describe --tags`.
- `npm test`: executa `vitest`.
- `npm run test:coverage`: cobertura.
- `npm run lint`: `eslint` sobre `js` i `jsx`.
- `npm run format`: executa `prettier --write .` sobre tot el repo.
- `npx prettier --write <ruta-del-fitxer>`: formata nomes els fitxers editats.
- `npm run cypress`: obre Cypress.
- `npm run cypress:smoke`: smoke contra config de produccio.
- `npm run build`: executa `lint:todos`, injecta `VITE_APP_VERSION` i fa el build Vite cap a `forms/`.

## Entorn

- Node requerit: `>=20.20.2 <21.0.0`
- npm requerit: `>=10 <11`

## Peculiaritats del repo

- El build escriu a `forms/`, no a `dist/`.
- `vite.config.mjs` carrega `BASE_URL` segons `mode`.
- Hi ha modes extra com `ov`, `prod`, `pre` i `vercel`.
- El plugin d'`eslint` a Vite esta actiu i linta `src/**/*.{js,jsx}` a l'arrencada i al build.

## Criteri practic

- Si el canvi es de codi pur, comenca per `npm test`.
- Si has tocat imports, rutes o build-time env, afegeix `npm run build`.
- Si has tocat fitxers de codi, passa format abans de tancar el canvi.
- Si nomes vols tocar els fitxers editats, prefereix `npx prettier --write <ruta-del-fitxer>`.
- Si has tocat UX d'un formulari principal, considera Cypress a mes del test unitari.
