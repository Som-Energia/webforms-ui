import { useContext } from 'react'
import { useTranslation } from 'react-i18next'

import SomStepper from './components/SomStepper'
import SomGurbStepper, {
  GURB_REQUIREMENTS_STEP
} from './components/SomGurbStepper'
import Header from './components/Header'

import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'

import LightQuestion from './pages/Requirements/LightQuestion'
import Address from './pages/Requirements/Address'
import SelfConsumption from './pages/Requirements/SelfConsumption'
import MemberQuestion from './pages/Requirements/MemberQuestion'

import { textBody3, textSubtitle } from './gurbTheme'

import GurbErrorContext from '../../context/GurbErrorContext'
import useCheckMobileScreen from '../../services/checkMobileScreen'

const Requirements = (props) => {
  const { values, activeStep } = props
  const { t } = useTranslation()
  const { error, errorInfo, getStepResult } = useContext(GurbErrorContext)
  const isMobile = useCheckMobileScreen()

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
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography sx={textSubtitle}>{t('GURB_FORM_TITLE')}</Typography>
      </Grid>
      <Grid item xs={12}>
        <SomGurbStepper activeStep={GURB_REQUIREMENTS_STEP} />
      </Grid>
      <Grid item xs={12}>
        <Header title={t('GURB_REQUIREMENTS_TITLE')} />
      </Grid>
      <Grid item xs={12}>
        <Typography sx={textBody3}>
          {t('GURB_REQUIREMENTS_SUBTITLE')}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        {!isMobile && <SomStepper step={activeStep} connectors={4 + 1} />}
      </Grid>
      <Grid item xs={12}>
        {error ? getStepResult(errorInfo) : getStep()}
      </Grid>
    </Grid>
  )
}
export default Requirements
