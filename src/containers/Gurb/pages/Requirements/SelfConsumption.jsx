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
      <TextRecomendation title={t('GURB_SELFCONSUMPTION_TITLE')} />
      &nbsp;
      <Chooser
        options={options}
        value={values.has_selfconsumption}
        handleChange={handleSelfconsumptionQuestion}
      />
      &nbsp;
      <HelperText
        helperText={t('GURB_SELFCONSUMPTION_HELPER')}
        iconHelper={true}
      />
    </>
  )
}

export default SelfConsumption
