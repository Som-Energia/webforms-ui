import React from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

export default function indexedErrorText(t, code, errorData) {
  const exceptionMap = {
    NO_CHANGES: t('INDEXED_NO_CHANGES_ERROR_TXT'),
    OPEN_CASES: t('INDEXED_OPEN_CASES_ERROR_TXT'),
    STATE_CONFLICT: t('INDEXED_STATE_CONFLICT_ERROR_TXT'),
    PENDING_CONTRACT_MODIFICATION: t('PENDING_CONTRACT_MODIFICATION_ERROR_TXT'),
    CUSTOM_TARIFF: t('INDEXED_CUSTOM_TARIFF_ERROR_TXT'),
    INVALID_FIELD: t('INVALID_FIELD', {
      field_name: errorData?.[0]?.field || t('UNKNOWN_FIELD')
    }),
    UNAUTHORIZED: t('INDEXED_UNAUTHORIZED_ERROR_TXT'),
    UNEXPECTED_ERROR: t('INDEXED_UNEXPECTED_ERROR_TXT', {
      url: t('CONTACT_HELP_URL')
    })
  }
  return exceptionMap[code] ?? exceptionMap.UNEXPECTED_ERROR
}
