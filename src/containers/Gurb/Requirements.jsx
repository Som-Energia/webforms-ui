import { useTranslation } from 'react-i18next'

import SomStepper from './components/SomStepper'
import TextRecomendation from './components/TextRecomendation'
import Chooser from './components/Chooser'
import InputField from './components/InputField'
import { HelperText } from './components/InputField'

import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined'
import SolarPowerOutlinedIcon from '@mui/icons-material/SolarPowerOutlined'
import Groups2Icon from '@mui/icons-material/Groups2'
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined'

import { iconRequirements, iconOffRequirements } from './gurbTheme'

const LightQuestion = (props) => {
  const { values, setFieldValue } = props
  const { t } = useTranslation()

  const handleLightQuestion = (value) => {
    setFieldValue('has_light', value)
  }

  const options = [
    {
      id: 'light-on',
      icon: <LightbulbOutlinedIcon sx={iconRequirements} />,
      textHeader: t('GURB_HI_HA_LLUM'),
      textBody: t('GURB_HI_HA_LLUM_BODY')
    },
    {
      id: 'light-off',
      icon: <LightbulbOutlinedIcon sx={iconOffRequirements} />,
      textHeader: t('GURB_NO_HI_HA_LLUM'),
      textBody: t('GURB_NO_HI_HA_LLUM_BODY')
    }
  ]

  return (
    <>
      <TextRecomendation title={t('GURB_ACTUALMENT_HI_HA_LLUM')} />
      &nbsp;
      <Chooser
        options={options}
        value={values.has_light}
        handleChange={handleLightQuestion}
      />
    </>
  )
}
const Address = (props) => {
  const { t } = useTranslation()
  const { values, errors, touched, setFieldValue, setFieldTouched } = props

  const handleInputAddress = (event) => {
    setFieldValue('address.street', event.target.value)
  }

  const handleInputAddressBlur = () => {
    setFieldTouched('address.street', true)
  }

  return (
    <>
      <TextRecomendation
        title={t('GURB_ADRECA_SUBMINISTRAMENT_TITLE')}
        text={t('GURB_ADRECA_SUBMINISTRAMENT_TITLE_HELPER')}
      />
      &nbsp;
      <InputField
        textFieldName={t('GURB_ADRECA_SUBMINISTRAMENT')}
        textFieldHelper={t('GURB_ADRECA_SUBMINISTRAMENT_HELPER')}
        iconHelper={false}
        handleChange={handleInputAddress}
        handleBlur={handleInputAddressBlur}
        touched={touched?.address?.street}
        value={values.address.street}
        error={errors?.address?.street}
      />
    </>
  )
}
const SelfConsumption = (props) => {
  const { t } = useTranslation()

  const options = [
    {
      id: 'selfconsmption-on',
      icon: <SolarPowerOutlinedIcon sx={iconRequirements} />,
      textHeader: t('GURB_TINC_AUTOCONSUM'),
      textBody: t('GURB_TINC_AUTOCONSUM_BODY')
    },
    {
      id: 'selfconsmption-off',
      icon: <SolarPowerOutlinedIcon sx={iconOffRequirements} />,
      textHeader: t('GURB_NO_TINC_AUTOCONSUM'),
      textBody: t('GURB_NO_TINC_AUTOCONSUM_BODY')
    }
  ]

  return (
    <>
      <TextRecomendation title={t('GURB_AUTOCONSUM_TITLE')} />
      &nbsp;
      <Chooser options={options} />
      &nbsp;
      <HelperText helperText={t('GURB_AUTOCONSUM_HELPER')} iconHelper={true} />
    </>
  )
}

const MemberQuestion = () => {
  const { t } = useTranslation()

  const options = [
    {
      id: 'member-on',
      icon: <Groups2Icon sx={iconRequirements} />,
      textHeader: t('GURB_TINC_AUTOCONSUM'),
      textBody: t('GURB_TINC_AUTOCONSUM_BODY')
    },
    {
      id: 'member-off',
      icon: <Groups2Icon sx={iconOffRequirements} />,
      textHeader: t('GURB_NO_TINC_AUTOCONSUM'),
      textBody: t('GURB_NO_TINC_AUTOCONSUM_BODY')
    },
    {
      id: 'apadrinating',
      icon: <HandshakeOutlinedIcon sx={iconRequirements} />,
      textHeader: t('GURB_NO_TINC_AUTOCONSUM'),
      textBody: t('GURB_NO_TINC_AUTOCONSUM_BODY')
    }
  ]

  return (
    <>
      <TextRecomendation title={t('GURB_AUTOCONSUM_TITLE')} />
      &nbsp;
      <Chooser options={options} />
      &nbsp;
      <HelperText helperText={t('GURB_AUTOCONSUM_HELPER')} iconHelper={true} />
    </>
  )
}

const Requirements = (props) => {
  const { activeStep } = props
  const { t } = useTranslation()

  const getStep = () => {
    if (activeStep === 0) {
      return <LightQuestion {...props} />
    } else if (activeStep === 1) {
      return <Address {...props} />
    } else if (activeStep === 2) {
      return <SelfConsumption {...props} />
    } else {
      return <MemberQuestion {...props} />
    }
  }

  return (
    <>
      <SomStepper step={activeStep} connectors={4 + 1} />
      {getStep()}
    </>
  )
}
export default Requirements
