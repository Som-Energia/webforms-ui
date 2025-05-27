import { useTranslation } from 'react-i18next'

import { HelperText } from './InputField'
import Chooser from './NewChooser'
import PowerInputs from './NewPowerInputs'

import BoltIcon from '@mui/icons-material/Bolt'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'

import { iconRequirements } from '../themes/commonStyles'

import { useTheme } from '@mui/material/styles'

const Powers = (props) => {
  const { values, errors, touched, setFieldValue } = props

  const { t } = useTranslation()
  const theme = useTheme()

  const handlePowerQuestion = async (value) => {
    await setFieldValue('contract.power_type', value)
    setFieldValue('contract.power', {})
  }

  const options = [
    {
      id: 'power-lower-15kw',
      icon: <BoltIcon sx={iconRequirements} />,
      textHeader: t('POWER_LOWER_15_HEADER')
    },
    {
      id: 'power-higher-15kw',
      icon: <BoltIcon sx={iconRequirements} />,
      textHeader: t('POWER_HIGHER_15_HEADER')
    }
  ]

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography
          sx={{ typography: 'body.sm.regular', color: 'secondary.dark' }}>
          {t('POWER_HELPER')}
        </Typography>
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
              <HelperText
                helperText={
                  <a
                    href={t('POWER_LOWER_15_HELPER_URL')}
                    target="_blank"
                    style={{
                      color: theme.palette.secondary.dark,
                      textDecoration: 'underline'
                    }}
                    rel="noopener noreferrer">
                    {t('POWER_LOWER_15_HELPER')}
                  </a>
                }
                iconHelper={true}
              />
            </Grid>
            <Grid item>
              <PowerInputs
                name="contract.power"
                numInputs={2}
                {...props}
                values={values?.contract?.power}
                errors={errors?.contract?.power}
                touched={touched?.contract}
              />
            </Grid>
          </Grid>
        </Grid>
      ) : null}
      {values.contract.power_type === 'power-higher-15kw' ? (
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item>
              <HelperText
                helperText={
                  <a
                    href={t('POWER_HIGHER_15_HELPER_URL')}
                    target="_blank"
                    style={{ color: 'secondary.dark', textDecoration: 'underline' }}
                    rel="noopener noreferrer">
                    {t('POWER_HIGHER_15_HELPER')}
                  </a>
                }
                iconHelper={true}
              />
            </Grid>
            <Grid item>
              <PowerInputs
                name="contract.power"
                numInputs={6}
                {...props}
                values={values?.contract?.power}
                errors={errors?.contract?.power}
                touched={touched?.contract}
              />
            </Grid>
          </Grid>
        </Grid>
      ) : null}
    </Grid>
  )
}
export default Powers
