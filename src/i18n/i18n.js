import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import LOCALE_CA from './locale-ca.json'
import LOCALE_ES from './locale-es.json'
import LOCALE_GL from './locale-gl.json'
import LOCALE_EU from './locale-eu.json'

import SOMSOLET_CA from './SomSolet/locale-ca.json'
import SOMSOLET_ES from './SomSolet/locale-es.json'
import SOMSOLET_GL from './SomSolet/locale-gl.json'
import SOMSOLET_EU from './SomSolet/locale-eu.json'

const resources = {
  ca: {
    translation: { ...LOCALE_CA, ...SOMSOLET_CA }
  },
  es: {
    translation: { ...LOCALE_ES, ...SOMSOLET_ES }
  },
  gl: {
    translation: { ...LOCALE_GL, ...SOMSOLET_GL }
  },
  eu: {
    translation: { ...LOCALE_EU, ...SOMSOLET_EU }
  }
}

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

export default i18n
