import React from 'react'

import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import { useTranslation } from 'react-i18next'

import CUPS from '../../../../components/Cups/CUPS'
import NifCif from '../../../../components/NifCif/NifCif'


const GurbIdentification = (props) => {
  const { t } = useTranslation()
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="headline4.regular">
          {t('IDENTIFY_MEMBER')}
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <CUPS {...props} />
      </Grid>

      <Grid item xs={12}>
        <NifCif
          {...props}
          textFieldNameKey="GURB_PARTICIPATION_NIF_TITLE"
          helperText={false}
          entity="owner"
          holder
        />
      </Grid>
    </Grid>
  )
}

export default GurbIdentification
