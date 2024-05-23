import React from 'react'

import { useTranslation } from 'react-i18next'

import Box from '@mui/material/Box'
import LabelFieldRow from '../../components/oficinavirtual/LabelFieldRow'

const IndexedContractDetails = (props) => {
  const { t } = useTranslation()
  console.log("PROPS",props)
  const { contract, currentTariff, targetTariff } = props

  console.log("TARIF", targetTariff)
  return (
    <Box sx={{ width: '100%', mb: '0.5rem' }}>
      <LabelFieldRow label={t('CONTRACT')}>
        <p>{contract}</p>
      </LabelFieldRow>
      <LabelFieldRow label={t('CURRENT_TARIFF')}>{currentTariff}</LabelFieldRow>
      <LabelFieldRow isHighlight={true} label={t('TARIFF_TO_CONTRACT')}>
        {targetTariff || t('TARIFF_CHANGE_NOT_AVAILABLE')}
      </LabelFieldRow>
    </Box>
  )
}

export default IndexedContractDetails
