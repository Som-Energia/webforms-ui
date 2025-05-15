import { useTranslation } from 'react-i18next'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'

const SomStepper = (props) => {
  const { activeStep, steps } = props
  const { t } = useTranslation()

  const numberSteps = Object.keys(steps).length
  const currentStep = activeStep + 1

  return (
    <>
      <Typography
        color='secondary'
      >
        {t('Pas') + ' ' + currentStep + '/' + numberSteps }
      </Typography>
      <LinearProgress 
        variant="determinate" 
        value={(activeStep / numberSteps) * 100} 
        color='secondary'
        sx={{
          backgroundColor: 'secondary',
          '& .MuiLinearProgress-bar': {
            backgroundColor: 'primary2.main'
          }
        }}
      />
    </>
  )
}
export default SomStepper
