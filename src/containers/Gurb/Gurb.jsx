import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import SomGurbStepper, { GURB_FINAL_STEP } from './components/SomGurbStepper'
import Typography from '@mui/material/Typography'
import { textSubtitle, textHeader2 } from './gurbTheme'
import GurbErrorContext from '../../context/GurbErrorContext'
import GurbParticipation from './pages/Gurb/GurbParticipation'
import ContractReview from './pages/Gurb/ContractReview'
import SomStepper from './components/SomStepper'
import Payment from './pages/Gurb/Payment'



const Contract = (props) => {
  const { activeStep } = props
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
    else {
      return <Payment {...props} />
    }
  }

  return (
    <>
      <Typography sx={textSubtitle}>{t('GURB_FORM_TITLE')}</Typography>
      <SomGurbStepper activeStep={GURB_FINAL_STEP} />
      <Typography sx={textHeader2}>{getTitle()}</Typography>
      <SomStepper step={activeStep} connectors={3 + 1} />
      {error ? getStepResult(errorInfo) : getStep()}
    </>
  )
}

export default Contract
