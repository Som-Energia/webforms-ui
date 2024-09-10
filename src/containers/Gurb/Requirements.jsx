import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import SomStepper from './components/SomStepper'
import TextRecomendation from './components/TextRecomendation'
import Chooser from './components/Chooser'

const LightQuestion = (props) => {
  return (
    <>
      <TextRecomendation
        title={'1. Actualment a casa teva hi ha llum corrent?'}
      />
      &nbsp;
      <Chooser />
    </>
  )
}
const Address = (props) => {
  return <>Address</>
}
const SelfConsumption = (props) => {
  return <>Selfconsumption</>
}
const MemberQuestion = () => {
  return <>Member</>
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