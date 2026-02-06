import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { registerSomEnergiaI18n } from '@somenergia/somenergia-ui';

import LOCALE_CA from './locale-ca.json'
import LOCALE_ES from './locale-es.json'
import LOCALE_GL from './locale-gl.json'
import LOCALE_EU from './locale-eu.json'

const resources = {
  ca: {
    translation: { ...LOCALE_CA }
  },
  es: {
    translation: { ...LOCALE_ES }
  },
  gl: {
    translation: { ...LOCALE_GL }
  },
  eu: {
    translation: { ...LOCALE_EU }
  }
}

// FIXME: Each import of this file init the global i18next.
//        Can be convert to initI18n() and export to init only one time.
i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    fallbackLng: 'es',
    lng: 'es',
    keySeparator: false, // we do not use keys in form messages.welcome
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  })

// Register all somenergia-ui lib translations to the project i18n instance
registerSomEnergiaI18n(i18n);

export default i18n
