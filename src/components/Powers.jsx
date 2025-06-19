import { useTranslation } from 'react-i18next'

import { HelperText } from './InputField'
import Chooser from './NewChooser'
import PowerInputs from './NewPowerInputs'

import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import { PowerIcon } from '../data/icons/Icons'

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
      icon: <PowerIcon/>,
      textHeader: t('POWER_LOWER_15_HEADER')
    },
    {
      id: 'power-higher-15kw',
      icon:<PowerIcon/>,
      textHeader: t('POWER_HIGHER_15_HEADER')
    }
  ]

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
      <Typography variant="body.md.medium">{t('POWER_TO_CONTRACT')}  <span style={{ color: theme.palette.primary2.main, marginLeft: 4 }}>*</span></Typography>
        <Typography
          sx={{ typography: 'body.md.regular', color: 'secondary.dark' }}>
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
