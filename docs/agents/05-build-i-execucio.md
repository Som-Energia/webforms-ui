# Build I Execucio

## Scripts que importen

- `npm start`: arrenca Vite i injecta `VITE_APP_VERSION` des de `git describe --tags`.
- `npm test`: executa `vitest`.
- `npm run test:coverage`: cobertura.
- `npm run lint`: `eslint` sobre `js` i `jsx`.
- `npm run cypress`: obre Cypress.
- `npm run cypress:smoke`: smoke contra config de produccio.
- `npm run build`: build Vite cap a `forms/`.

## Entorn

- Node requerit: `>=20.18.1 <21.0.0`
- npm requerit: `>=10 <11`

## Peculiaritats del repo

- El build escriu a `forms/`, no a `dist/`.
- `vite.config.mjs` carrega `BASE_URL` segons `mode`.
- Hi ha modes extra com `ov`, `prod`, `pre` i `vercel`.
- El plugin d'`eslint` a Vite esta desactivat expressament; no comptis amb lint en calent.

## Criteri practic

- Si el canvi es de codi pur, comenca per `npm test`.
- Si has tocat imports, rutes o build-time env, afegeix `npm run build`.
- Si has tocat UX d'un formulari principal, considera Cypress a mes del test unitari.
