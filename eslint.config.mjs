import baseConfig from '@somenergia/frontend-config/eslint'
import cypress from 'eslint-plugin-cypress/flat'

export default [
  ...baseConfig,
  { files: ['cypress/**/*.{js,jsx}'], ...cypress.configs.recommended },
]
