import React from 'react'
import { useTranslation } from 'react-i18next'

import CancellationTermsCa from 'data/Cancellation/CancellationTermsCa'
import CancellationTermsEs from 'data/Cancellation/CancellationTermsEs'
import CancellationTermsGl from 'data/Cancellation/CancellationTermsGl'
import CancellationTermsEu from 'data/Cancellation/CancellationTermsEu'

const renderText = (language) => {
  switch (language) {
    case 'ca':
      return CancellationTermsCa
    case 'eu':
      return CancellationTermsEu
    case 'gl':
      return CancellationTermsGl
    default:
      return CancellationTermsEs
  }
}

const CancellationTerms = () => {
  const { i18n } = useTranslation()
  return (
    <span dangerouslySetInnerHTML={{ __html: renderText(i18n.language) }} />
  )
}

export default CancellationTerms
