import React, { useEffect, useState } from 'react'

import Grid from '@mui/material/Grid'

import { useTranslation } from 'react-i18next'

import CUPS from '../../../../components/CUPS'

const GurbIdentificationCups = (props) => {

  const { values, setFieldValue } = props
  const { t } = useTranslation()


  return (
    <Grid item xs={12}>
      <CUPS {...props} />
    </Grid>
  )
}

export default GurbIdentificationCups
