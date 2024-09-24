import { useTranslation } from 'react-i18next'

import Step from '@mui/material/Step'
import Stepper from '@mui/material/Stepper'
import StepLabel from '@mui/material/StepLabel'
import Typography from '@mui/material/Typography'
import StepConnector, {
  stepConnectorClasses
} from '@mui/material/StepConnector'

export const GURB_REQUIREMENTS_STEP = 'GURB_REQUIREMENTS_STEP'
export const GURB_NEW_MEMBER_STEP = 'GURB_NEW_MEMBER_STEP'
export const GURB_CONTRACT_STEP = 'GURB_CONTRACT_STEP'
export const GURB_FINAL_STEP = 'GURB_FINAL_STEP'

const SomGurbStepper = (props) => {
  const { activeStep } = props
  const { t } = useTranslation()

  const steps = [
    GURB_REQUIREMENTS_STEP,
    GURB_NEW_MEMBER_STEP,
    GURB_CONTRACT_STEP,
    GURB_FINAL_STEP
  ]

  return (
    <Stepper
      sx={{
        '& .MuiStepIcon-root.Mui-completed': {
          color: 'black'
        }
      }}
      nonLinear
      activeStep={steps.indexOf(activeStep)}
      connector={
        <StepConnector
          sx={{
            marginTop: '2rem',
            marginBottom: '2rem',
            [`& .${stepConnectorClasses.line}`]: {
              borderStyle: 'dashed',
              borderWidth: 'thin'
            }
          }}
        />
      }>
      {steps.map((label, index) => {
        return (
          <Step key={label} completed={index < steps.indexOf(activeStep)}>
            <StepLabel color="inherit">
              <Typography
                sx={{
                  fontFamily: 'Manrope',
                  fontSize: '18px',
                  textTransform: 'capitalize'
                }}>
                {t(label)}
              </Typography>
            </StepLabel>
          </Step>
        )
      })}
    </Stepper>
  )
}

export default SomGurbStepper
