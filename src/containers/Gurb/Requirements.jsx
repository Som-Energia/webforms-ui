import { useContext } from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@mui/material/Grid'

import GurbErrorContext from '../../context/GurbErrorContext'
import useCheckMobileScreen from '../../services/checkMobileScreen'
import { GURB_REQUIREMENTS_SUBSTEPS } from '../../services/steps'
import SupplyPoint from './SupplyPoint'
import LightQuestion from './pages/Requirements/LightQuestion'
import Address from './pages/Requirements/Address'
import SelfConsumption from './pages/Requirements/SelfConsumption'
import MemberQuestion from './pages/Requirements/MemberQuestion'
import SomStepper from '../../components/SomStepper'

const Requirements = (props) => {
  const { values, activeStep, stepperActiveStep, stepperSteps } = props
  const { t } = useTranslation()
  const { error, errorInfo, getStepResult } = useContext(GurbErrorContext)
  const isMobile = useCheckMobileScreen()

  const getStep = () => {
    if (activeStep === 0) {
      return <SupplyPoint {...props} />
    } else if (activeStep === 1) {
      return <Address {...props} />
    } else if (activeStep === 2) {
      return <LightQuestion {...props} />
    } else if (activeStep === 3) {
      return <SelfConsumption {...props} />
    } else {
      return <MemberQuestion {...props} />
    }
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        {!isMobile && (
          <SomStepper
            activeStep={activeStep}
            steps={GURB_REQUIREMENTS_SUBSTEPS}
            showNames={true}
          />
        )}
      </Grid>
      <Grid item xs={12}>
        {error ? getStepResult(errorInfo) : getStep()}
      </Grid>
    </Grid>
  )
}
export default Requirements
