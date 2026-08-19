import { initReactI18next } from "react-i18next"

import i18n from "i18next"

// Use this helper when the test must render real translated text; use src/tests/__mocks__/i18n.js for faster key-only assertions.
export const initI18n = async (translationsNS = {}, debug = false) => {
  // Initialize i18n for the test
  return i18n.use(initReactI18next).init({
    lng: "en",
    defaultNS: "translationsNS",
    resources: {
      en: {
        translationsNS,
      },
    },
    debug,
  })
}
