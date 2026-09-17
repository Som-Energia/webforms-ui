# WebForms UI

[![CI](https://github.com/Som-Energia/webforms-ui/actions/workflows/main.yml/badge.svg)](https://github.com/Som-Energia/webforms-ui/actions/workflows/main.yml)
[![cypress webforms-ui](https://github.com/Som-Energia/webforms-ui/actions/workflows/cypress.yml/badge.svg)](https://github.com/Som-Energia/webforms-ui/actions/workflows/cypress.yml)

### Som Energia WebForms UI

## Installation 🔧

This project requires Node 24 LTS and npm 11.

1. Install NPM packages

```sh
  npm install
```

## Run the app 🚀

Run the app on dev mode

```sh
  npm run dev
```

## Preview 👀

To reproduce the Railway preview locally, use the project `.env` file.

The preview server exposes the built app, so you must build the project before starting the preview.

If you do not have it yet, create it from the example file:

```sh
cp .env.example .env
```

Build the app:

```sh
npm run build
```

Then start the app in preview mode with the same local port used for Railway testing:

```sh
PORT=3000 npm run start
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

## Translations 🌐

The project uses `i18next-cli` for translation key extraction.

Extract the translation keys detected in the source code:

```sh
npm run i18n-extract
```

Validate translations and compare extracted keys against the locale files:

```sh
npm run i18n-lint
```

### How the extraction flow works

- `npm run i18n-extract` scans `src/**/*.{js,jsx}` for translation keys and generates `src/i18n/locale-xx.json`.
- `locale-xx.json` is not a real locale, it is a technical file used to represent the keys currently detected in the source code.
- `npm run i18n-lint` runs the extraction first. If `src/i18n/locale-xx.json` does not exist, it creates it. If it already exists, it overwrites it.
- After extraction, `npm run i18n-lint` compares `locale-xx.json` with `src/i18n/locale-es.json` and checks the rest of the locale files for missing translations and common i18n issues.
- `src/i18n/locale-xx.json` is not removed automatically by the lint script.

### Reading the comparison output

- `<< KEY` means the key exists in `src/i18n/locale-es.json` but was not detected in the extracted source snapshot.
- `>> KEY` means the key was detected in the extracted source snapshot but is missing from `src/i18n/locale-es.json`.

### Important limitation

Dynamic translation calls are harder to extract reliably. Calls such as `t(variable)`, `t(error.code)`, or `t(prefix + "_TITLE")` may cause false positives in the i18n lint output.

To get `holderChangePersonaldata.js`:

```sh
cd cypress/fixtures/
ln -s ../../../testdata/b2bs/holderChangePersonaldata.json .
```

To get `.env.development`:

```sh
ln -s $myit-docs_dir/deployment-configurations/webforms-ui/.env.development
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
scripts/deploy.sh ovprod
```

This command uses deploy-ovprod.conf. It is now defined with the production OV configuration.

### Local

For the first time you should create the folder builds at the root of the projects.

If you want to deploy local:

```
scripts/deploy-local.sh
```

This command uses deploy-ovlocal.conf. It is now defined with the local OV configuration.

Thing to keep in mind:

- Follow the setup to create the necessary directories
- This script must be run from its directory
