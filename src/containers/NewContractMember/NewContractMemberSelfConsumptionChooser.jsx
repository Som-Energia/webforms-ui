import { useTranslation } from 'react-i18next'

import Grid from '@mui/material/Grid'

import Chooser from '../../components/NewChooser'
import Typography from '@mui/material/Typography'
import InputTitle from '../../components/InputTitle'

import SolarPowerOutlinedIcon from '@mui/icons-material/SolarPowerOutlined'

import { iconRequirements } from '../../themes/commonStyles'
import { iconOffRequirements } from '../Gurb/gurbTheme'

const NewContractMemberSelfConsumptionChooser = (props) => {
  const { values, setFieldValue } = props
  const { t } = useTranslation()

  const handleSelfconsumptionQuestion = (value) => {
    setFieldValue('has_selfconsumption', value)
  }

  const options = [
    {
      id: 'selfconsumption-on',
      icon: <SolarPowerOutlinedIcon sx={iconRequirements} />,
      textHeader: t('SELFCONSUMPTION_YES_HEADER'),
      textBody: t('SELFCONSUMPTION_YES_BODY')
    },
    {
      id: 'selfconsumption-off',
      icon: <SolarPowerOutlinedIcon sx={iconOffRequirements} />,
      textHeader: t('SELFCONSUMPTION_NO_HEADER'),
      textBody: t('SELFCONSUMPTION_NO_BODY')
    }
  ]

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Grid item xs={12}>
          <Typography variant="headline3">
            {t('SELFCONSUMPTION_TITLE')}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body.md.regular" color="secondary.dark">
            {t('RECOMMENDATION_SUBTITLE')}
          </Typography>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Grid item xs={12} sx={{ mt: 2 }}>
          <InputTitle
            variant="subtitle4"
            text={t('SELFCONSUMPTION_ACTIVE')}
            required={true}
          />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body.md.regular" color="secondary.dark">
          {t('SELFCONSUMPTION_HELPER')}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Chooser
          name="selfconsumption-question"
          options={options}
          value={values.has_selfconsumption}
          handleChange={handleSelfconsumptionQuestion}
        />
      </Grid>
      {values.has_selfconsumption === 'selfconsumption-on' && (
        <Grid item xs={12}>
          <Typography variant="body.md.regular" color="secondary.dark">
            {t('SELFCONSUMPTION_WARNING')}
          </Typography>
        </Grid>
      )}
    </Grid>
  )
}

export default NewContractMemberSelfConsumptionChooser
