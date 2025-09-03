import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Typography from '@mui/material/Typography'
import { textHeader2 } from '../../gurbTheme'
import Box from '@mui/material/Box'

const GurbSignature = (props) => {

  const { values, setFieldValue } = props
  const { t } = useTranslation()


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Typography sx={{ ...textHeader2, mb: 8 }}>{t('GURB_SIGNATURE')}</Typography>

      TODO Signature
    </Box>
  )
}

export default GurbSignature
