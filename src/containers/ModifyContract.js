import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { makeStyles } from '@material-ui/core/styles'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import StepContent from '@material-ui/core/StepContent'
// import Paper from '@material-ui/core/Paper'
// import Typography from '@material-ui/core/Typography'

import ModifyIntro from './ModifyContract/ModifyIntro'
import ModifyParams from './ModifyContract/ModifyParams'
import ModifyContact from './ModifyContract/ModifyContact'
import ModifyResume from './ModifyContract/ModifyResume'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%'
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  actionsContainer: {
    marginBottom: theme.spacing(2)
  },
  resetContainer: {
    padding: theme.spacing(3)
  },
  stepLabel: {
    fontSize: '1.5rem',
    color: 'red'
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

  const handleChange = (event) => {
    console.log(event.target.name, event.target.value)
    const value = {}
    value[event.target.name] = event.target.value
    setData({ ...data, ...value })
    console.log(data)
  }

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <ModifyIntro
          nextStep={nextStep}
          handleChange={handleChange}
        />
      case 1:
        return <ModifyParams
          nextStep={nextStep}
          prevStep={prevStep}
          handleChange={handleChange}
        />
      case 2:
        return <ModifyContact
          nextStep={nextStep}
          prevStep={prevStep}
          handleChange={handleChange}
        />
      default:
        return <ModifyResume
          nextStep={nextStep}
          prevStep={prevStep}
          handleChange={handleChange}
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
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel className={classes.stepLabel}>{t(label)}</StepLabel>
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
