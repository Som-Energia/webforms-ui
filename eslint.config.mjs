import baseConfig from "@somenergia/frontend-config/eslint"
import cypress from "eslint-plugin-cypress/flat"

export default [
  ...baseConfig,
  { ignores: ["**/assets/"] },
  {
    files: ["cypress/**/*.{js,jsx}"],
    ...cypress.configs.recommended,
    rules: {
      // FIXME: enable this disabled rule and fix cypress tests
      // It is unsafe to chain further commands that rely on the subject after this command.
      // It is best to split the chain, chaining again from cy. in a next command line. (eslint cypress/unsafe-to-chain-command)\
      // https://docs.cypress.io/api/commands/click
      "cypress/unsafe-to-chain-command": "off",
    },
  },
]
