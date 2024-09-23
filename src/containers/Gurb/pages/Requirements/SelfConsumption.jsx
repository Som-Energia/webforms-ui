import { useTranslation } from 'react-i18next'

import TextRecomendation from '../../components/TextRecomendation'
import Chooser from '../../components/Chooser'
import { HelperText } from '../../components/InputField'

import SolarPowerOutlinedIcon from '@mui/icons-material/SolarPowerOutlined'

import { iconRequirements, iconOffRequirements } from '../../gurbTheme'

const SelfConsumption = (props) => {
  const { values, setFieldValue } = props
  const { t } = useTranslation()

  const handleSelfconsumptionQuestion = (value) => {
    setFieldValue('has_selfconsumption', value)
  }
  const options = [
    {
      id: 'selfconsumption-on',
      icon: <SolarPowerOutlinedIcon sx={iconRequirements} />,
      textHeader: t('GURB_TINC_AUTOCONSUM'),
      textBody: t('GURB_TINC_AUTOCONSUM_BODY')
    },
    {
      id: 'selfconsumption-off',
      icon: <SolarPowerOutlinedIcon sx={iconOffRequirements} />,
      textHeader: t('GURB_NO_TINC_AUTOCONSUM'),
      textBody: t('GURB_NO_TINC_AUTOCONSUM_BODY')
    }
  ]

  return (
    <>
      <TextRecomendation title={t('GURB_AUTOCONSUM_TITLE')} />
      &nbsp;
      <Chooser
        options={options}
        value={values.has_selfconsumption}
        handleChange={handleSelfconsumptionQuestion}
      />
      &nbsp;
      <HelperText helperText={t('GURB_AUTOCONSUM_HELPER')} iconHelper={true} />
    </>
  )
}

export default SelfConsumption
