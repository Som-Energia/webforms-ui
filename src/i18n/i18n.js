import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import LOCALE_CA from './locale-ca.json'
import LOCALE_ES from './locale-es.json'

const resources = {
  ca: {
    translation: LOCALE_CA
  },
  es: {
    translation: LOCALE_ES
  }
}

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'es',
    keySeparator: false, // we do not use keys in form messages.welcome
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  })

export default i18n
