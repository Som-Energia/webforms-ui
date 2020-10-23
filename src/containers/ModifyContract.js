import React, { useState, useEffect, useCallback } from 'react'
import  { Redirect } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { makeStyles } from '@material-ui/core/styles'
import { modifyContract } from '../services/api'
import { normalizeModifyData } from '../services/utils'

import Alert from '@material-ui/lab/Alert'
import AlertTitle from '@material-ui/lab/AlertTitle'

import Grow from '@material-ui/core/Grow'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import StepContent from '@material-ui/core/StepContent'

import Intro from './ModifyContract/Intro'
import IntroFromD1 from './CaseDetail/Intro'
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
  responseContainer: {
    padding: theme.spacing(1)
  },
  stepper: {
    backgroundColor: '#f2f2f2',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingBottom: theme.spacing(1)
  },
  stepLabel: {
    fontSize: '1.15rem'
  }
}))

const steps = [
  'MODIFY_POTTAR_INTRO_TITLE',
  'MODIFY_POTTAR_SELECT_TITLE',
  'MODIFY_POTTAR_CONTACT_TITLE',
  'REVISIO_CONFIRMACIO_DADES'
]

const d1_steps = [
  'ACCEPT_OR_REFUSE_TITLE',
  'DETAIL_D1_TITLE'
]

function ModifyContract (props) {
  const fromD1 = props?.location?.state?.d1CaseData?.m1
  const d1CaseData = props?.location?.state?.d1CaseData

  const classes = useStyles()
  const { t, i18n } = useTranslation()

  useEffect(() => {
    const language = props.match.params.language
    i18n.changeLanguage(language)
  }, [props.match.params.language, i18n])

  const [activeStep, setActiveStep] = useState(0)
  const [activeD1Step, setActiveD1Step] = useState(2)
  const [data, setData] = useState({ token: props?.token })

  const handleStepChanges = useCallback((params) => {
    setData({ ...data, ...params })
  }, [data])

  const handlePost = async (values) => {
    if (fromD1) {
      console.log("normalize data")
      console.log("post")
    }
    else {
      const data = normalizeModifyData(values)
      await modifyContract(data)
        .then(response => {
          handleStepChanges({ response: response })
          nextStep()
        })
        .catch(error => {
          const errorObj = {
            error: error?.response?.data?.error
              ? error.response.data.error
              : { code: 'MODIFY_POTTAR_UNEXPECTED' }
          }
          handleStepChanges(errorObj)
          nextStep()
        })
    }
  }

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          fromD1
            ? <IntroFromD1
              nextStep={() => nextStep(1)}
              prevStep={() => prevStep()}
              handleStepChanges={handleStepChanges}
            />
            : <Intro
              nextStep={() => nextStep(1)}
              handleStepChanges={handleStepChanges}
            />
        )
      case 1:
        return <Params
          nextStep={() => nextStep(2)}
          prevStep={() => prevStep()}
          handleStepChanges={handleStepChanges}
          params={data?.modify}
        />
      case 2:
        return <Contact
          nextStep={() => nextStep(3)}
          prevStep={() => prevStep()}
          handleStepChanges={handleStepChanges}
          params={data?.contact}
        />
      default:
        return <Resume
          nextStep={() => nextStep(4)}
          prevStep={prevStep}
          handleStepChanges={handleStepChanges}
          postSubmit={handlePost}
          params={data}
          d1CaseData={fromD1 ? d1CaseData : false}
        />
    }
  }

  const nextStep = (step) => {
    setActiveStep(step)
  }

  const prevStep = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
    if (fromD1 && activeStep === 0) {
      setActiveD1Step((activeD1Step) => activeD1Step - 1)
    }
  }

  return (
    <div className={classes.root}>
      {
        fromD1 &&
        <Stepper className={classes.stepper} activeStep={activeD1Step} orientation="vertical">
          {d1_steps.map((label, index) => (
            <Step key={label}>
              <StepLabel error={ (index === d1_steps.length - 1) && (data?.error !== undefined) } ><span className={classes.stepLabel}>{t(label)}</span></StepLabel>
              <StepContent>
                <Redirect to={{ pathname: `/${props.match.params.language}/d1-detail`, state: { d1CaseData: d1CaseData } }}/>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      }
      <Stepper className={classes.stepper} activeStep={activeStep} orientation="vertical">
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel error={ (index === steps.length - 1) && (data?.error !== undefined) } ><span className={classes.stepLabel}>{t(label)}</span></StepLabel>
            <StepContent>
              {getStepContent(index)}
            </StepContent>
          </Step>
        ))}
      </Stepper>
      { data?.error &&
        <Grow in={data?.error !== undefined}>
          <div className={classes.responseContainer}>
            <Alert severity="error">
              <AlertTitle>{t('ERROR_POST_MODIFY')}</AlertTitle>
              {t(data?.error?.code)}
            </Alert>
          </div>
        </Grow>
      }
      { data?.response &&
        <Grow in={data?.response !== undefined}>
          <div className={classes.responseContainer}>
            <Alert severity="success">
              <AlertTitle>{t('MODIFY_POTTAR_SUCCESS_TITTLE')}</AlertTitle>
              {t('MODIFY_POTTAR_SUCCESS_MESSAGE')}
            </Alert>
          </div>
        </Grow>
      }
    </div>
  )
}

export default ModifyContract
