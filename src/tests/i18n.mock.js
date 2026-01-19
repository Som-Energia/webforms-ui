
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

export const initI18n = async (translationsNS = {}, debug = false) => {
  // Initialize i18n for the test
  return i18n.use(initReactI18next).init({
    lng: 'en',
    defaultNS: 'translationsNS',
    resources: {
      en: {
        translationsNS
      }
    },
    debug
  })
}