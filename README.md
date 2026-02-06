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

Launches the Cypress smoke tests:
```sh
npm run cypress:smoke
```

To get `holderChangePersonaldata.js`:

```sh
cd cypress/fixtures/
ln -s ../../../testdata/b2bs/holderChangePersonaldata.json .
```

To get  `.env.development`:
```sh
ln -s $myit-docs_dir/it-docs/conf/webforms-ui/.env.development
```
We should have testdata repo!


## Deployment

To deploy we have to use deploy.sh
```
scripts/deploy.sh [env]
```

### Testing

If you want to deploy to the web:
```
scripts/deploy.sh pre
```
This command uses deploy-pre.conf. It is now defined with the test web configuration.


If you want to deploy to the OV:
```
scripts/deploy.sh ovtest [vassal number]
```
This command uses deploy-ovtest.conf. It is now defined with the test OV configuration.

### Production

If you want to deploy to the web:
```
scripts/deploy.sh production
```
This command uses deploy-production.conf. It is now defined with the production web configuration.


If you want to deploy to the OV:
```
TODO
```
