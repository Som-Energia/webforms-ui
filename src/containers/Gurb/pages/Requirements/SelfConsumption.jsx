import { useContext } from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import SolarPowerOutlinedIcon from '@mui/icons-material/SolarPowerOutlined'

import TextRecomendation from '../../components/TextRecomendation'
import Chooser from '../../../../components/NewChooser'
import SimpleGurbDialog from '../../../../components/SimpleGurbDialog'

import { iconRequirements } from '../../../../themes/commonStyles'
import { iconOffRequirements } from '../../gurbTheme'

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
        <SimpleGurbDialog
          severity={'warning'}
          text1={
            <Typography
              sx={{
                fontSize: 14,
              }}
              dangerouslySetInnerHTML={{
                __html: t('GURB_SELFCONSUMPTION_ERROR_MAIN_TEXT'),
              }}
            />
          }
          text2={
            <Typography
              sx={{
                fontSize: 14,
                'a':
                  {
                    color:'black',
                    fontWeight: 'bold',
                    textDecoration: 'underline'
                  }
              }}
              dangerouslySetInnerHTML={{
                __html: t('GURB_SELFCONSUMPTION_ERROR_SECONDARY_TEXT'),
              }}
            />
          }
          closeFunction={() => setContent(undefined)}
        />
      )
    }
  }
  const options = [
    {
      id: 'selfconsumption-on',
      icon: <SolarPowerOutlinedIcon sx={iconRequirements} />,
      textHeader: t('GURB_SELFCONSUMPTION_YES_HEADER'),
    },
    {
      id: 'selfconsumption-off',
      icon: <SolarPowerOutlinedIcon sx={iconOffRequirements} />,
      textHeader: t('GURB_SELFCONSUMPTION_NO_HEADER'),
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
