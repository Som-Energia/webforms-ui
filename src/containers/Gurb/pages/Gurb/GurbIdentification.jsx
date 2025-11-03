import React from 'react'

import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'

import { useTranslation } from 'react-i18next'

import CUPS from '../../../../components/CUPS'
import NifCif from '../../../../components/NifCif'


const GurbIdentification = (props) => {
  const { t } = useTranslation()
  return (
    <Grid container spacing={2}>

      <Grid item xs={12}>
        <Typography variant="headline4.regular">
          {t('GURB_MEMBER_TITLE')}
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <CUPS {...props} />
        <NifCif {...props} entity="owner" holder={true}/>
      </Grid>

    </Grid>
  )
}

export default GurbIdentification
