import React from 'react'
import { useTranslation } from 'react-i18next'

import BoltIcon from '@mui/icons-material/Bolt'
import Box from '@mui/material/Box'

import Chooser from '../../../../components/NewChooser'
import { HelperText } from '../../../../components/InputField'
import RequiredTitle from '../../../../components/InputTitle'

import { iconRequirements } from '../../../../themes/commonStyles'
import { textHeader4, textHeader5 } from '../../gurbTheme'
import Grid from '@mui/material/Grid'

const TariffMode = (props) => {
  const {
    activeStep,
    values,
    errors,
    touched,
    setFieldValue,
    setFieldError,
    setErrors,
    setFieldTouched
  } = props

  const { t } = useTranslation()

  const handleChange = async (value) => {
    setFieldValue('contract.tariff_mode', value)
  }

  const options = [
    {
      id: 'periods',
      icon: <BoltIcon sx={iconRequirements} />,
      textHeader: t('GURB_TARIFFMODE_PERIODS_HEADER'),
      textBody: t('GURB_TARIFFMODE_PERIODS_BODY')
    },
    {
      id: 'indexed',
      icon: <BoltIcon sx={iconRequirements} />,
      textHeader: t('GURB_TARIFFMODE_INDEXED_HEADER'),
      textBody: t('GURB_TARIFFMODE_INDEXED_BODY')
    }
  ]

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <RequiredTitle
          text={t('GURB_TARIFFMODE_QUESTION')}
          textStyle={textHeader4}
          required={true}
        />
      </Grid>
      <Grid item xs={12}>
        <Chooser
          name='tariffMode'
          options={options}
          value={values.contract.tariff_mode}
          handleChange={handleChange}
        />
      </Grid>
      <Grid item xs={12}>
        <HelperText
          justifyContent="center"
          helperText={'TODO: Edit HelperText with links'}
        />
      </Grid>
    </Grid>
  )
}

export default TariffMode
