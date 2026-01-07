import useCheckMobileScreen from '../../../services/checkMobileScreen'
import GurbMobileStepper from './GurbMobileStepper'
import GurbDesktopStepper from './GurbDesktopStepper'

const SomGurbStepper = (props) => {
  const { steps, activeStep } = props
  const isMobile = useCheckMobileScreen()

  return isMobile ? (
    <GurbMobileStepper steps={steps} activeStep={activeStep} />
  ) : (
    <GurbDesktopStepper steps={steps} activeStep={activeStep} />
  )
}

export default SomGurbStepper
