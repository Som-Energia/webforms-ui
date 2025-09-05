import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Typography from '@mui/material/Typography'
import { textHeader2 } from '../../gurbTheme'
import Box from '@mui/material/Box'

const GurbIdentificationCups = (props) => {

  const { values, setFieldValue } = props
  const { t } = useTranslation()


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Typography sx={{ ...textHeader2, mb: 5 }}>{t('GURB_IDENTIFICATION')}</Typography>

      TODO Identification Cups
    </Box>
  )
}

export default GurbIdentificationCups
