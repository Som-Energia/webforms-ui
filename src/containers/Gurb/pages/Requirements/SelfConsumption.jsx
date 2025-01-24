import { useContext } from 'react'
import { useTranslation } from 'react-i18next'

import TextRecomendation from '../../components/TextRecomendation'
import Chooser from '../../components/Chooser'
import { HelperText } from '../../components/InputField'

import SolarPowerOutlinedIcon from '@mui/icons-material/SolarPowerOutlined'

import { iconRequirements, iconOffRequirements } from '../../gurbTheme'

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
    <>
      <TextRecomendation
        title={t('GURB_SELFCONSUMPTION_TITLE')}
        required={true}
      />
      <Chooser
        options={options}
        value={values.has_selfconsumption}
        handleChange={handleSelfconsumptionQuestion}
      />
      <HelperText
        helperText={t('GURB_SELFCONSUMPTION_HELPER')}
        iconHelper={true}
      />
    </>
  )
}

export default SelfConsumption
