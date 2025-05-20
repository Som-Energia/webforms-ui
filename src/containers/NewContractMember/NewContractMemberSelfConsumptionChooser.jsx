import { useTranslation } from 'react-i18next'

import Grid from '@mui/material/Grid'

import Chooser from '../../components/NewChooser'
import { HelperText } from '../../components/InputField'
import Typography from '@mui/material/Typography'

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
            <Typography variant="headline3">{t('SELFCONSUMPTION_TITLE')}</Typography>
        </Grid>
        <Grid item xs={12}>
            <Typography variant="body.sm.regular" color="secondary.dark">{t('RECOMMENDATION_SUBTITLE')}</Typography>
        </Grid>
      </Grid>
      <Grid item xs={12}>
          <Typography variant="subtitle4">{t('POWER_TO_CONTRACT')}</Typography>
      </Grid>
      <Grid item xs={12}>
          <Typography variant="subtitle2">{t('SELFCONSUMPTION_HELPER')}</Typography>        
      </Grid>
      <Grid item xs={12}>
        <Chooser
          name="selfconsumption-question"
          options={options}
          value={values.has_selfconsumption}
          handleChange={handleSelfconsumptionQuestion}
        />
      </Grid>
      <Grid item xs={12}>
        <HelperText
          helperText={t('GURB_SELFCONSUMPTION_HELPER')}
          iconHelper={true}
        />
      </Grid>
      <Grid item xs={12}>
          <Typography variant="subtitle2">{t('SELFCONSUMPTION_WARNING')}</Typography>        
      </Grid>
    </Grid>
  )
}

export default NewContractMemberSelfConsumptionChooser
