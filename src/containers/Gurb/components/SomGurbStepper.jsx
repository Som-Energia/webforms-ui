import { useTranslation } from 'react-i18next'

import useCheckMobileScreen from '../../../services/checkMobileScreen'
import GurbMobileStepper from './GurbMobileStepper'
import GurbDesktopStepper from './GurbDesktopStepper'

export const GURB_REQUIREMENTS_STEP = 'GURB_REQUIREMENTS_STEP'
export const GURB_NEW_MEMBER_STEP = 'GURB_NEW_MEMBER_STEP'
export const GURB_CONTRACT_STEP = 'GURB_CONTRACT_STEP'
export const GURB_FINAL_STEP = 'GURB_FINAL_STEP'

const SomGurbStepper = (props) => {
  const { activeStep } = props
  const isMobile = useCheckMobileScreen()

  const steps = [
    GURB_REQUIREMENTS_STEP,
    GURB_NEW_MEMBER_STEP,
    GURB_CONTRACT_STEP,
    GURB_FINAL_STEP
  ]

  return isMobile ? (
    <GurbMobileStepper steps={steps} activeStep={activeStep} />
  ) : (
    <GurbDesktopStepper steps={steps} activeStep={activeStep} />
  )
}

export default SomGurbStepper
