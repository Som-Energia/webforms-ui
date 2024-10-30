# WebForms UI

[![CI](https://github.com/Som-Energia/webforms-ui/actions/workflows/main.yml/badge.svg)](https://github.com/Som-Energia/webforms-ui/actions/workflows/main.yml)
[![cypress webforms-ui](https://github.com/Som-Energia/webforms-ui/actions/workflows/cypress.yml/badge.svg)](https://github.com/Som-Energia/webforms-ui/actions/workflows/cypress.yml)


### Som Energia WebForms UI

## Installation 🔧

1. Install NPM packages

```sh
  npm install
```

## Run the app 🚀

Run the app on dev mode

```sh
  npm start
```

## Testing ⚙️

Launches the Jest test runner in the interactive watch mode.

```sh
npm test
```

Launches the Cypress test runner. Cypress requires you to run `npm start` in parallel.

```sh
npm run cypress
```

To get `holderChangePersonaldata.js`:

```sh
cd cypress/fixtures/
ln -s ../../../testdata/b2bs/holderChangePersonaldata.json .
```

We should have testdata repo!
