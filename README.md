# WebForms UI

[![CI](https://github.com/Som-Energia/webforms-ui/actions/workflows/main.yml/badge.svg)](https://github.com/Som-Energia/webforms-ui/actions/workflows/main.yml)
[![cypress webforms-ui](https://github.com/Som-Energia/webforms-ui/actions/workflows/cypress.yml/badge.svg)](https://github.com/Som-Energia/webforms-ui/actions/workflows/cypress.yml)


## Installation 🔧

1. Install NPM packages

```sh
npm install
```

2. Download [deployment-configurations repo](https://gitlab.somenergia.coop/IT/deployment-configurations) following this structure:

```
/whatever-you-want
 |--/webforms-ui
 |--/deployment-configurations
```

## Deploy 🚀

With `deployment-configurations` updated with remote changes, run `./scripts/deploy.sh` deployment script with environmnet (`testing`, `pre`, `production`) as a param like:

```sh
./scripts/deploy.sh pre
```

