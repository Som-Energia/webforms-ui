import { useContext } from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@mui/material/Grid'

import Chooser from '../../components/NewChooser'
import { HelperText } from '../../components/InputField'
import Typography from '@mui/material/Typography'

import SolarPowerOutlinedIcon from '@mui/icons-material/SolarPowerOutlined'

import { iconRequirements } from '../../themes/commonStyles'
import { iconOffRequirements } from '../Gurb/gurbTheme'

import GurbErrorContext from '../../context/GurbErrorContext'

const NewContractMemberSelfConsumption = (props) => {
  const { values, setFieldValue } = props
  const { t } = useTranslation()
  const { setError, setErrorInfo } = useContext(GurbErrorContext)

  const handleSelfconsumptionQuestion = (value) => {
    setFieldValue('has_selfconsumption', value)
  }
    
  const options = [
    {
      id: 'selfconsumption-on',
      icon: <SolarPowerOutlinedIcon sx={iconRequirements} />,
      textHeader: t('GURB_SELFCONSUMPTION_YES_HEADER'),
      textBody: t('GURB_SELFCONSUMPTION_YES_BODY')
    },
    {
      id: 'selfconsumption-off',
      icon: <SolarPowerOutlinedIcon sx={iconOffRequirements} />,
      textHeader: t('GURB_SELFCONSUMPTION_NO_HEADER'),
      textBody: t('GURB_SELFCONSUMPTION_NO_BODY')
    }
  ]

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
          <Typography variant="headline3">{t('SELFCONSUMPTION_TITLE')}</Typography>
      </Grid>
      <Grid item xs={12}>
          <Typography variant="subtitle2">{t('SUPPLY_POINT_DATA_SUBTITLE')}</Typography>        
      </Grid>
      <Grid item xs={12}>
          <Typography variant="subtitle4">{t('POTENCIA_A_CONTRACTAR')}</Typography>        
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

export default NewContractMemberSelfConsumption
