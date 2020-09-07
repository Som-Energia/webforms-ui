import React from 'react'
import { useTranslation } from 'react-i18next'

import GeneralTermsCa from '../data/HolderChange/GeneraTermsCa'
import GeneralTermsEs from '../data/HolderChange/GeneraTermsEs'
import GeneralTermsGl from '../data/HolderChange/GeneraTermsGl'
import GeneralTermsEu from '../data/HolderChange/GeneraTermsEu'

const renderText = (language) => {
  switch (language) {
    case 'ca':
      return GeneralTermsCa
    case 'eu':
      return GeneralTermsEu
    case 'gl':
      return GeneralTermsGl
    default:
      return GeneralTermsEs
  }
}

const GeneralTerms = () => {
  const { i18n } = useTranslation()
  return (
    <span dangerouslySetInnerHTML={{ __html: renderText(i18n.language) }} />
  )
}

export default GeneralTerms
