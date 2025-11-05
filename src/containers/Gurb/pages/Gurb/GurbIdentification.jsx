import React from 'react'

import Grid from '@mui/material/Grid'

import { useTranslation } from 'react-i18next'

import CUPS from '../../../../components/CUPS'
import NifCif from '../../../../components/NifCif'

import TextRecomendation from '../../components/TextRecomendation'


const GurbIdentification = (props) => {
  const { t } = useTranslation()
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextRecomendation
          title={t('GURB_MEMBER_TITLE')}
        />
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
