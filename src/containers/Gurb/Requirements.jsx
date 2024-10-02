import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import SomStepper from './components/SomStepper'
import SomGurbStepper, {
  GURB_REQUIREMENTS_STEP
} from './components/SomGurbStepper'
import Header from './components/Header'

import Typography from '@mui/material/Typography'

import LightQuestion from './pages/Requirements/LightQuestion'
import Address from './pages/Requirements/Address'
import SelfConsumption from './pages/Requirements/SelfConsumption'
import MemberQuestion from './pages/Requirements/MemberQuestion'

import { textBody3, textSubtitle } from './gurbTheme'
import FailureRequirement from './components/FailureRequirement'

const Requirements = (props) => {
  const { values, activeStep } = props
  const { t } = useTranslation()
  const [error, setError] = useState(false)
  const [errorInfo, setErrorInfo] = useState({})

  const checkErrors = () => {
    switch (
      activeStep // treure els numerets
    ) {
      case 0:
        if (values.has_light === 'light-off') {
          setError(true)
          setErrorInfo({
            main_text: 'Si no hi ha llum a casa teva...',
            seconday_text: "Et pots donar d'alta al servei...",
            link_text: 'Sí que tinc llum a casa'
          })
          return true
        }
        return false
      case 2:
        if (values.has_selfconsumption === 'selfconsumption-off') {
          setError(true)
          setErrorInfo({
            main_text: "Si ja tens una modalitat d'autoconsum...",
            seconday_text: 'Pots veure més informació...',
            link_text: "No tinc cap modalitat d'autoconsum activa"
          })
          return true
        }
        return false
      default:
        return false
    }
  }

  useEffect(() => {
    checkErrors()
  }, [values])

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
      <Typography sx={textSubtitle}>Formulari inscripció</Typography>
      <SomGurbStepper activeStep={GURB_REQUIREMENTS_STEP} />
      <Header title="Requisits de participació" />
      <Typography sx={textBody3}>
        Per participar has de complir els 4 requisits que et preguntem a
        continuació
      </Typography>
      <SomStepper step={activeStep} connectors={4 + 1} />
      {error ? (
        <FailureRequirement
          textHeader={errorInfo?.main_text}
          textBody={errorInfo?.seconday_text}
          textHelper={errorInfo?.link_text}
        />
      ) : (
        getStep()
      )}
    </>
  )
}
export default Requirements
