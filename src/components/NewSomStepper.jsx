import { useTranslation } from 'react-i18next'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'

const SomStepper = (props) => {
  const { activeStep, steps, stepsNum, showStepTitle = false } = props
  const { t } = useTranslation()

  const numberSteps = stepsNum || Object.keys(steps).length
  const currentStep = activeStep + 1

  return (
    <>
      <Typography color="secondary">
         {showStepTitle && t('STEP_TITLE')} {currentStep + '/' + numberSteps}
      </Typography>
      <LinearProgress
        variant="determinate"
        value={(currentStep / numberSteps) * 100}
        color="secondary"
        sx={{
          height: 6,
          borderRadius: '100px',
          backgroundColor: 'secondary.extraDark',
          '& .MuiLinearProgress-bar': {
            backgroundColor: 'primary2.main'
          }
        }}
      />
    </>
  )
}
export default SomStepper
