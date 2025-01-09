import { defineConfig } from 'cypress'

export default defineConfig({
  projectId: '6y5vbm',
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1200,
    viewportHeight: 960,
    supportFile: false, // Disable support file if not needed
    specPattern: './cypress/integration/**/*.spec.js', // Pattern to match all spec files
    supportFile: './cypress/support/index.js',
    experimentalRunAllSpecs: true
  },
  video: false,
  env: {
    disableGpu: true, // Custom environment variable to disable GPU
    FEATURE_FLAGS: {
      isCadastralReference: true,
      is30ContractEnabled: true,
      isIndexedContractEnabled: true,
      isGurbEnabled: false,
      isMemberMandatoryForHolderchange: false
    }
  },
  chromeWebSecurity: false // Disable web security for Chrome to handle cross-origin if necessary
})
