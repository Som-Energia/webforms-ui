import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'
import { Grid2 as Grid } from '@mui/material'

import PrevButton from '../Buttons/PrevButton'
import NextButton from '../Buttons/NextButton'

// TODO: move to Somenergia UI
const NewSomStepper = (props) => {
  const {
    activeStep = 0,
    setActiveStep,
    steps = [],
    stepTitle = 'STEP_TITLE',
    showStepProgress = true,
    showStepTitle = false,
    disableNext = true,
    nextButton,
    children
  } = props
  const { t } = useTranslation()

  const nextStep = useCallback(() => {
    setActiveStep((prev) => Math.min(prev + 1, steps.length))
  }, [steps, setActiveStep])

  const prevStep = useCallback(() => {
    setActiveStep((prev) => Math.max(0, prev - 1))
  }, [setActiveStep])

  const currentStepNum =
    activeStep >= steps.length ? steps.length : activeStep + 1
  const maxStepsNum = steps.length
  const lastStepIndex = steps.length - 1

  return (
    <>
      {showStepProgress && (
        <Typography color="secondary">
          {showStepTitle && t(stepTitle)}{' '}
          {steps.length && currentStepNum + '/' + maxStepsNum}
        </Typography>
      )}
      {steps.length && (
        <LinearProgress
          variant="determinate"
          value={(currentStepNum / maxStepsNum) * 100}
          color="secondary"
          sx={{
            marginBottom: '65px',
            height: 6,
            borderRadius: '100px',
            backgroundColor: 'secondary.extraDark',
            '& .MuiLinearProgress-bar': {
              backgroundColor: 'primary.mainOrange'
            }
          }}
        />
      )}

      {children ?? steps.at(activeStep) ?? null}

      <Grid
        container
        direction="row-reverse"
        rowSpacing={2}
        sx={{
          marginTop: '2rem',
          justifyContent:
            activeStep === lastStepIndex ? 'center' : 'space-between',
          alignItems: 'center'
        }}>
        {activeStep > 0 && activeStep < lastStepIndex && (
          <Grid item size={{ sm: 2, xs: 12 }}>
            <PrevButton onClick={() => prevStep()}>{t('PREV')}</PrevButton>
          </Grid>
        )}

        {activeStep <= lastStepIndex && (
          <Grid item size={{ sm: 2, xs: 12 }} order={-1}>
            {nextButton || (
              <NextButton disabled={disableNext} onClick={() => nextStep()}>
                {t('NEXT')}
              </NextButton>
            )}
          </Grid>
        )}
      </Grid>
    </>
  )
}
export default NewSomStepper
