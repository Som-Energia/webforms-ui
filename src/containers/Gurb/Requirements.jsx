import { useTranslation } from 'react-i18next'

import SomStepper from './components/SomStepper'
import Header from './components/Header'

import Typography from '@mui/material/Typography'

import LightQuestion from './pages/Requirements/LightQuestion'
import Address from './pages/Requirements/Address'
import SelfConsumption from './pages/Requirements/SelfConsumption'
import MemberQuestion from './pages/Requirements/MemberQuestion'

import { textBody3, textSubtitle } from './gurbTheme'

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
      <Typography sx={textSubtitle}>Formulari inscripció</Typography>
      <Header title="Requisits de participació" />
      <Typography sx={textBody3}>
        Per participar has de complir els 4 requisits que et preguntem a
        continuació
      </Typography>
      <SomStepper step={activeStep} connectors={4 + 1} />
      {getStep()}
    </>
  )
}
export default Requirements
