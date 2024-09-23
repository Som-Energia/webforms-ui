import { styled } from '@mui/material/styles'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepConnector, {
  stepConnectorClasses
} from '@mui/material/StepConnector'
import { useEffect, useState } from 'react'

const SomConnector = styled(StepConnector)(({ theme }) => ({
  marginTop: '3rem',
  marginBottom: '3rem',
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#1E1E1E'
    }
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#1E1E1E'
    }
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: '#E6E6E6',
    borderTopWidth: 6,
    borderRadius: 10,
    ...theme.applyStyles('dark', {
      borderColor: theme.palette.grey[800]
    })
  }
}))

const SomStepper = (props) => {
  const { step, connectors } = props
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    setActiveStep(step + 1)
  }, [step])

  return (
    <>
      <Stepper activeStep={activeStep} connector={<SomConnector />}>
        {Array(connectors)
          .fill(0)
          .map((label, index) => {
            return <Step key={index} />
          })}
      </Stepper>
    </>
  )
}
export default SomStepper
