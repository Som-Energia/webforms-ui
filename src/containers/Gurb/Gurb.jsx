import { useContext } from 'react'
import { useTranslation } from 'react-i18next'

import GurbIdentification from './pages/Gurb/GurbIdentification'
import GurbSignature from './pages/Gurb/GurbSignature'
import ContractReview from './pages/Gurb/ContractReview'
import GurbErrorContext from '../../context/GurbErrorContext'
import { GURB_FORM_SUBSTEPS } from '../../services/steps'
import GurbParticipation from './pages/Gurb/GurbParticipation'
import Payment from './pages/Gurb/Payment'
import SomStepper from '../../components/SomStepper'


const Contract = (props) => {
  const { activeStep, stepperActiveStep, stepperSteps } = props
  const { t } = useTranslation()
  const { error, errorInfo, getStepResult } = useContext(GurbErrorContext)

  const getStep = () => {
    if (activeStep === 0) {
      return <GurbIdentification {...props} />
    }
    else if (activeStep === 1) {
      return <GurbParticipation {...props} />
    }
    else if (activeStep === 2) {
      return <ContractReview {...props} />
    }
    else if (activeStep === 3){
      return <GurbSignature {...props} />
    } else {
      return <Payment {...props} />
    }
  }

  return (
    <>
      <SomStepper
        activeStep={activeStep}
        steps={GURB_FORM_SUBSTEPS}
        showNames={true} />
      {error ? getStepResult(errorInfo) : getStep()}
    </>
  )
}

export default Contract
