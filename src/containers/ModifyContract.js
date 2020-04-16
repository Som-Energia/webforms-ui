import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { makeStyles } from '@material-ui/core/styles'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import StepContent from '@material-ui/core/StepContent'
// import Paper from '@material-ui/core/Paper'
// import Typography from '@material-ui/core/Typography'

import Intro from './ModifyContract/Intro'
import Params from './ModifyContract/Params'
import Contact from './ModifyContract/Contact'
import Resume from './ModifyContract/Resume'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    backgroundColor: '#f2f2f2'
  },
  actionsContainer: {
    marginBottom: theme.spacing(2)
  },
  resetContainer: {
    padding: theme.spacing(2)
  },
  stepper: {
    backgroundColor: '#f2f2f2',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1)
  },
  stepLabel: {
    fontSize: '1.25rem'
  }
}))

function ModifyContract () {
  const classes = useStyles()
  const { t, i18n } = useTranslation()

  const [activeStep, setActiveStep] = useState(0)
  const [data, setData] = useState({})

  const steps = [
    'MODIFY_POTTAR_INTRO_TITLE',
    'MODIFY_POTTAR_SELECT_TITLE',
    'MODIFY_POTTAR_CONTACT_TITLE',
    'REVISIO_CONFIRMACIO_DADES'
  ]

  useEffect(() => {
    console.log(data)
  })

  const handleStepChanges = (params) => {
    setData({ ...data, ...params })
  }

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <Intro
          nextStep={nextStep}
          handleStepChanges={handleStepChanges}
        />
      case 1:
        return <Params
          nextStep={nextStep}
          prevStep={prevStep}
          handleStepChanges={handleStepChanges}
          params={data?.modify}
        />
      case 2:
        return <Contact
          nextStep={nextStep}
          prevStep={prevStep}
          handleStepChanges={handleStepChanges}
          params={data?.contact}
        />
      default:
        return <Resume
          nextStep={nextStep}
          prevStep={prevStep}
          handleStepChanges={handleStepChanges}
          params={data}
        />
    }
  }

  const nextStep = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const prevStep = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  return (
    <div className={classes.root}>
      <Stepper className={classes.stepper} activeStep={activeStep} orientation="vertical">
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel><span className={classes.stepLabel}>{t(label)}</span></StepLabel>
            <StepContent>
              {getStepContent(index)}
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </div>
  )
}

export default ModifyContract
