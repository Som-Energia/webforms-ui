import { useTranslation } from 'react-i18next'

import Step from '@mui/material/Step'
import Stepper from '@mui/material/Stepper'
import Typography from '@mui/material/Typography'
import StepConnector, {
  stepConnectorClasses
} from '@mui/material/StepConnector'

import Box from '@mui/material/Box'
import { NEXT_COLOR, PREV_COLOR } from '../../../themes/gurbTheme'

const GurbMobileStepper = ({ steps, activeStep }) => {
  const { t } = useTranslation()
  return (
    <Stepper
      sx={{
        '& .MuiStepIcon-root.Mui-completed': {
          color: 'black'
        }
      }}
      connector={
        <StepConnector
          sx={{
            marginTop: '2rem',
            marginBottom: '2rem',
            [`& .${stepConnectorClasses.line}`]: {
              display: 'none'
            }
          }}
        />
      }>
      {steps.map((label, index) => {
        return (
          <Step key={label}>
            <Box
              sx={{
                marginBottom: '4px',
                borderRadius: '12px',
                height: '5px',
                width: '100%',
                backgroundColor:
                  index <= steps.indexOf(activeStep) ? PREV_COLOR : NEXT_COLOR
              }}
            />
            <Typography
              sx={{
                color:
                  index <= steps.indexOf(activeStep) ? PREV_COLOR : NEXT_COLOR,
                fontFamily: 'Inter',
                fontSize: '14px',
                textTransform: 'capitalize'
              }}>
              {t(label)}
            </Typography>
          </Step>
        )
      })}
    </Stepper>
  )
}
export default GurbMobileStepper
