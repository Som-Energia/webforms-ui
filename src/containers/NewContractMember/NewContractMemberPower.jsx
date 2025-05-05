import { useContext } from 'react'
import { useTranslation } from 'react-i18next'

import { HelperText } from '../../components/InputField'
import Chooser from '../../components/NewChooser'
import PowerInputs from '../../components/PowerInputs'
import RequiredTitle from '../../components/InputTitle'

import BoltIcon from '@mui/icons-material/Bolt'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'

import GurbLoadingContext from '../../context/GurbLoadingContext'

import { iconRequirements } from '../../themes/commonStyles'
import { textHeader4, textHeader5 } from '../Gurb/gurbTheme'

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
  const { loading, setLoading } = useContext(GurbLoadingContext)

  const handlePowerQuestion = async (value) => {
    await setFieldValue('contract.power_type', value)
    setFieldValue('contract.power', {})
  }
  

  const options = [
    {
      id: 'power-lower-15kw',
      icon: <BoltIcon sx={iconRequirements} />,
      textHeader: t('GURB_POWER_LOWER_15_HEADER')
    },
    {
      id: 'power-higher-15kw',
      icon: <BoltIcon sx={iconRequirements} />,
      textHeader: t('GURB_POWER_HIGHER_15_HEADER')
    }
  ]

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
        <Typography sx={textHeader5}>{t('GURB_POWER_HELPER')}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Chooser
          name="power_question"
          options={options}
          value={values.contract.power_type}
          handleChange={handlePowerQuestion}
        />
      </Grid>
      {values.contract.power_type === 'power-lower-15kw' ? (
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item>
              <PowerInputs
                name="contract.power"
                numInputs={2}
                {...props}
                values={values?.contract.power}
                errors={errors?.contract}
                touched={touched?.contract}
              />
            </Grid>
            <Grid item>
              <HelperText
                helperText={t('GURB_POWER_LOWER_15_HELPER')}
                iconHelper={true}
              />
            </Grid>
          </Grid>
        </Grid>
      ) : null}
      {values.contract.power_type === 'power-higher-15kw' ? (
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item>
              <PowerInputs
                name="contract.power"
                numInputs={6}
                {...props}
                values={values?.contract.power}
                errors={errors?.contract}
                touched={touched?.contract}
              />
            </Grid>
            <Grid item>
              <HelperText
                helperText={t('GURB_POWER_HIGHER_15_HELPER')}
                iconHelper={true}
              />
            </Grid>
          </Grid>
        </Grid>
      ) : null}
    </Grid>
  )
}
export default Power
