import { useContext } from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@mui/material/Grid'

import TextRecomendation from '../../components/TextRecomendation'
import Chooser from '../../../../components/NewChooser'
import { HelperText } from '../../../../components/InputField'

import SolarPowerOutlinedIcon from '@mui/icons-material/SolarPowerOutlined'

import { iconRequirements } from '../../../../themes/commonStyles'
import { iconOffRequirements } from '../../gurbTheme'

import GurbErrorContext from '../../../../context/GurbErrorContext'

const SelfConsumption = (props) => {
  const { values, setFieldValue } = props
  const { t } = useTranslation()
  const { setError, setErrorInfo } = useContext(GurbErrorContext)

  const handleSelfconsumptionQuestion = (value) => {
    setFieldValue('has_selfconsumption', value)
    if (value === 'selfconsumption-on') {
      setError(true)
      setErrorInfo({
        main_text: t('GURB_SELFCONSUMPTION_ERROR_MAIN_TEXT'),
        seconday_text: t('GURB_SELFCONSUMPTION_ERROR_SECONDARY_TEXT'),
        link_text: t('GURB_SELFCONSUMPTION_ERROR_LINK_TEXT'),
        error_type: 'error',
        clean_field: () => {
          setFieldValue('has_selfconsumption', undefined)
        }
      })
    }
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
      <Grid item>
        <TextRecomendation
          title={t('GURB_SELFCONSUMPTION_TITLE')}
          required={true}
        />
      </Grid>
      <Grid item>
        <Chooser
          name="selfconsumption-question"
          options={options}
          value={values.has_selfconsumption}
          handleChange={handleSelfconsumptionQuestion}
        />
      </Grid>
      <Grid item>
        <HelperText
          helperText={t('GURB_SELFCONSUMPTION_HELPER')}
          iconHelper={true}
        />
      </Grid>
    </Grid>
  )
}

export default SelfConsumption
