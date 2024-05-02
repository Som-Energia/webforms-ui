import React from 'react'

import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'

import LabelFieldRow from '../../components/oficinavirtual/LabelFieldRow'

const ContractDetails = (props) => {
  const { t } = useTranslation()

  const { contract_number, cups_address } = props

  return (
    <Box sx={{
      width: '100%',
      mb: '0.5rem'
    }}>
      <LabelFieldRow label={t('CONTRACT')}>
        <p>{contract_number}</p>
      </LabelFieldRow>
      <LabelFieldRow label={t('ADDRESS')}>
        <p>{cups_address}</p>
      </LabelFieldRow>
    </Box>
  )
}

export default ContractDetails