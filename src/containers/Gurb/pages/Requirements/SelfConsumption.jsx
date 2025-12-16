import { useContext } from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@mui/material/Grid'
import SolarPowerOutlinedIcon from '@mui/icons-material/SolarPowerOutlined'

import TextRecomendation from '../../components/TextRecomendation'
import Chooser from '../../../../components/NewChooser'
import { buildGurbDialog } from '../../components/buildGurbDialog'

import { iconRequirements } from '../../../../themes/commonStyles'
import { iconOffRequirements } from '../../../../themes/gurbTheme'

import GurbErrorContext from '../../../../context/GurbErrorContext'
import PopUpContext from '../../../../context/PopUpContext'

const SelfConsumption = (props) => {
  const { values, setFieldValue } = props
  const { t } = useTranslation()
  const { setError, setErrorInfo } = useContext(GurbErrorContext)
  const { setContent } = useContext(PopUpContext)

  const handleSelfconsumptionQuestion = (value) => {
    setFieldValue('has_selfconsumption', value)
    if (value === 'selfconsumption-on') {
      setError(true)
      setContent(
        buildGurbDialog({
          severity: 'warning',
          setContent: setContent,
          text1Key: t('GURB_SELFCONSUMPTION_ERROR_MAIN_TEXT'),
          text2Key: t('GURB_SELFCONSUMPTION_ERROR_SECONDARY_TEXT')
        })
      )
    }
  }

  const options = [
    {
      id: 'selfconsumption-on',
      icon: <SolarPowerOutlinedIcon sx={iconRequirements} />,
      textHeader: t('SELFCONSUMPTION_YES_HEADER')
    },
    {
      id: 'selfconsumption-off',
      icon: <SolarPowerOutlinedIcon sx={iconOffRequirements} />,
      textHeader: t('SELFCONSUMPTION_NO_HEADER')
    }
  ]

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextRecomendation
          title={t('GURB_SELFCONSUMPTION_TITLE')}
          text={t('GURB_SELFCONSUMPTION_HELPER')}
        />
      </Grid>
      <Grid item xs={12}>
        <Chooser
          name="selfconsumption-question"
          options={options}
          value={values.has_selfconsumption}
          handleChange={handleSelfconsumptionQuestion}
        />
      </Grid>
    </Grid>
  )
}

export default SelfConsumption
