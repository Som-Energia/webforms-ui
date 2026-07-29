# Testing

## Eines

- Unitari/component: `Vitest` + `@testing-library/react`
- E2E/smoke: `Cypress`

## Configuracio real

- `vite.config.mjs`: test env `jsdom`, globals activats, `setupFiles` a `src/tests/setupTests.js`.
- `src/tests/i18n.mock.js`: helper senzill per inicialitzar `i18n` als tests.
- `cypress/support/index.js`: carrega commands propis per flux.

## Quan usar cada tipus

| Cas | Prova recomanada |
|---|---|
| Component o validacio local | `Vitest` |
| Ruta, integracio de formulari o smoke | `Cypress` |
| Text amb traduccio | test unitari amb `i18n.mock` o smoke si afecta rutes |

## Senyals del repo

- Hi ha tests de components petits a `src/components/**/*.test.jsx`.
- Hi ha tests de context i dashboards a `src/containers/**/**/*.test.jsx`.
- Hi ha smoke tests de presència de formularis i URLs a `cypress/smoke/forms.spec.js`.

## Verificacio pragmatica

1. Prova unitària propera si el canvi es local.
2. Spec Cypress rellevant si el canvi toca un flux sencer.
3. No assumeixis cobertura existent: hi ha zones antigues i heterogenies.
