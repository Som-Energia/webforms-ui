import { useContext } from 'react'
import { useTranslation } from 'react-i18next'

import Typography from '@mui/material/Typography'

import { textSubtitle, textHeader2 } from './gurbTheme'

import ContractReview from './pages/Gurb/ContractReview'
import GurbErrorContext from '../../context/GurbErrorContext'
import { GURB_FORM_SUBSTEPS } from '../../services/steps'
import GurbParticipation from './pages/Gurb/GurbParticipation'
import Payment from './pages/Gurb/Payment'
import SomStepper from '../../components/SomStepper'
import SomGurbStepper from './components/SomGurbStepper'


const Contract = (props) => {
  const GURB_SECTION_STEPS = 4
  const { activeStep, stepperActiveStep, stepperSteps } = props
  const { t } = useTranslation()
  const { error, errorInfo, getStepResult } = useContext(GurbErrorContext)

  const getTitle = () => {
    if (activeStep === 0) {
      return t('GURB_PARTICIPATION_TITLE_1_STEP')
    }
    else if (activeStep === 1) {
      return t('GURB_PARTICIPATION_TITLE_2_STEP')
    }
    else {
      return t('GURB_PARTICIPATION_TITLE_3_STEP')
    }
  }
  const getStep = () => {
    if (activeStep === 0) {
      return <GurbParticipation {...props} />
    }
    else if (activeStep === 1) {
      return <ContractReview {...props} />
    }
    else if (activeStep === 2) {
      return <Payment {...props} />
    }
  }

  return (
    console.log('Active Step in gurb:', activeStep),
    <>
      <Typography sx={textSubtitle}>{t('GURB_FORM_TITLE')}</Typography>
      <SomGurbStepper steps={stepperSteps} activeStep={stepperActiveStep} />
      <Typography sx={textHeader2}>{getTitle()}</Typography>
      <SomStepper activeStep={activeStep} steps={GURB_FORM_SUBSTEPS} showNames={false} />
      {error ? getStepResult(errorInfo) : getStep()}
    </>
  )
}

export default Contract
