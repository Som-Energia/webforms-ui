# Testing

## Eines

- Unitari/component: `Vitest` + `@testing-library/react`
- E2E/smoke: `Cypress`

## Configuracio real

- `vite.config.mjs`: test env per defecte de Vitest, `setupFiles` a `src/tests/setupTests.js` i cobertura configurada al mateix fitxer.
- `src/tests/setupTests.js`: carrega `@testing-library/jest-dom`.
- `src/tests/i18n.mock.js`: helper senzill per inicialitzar `i18n` als tests.
- `cypress/support/index.js`: carrega commands propis per flux.

## Quan usar cada tipus

| Cas                                   | Prova recomanada                                     |
| ------------------------------------- | ---------------------------------------------------- |
| Component o validacio local           | `Vitest`                                             |
| Ruta, integracio de formulari o smoke | `Cypress`                                            |
| Text amb traduccio                    | test unitari amb `i18n.mock` o smoke si afecta rutes |

## Senyals del repo

- Hi ha tests de components petits a `src/components/**/*.test.jsx`.
- Hi ha tests de context i dashboards a `src/containers/**/**/*.test.jsx`.
- Hi ha smoke tests de presència de formularis i URLs a `cypress/smoke/forms.spec.js`.
- No assumeixis que tota la cobertura segueix el mateix patró: hi ha zones antigues i heterogenies.

## Regla de treball per l'agent

1. Busca primer el test mes proper al codi que canvies.
2. Si el canvi es local, afegeix o ajusta un test de `Vitest`.
3. Si el canvi afecta un flux complet, una ruta o navegacio multi-step, revisa si cal `Cypress`.
4. Prefereix demostrar comportament observable abans que detalls interns d'implementacio.
5. Si el component depen de `i18n`, `context`, `theme` o props obligatories, munta el setup minim equivalent al real.
6. No facis mocks d'altres components del repo o de UI real si no es demana explicitament: mantingues els components reals muntats i mockeja nomes APIs, serveis o altres bordes externs estrets.
7. Sempre que sigui possible, intenta deixar el coverage del fitxer o component tocat al `100%`.

## Estructura minima d'un test

1. Preparar dades d'entrada.
2. Renderitzar el component.
3. Executar l'accio.
4. Verificar el resultat observable.

Regla practica: intenta que cada test validi un sol comportament important.

## Estructura habitual del fitxer

- Imports de component, helpers i Testing Library.
- Mocks de moduls externs abans del `describe`.
- `describe` per agrupar contextos.
- `it` o `test` per descriure el comportament esperat.
- `beforeEach` i `afterEach` nomes si realment ajuden a aillar estat o reduir duplicacio.

## Convencio de noms

- Usa `*.test.js` o `*.test.jsx` per unitaris, components i integracio dins de `src/`.
- Reserva `*.spec.js` per Cypress o proves de tipus E2E/smoke.
- Mantingues aquesta separacio encara que l'eina pugui acceptar els dos sufixos.

## Render del component

### Render simple

Comenca pel cas minim:

```js
render(<Component />)
```

### Quan cal setup extra

Els casos mes habituals son:

- props obligatories,
- providers de context,
- `i18n`,
- `theme` o wrappers compartits.

Exemple amb props:

```js
render(<Component identificadors={mockIdentificadors} />)
```

Exemple amb provider:

```js
render(
  <GenerationContextProvider assignmentsJSON={mockAssignmentRows}>
    <GenerationDashboard validationConfirm={mockValidationConfirm} />
  </GenerationContextProvider>,
)
```

Exemple de mock d'i18n:

```js
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}))
```

## Mocks

Quan cal comprovar crides, usa `vi.fn()` o `vi.mocked(...)`.

Prioritat del repo:

- Mockeja APIs, serveis i dependències externes amb IO o side effects.
- No mockegis components reals del repo o de la UI per simplificar el test, excepte si l'usuari ho demana explicitament.

```js
const mockFunc = vi.fn()
```

Validacions habituals:

```js
expect(mockFunc).toHaveBeenCalled()
expect(mockFunc).toHaveBeenCalledTimes(1)
expect(mockFunc).toHaveBeenCalledWith("actionTest")
```

No prioritzis mocks si pots provar el mateix comportament via DOM o interaccio.

## Queries de Testing Library

Prioritat recomanada:

1. `getByRole`
2. `getByLabelText`
3. `getByText`
4. selectors mes fragils nomes com a ultim recurs

### `getBy*`

Usa `getBy*` quan l'element ha d'existir en el render actual.

```js
const button = screen.getByRole("button", { name: /submit/i })
expect(button).toBeInTheDocument()
```

### `queryBy*`

Usa `queryBy*` per comprovar que un element no existeix.

```js
expect(screen.queryByRole("alert")).not.toBeInTheDocument()
```

### `findBy*`

Usa `findBy*` quan l'element apareix de forma asincrona.

```js
const firstUser = await screen.findByText("Anna Garcia")
expect(firstUser).toBeInTheDocument()
```

## Regla rapida de queries

| Situacio                                         | Query recomanada           |
| ------------------------------------------------ | -------------------------- |
| Element present al render inicial                | `getBy*`                   |
| Element que no ha d'existir                      | `queryBy*`                 |
| Element que apareix despres d'una operacio async | `findBy*`                  |
| Multiples elements                               | `getAllBy*` o `findAllBy*` |

## Asincronia

### `waitFor`

Usa `waitFor` quan el canvi no es immediat i s'ha de reintentar una comprovacio.

```js
await waitFor(() => {
  expect(screen.getByText("Loaded")).toBeInTheDocument()
})
```

### `act`

No l'introdueixis per defecte. Pensa-hi nomes si forces updates de React manualment o tens un cas on Testing Library no cobreix l'update per si sola.

Regla practica:

- si esperes un element async, prefereix `findBy*`,
- si esperes una condicio mes composta, usa `waitFor`,
- evita afegir `act` manual sense necessitat clara.

## Hooks

### `beforeAll`

Per setup compartit i costós, com inicialitzar `i18n`.

```js
beforeAll(async () => {
  await initI18n()
})
```

### `beforeEach`

Per preparar un entorn net a cada test.

```js
beforeEach(() => {
  vi.mocked(checkCups).mockResolvedValue({})
})
```

### `afterEach`

Per netejar mocks i evitar contaminacio entre casos.

```js
afterEach(() => {
  vi.clearAllMocks()
})
```

### `afterAll`

Per restaurar mocks o tancar recursos compartits.

```js
afterAll(() => {
  vi.restoreAllMocks()
})
```

## Bones practiques

- Ailla cada test.
- Neteja mocks despres de cada cas si comparteixes setup.
- No comparteixis estat mutable entre tests.
- Usa `beforeAll` nomes per setup realment costós.
- Prefereix queries accessibles abans que selectors fragils.
- No reescriguis un test sencer si un canvi petit cobreix el cas.
- Si el codi es legacy o irregular, copia el minim patró existent i millora nomes el necessari.

## Verificacio pragmatica

1. Prova unitària propera si el canvi es local.
2. Spec Cypress rellevant si el canvi toca un flux sencer.
3. No assumeixis cobertura existent: hi ha zones antigues i heterogenies.
4. Si estas ampliant o afegint tests, comprova si pots tancar el fitxer tocat a `100%` de statements, branches, functions i lines sense inflar el spec artificialment.
