import { useContext } from 'react'
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
import AlertRequirement from './components/AlertRequirement'

import GurbErrorContext from '../../context/GurbErrorContext'

const Requirements = (props) => {
  const { values, activeStep } = props
  const { t } = useTranslation()
  const { error, errorInfo } = useContext(GurbErrorContext)

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
      <Typography sx={textSubtitle}>{t('GURB_FORM_TITLE')}</Typography>
      <SomGurbStepper activeStep={GURB_REQUIREMENTS_STEP} />
      <Header title={t('GURB_REQUIREMENTS_TITLE')} />
      <Typography sx={textBody3}>{t('GURB_REQUIREMENTS_SUBTITLE')}</Typography>
      <SomStepper step={activeStep} connectors={4 + 1} />
      {error ? (
        errorInfo?.error_type === 'error' ? (
          <FailureRequirement
            textHeader={errorInfo?.main_text}
            textBody={errorInfo?.seconday_text}
            textHelper={errorInfo?.link_text}
            textHelperAction={errorInfo?.test}
          />
        ) : (
          <AlertRequirement
            textHeader={errorInfo?.main_text}
            textBody={errorInfo?.seconday_text}
            textHelper={errorInfo?.link_text}
            textHelperAction={errorInfo?.test}
          />
        )
      ) : (
        getStep()
      )}
    </>
  )
}
export default Requirements
