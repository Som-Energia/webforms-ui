import { defineConfig } from "i18next-cli"

export default defineConfig({
  locales: ["xx"],
  extract: {
    input: ["src/**/*.{js,jsx}"],
    output: "src/i18n/locale-{{language}}.json",
    defaultNS: false,
    nsSeparator: false,
    keySeparator: false,
    sort: true,
    indentation: 4,
    removeUnusedKeys: true,
    extractFromComments: false,
  },
})
