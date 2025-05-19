import { useContext } from 'react'
import { useTranslation } from 'react-i18next'

import Powers from '../../../../components/Powers'
import RequiredTitle from '../../../../components/InputTitle'

import Grid from '@mui/material/Grid'

import { textHeader4 } from '../../gurbTheme'

const Power = (props) => {
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

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <RequiredTitle
          text={t('GURB_POWER_QUESTION')}
          textStyle={textHeader4}
          required={true}
        />
      </Grid>
      <Grid item xs={12}>
        <Powers {...props}/>
      </Grid>
    </Grid>
  )
}
export default Power
