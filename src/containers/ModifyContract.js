import React, { useState, useEffect, useCallback } from 'react'
import { Redirect } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { GlobalHotKeys } from 'react-hotkeys'

import { makeStyles } from '@material-ui/core/styles'
import { modifyContract, confirmD1Case } from '../services/api'
import {
  normalizeModifyData,
  normalizeD1ConfirmationData
} from '../services/utils'

import Alert from '@material-ui/lab/Alert'
import AlertTitle from '@material-ui/lab/AlertTitle'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

import Grow from '@material-ui/core/Grow'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import StepContent from '@material-ui/core/StepContent'
import Typography from '@material-ui/core/Typography'

import Intro from './ModifyContract/Intro'
import IntroFromD1 from './CaseDetail/Intro'
import Params from './ModifyContract/Params'
import Contact from './ModifyContract/Contact'
import Resume from './ModifyContract/Resume'

import DisplayFormikState from '../components/DisplayFormikState'

const useStyles = makeStyles((theme) => ({
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
  },
  warningMessage: {
    '& p': {
      marginTop: 0,
      marginBottom: '8px'
    },
    '& a': {
      color: theme.palette.primary.dark
    }
  }
}))

const keyMap = {
  SHOW_INSPECTOR: 'ctrl+shift+d'
}

const steps = [
  'MODIFY_POTTAR_INTRO_TITLE',
  'MODIFY_POTTAR_SELECT_TITLE',
  'MODIFY_POTTAR_CONTACT_TITLE',
  'REVISIO_CONFIRMACIO_DADES'
]

const d1Steps = ['ACCEPT_OR_REFUSE_TITLE', 'DETAIL_D1_TITLE']

function ModifyContract(props) {
  const fromD1 = props?.location?.state?.d1CaseData?.m1
  const d1CaseData = props?.location?.state?.d1CaseData

  const classes = useStyles()
  const { t, i18n } = useTranslation()

  const handlers = {
    SHOW_INSPECTOR: () => {
      setShowInspector(!showInspector)
    }
  }

  useEffect(() => {
    const language = props.match.params.language
    i18n.changeLanguage(language)
  }, [props.match.params.language, i18n])

  const [showInspector, setShowInspector] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [activeD1Step, setActiveD1Step] = useState(2)
  const [data, setData] = useState({ token: props?.token })

  const [adviceOpen, setAdviceOpen] = useState(true)

  const handleStepChanges = useCallback(
    (params) => {
      setData({ ...data, ...params })
    },
    [data]
  )

  const handlePost = async (values) => {
    const { token } = values
    const data = normalizeModifyData(values)
    await modifyContract(data, token)
      .then((response) => {
        handleStepChanges({ response: response })
        nextStep()
      })
      .catch((error) => {
        const errorObj = {
          error: error?.response?.data?.error
            ? error.response.data.error
            : { code: 'MODIFY_POTTAR_UNEXPECTED' }
        }
        handleStepChanges(errorObj)
        nextStep()
      })
  }

  const handleD1Post = async (values) => {
    const data = normalizeD1ConfirmationData(values)
    await confirmD1Case(data, values?.case_id, values?.token)
      .then((response) => {
        handleStepChanges({ response: response.data })
        nextStep()
      })
      .catch((error) => {
        const errorObj = {
          error: error?.response?.data?.error
            ? error.response.data.error
            : { code: 'MODIFY_POTTAR_UNEXPECTED' }
        }
        handleStepChanges(errorObj)
        nextStep()
      })
  }

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return fromD1 ? (
          <IntroFromD1
            nextStep={() => nextStep(1)}
            prevStep={() => prevStep()}
            handleStepChanges={handleStepChanges}
          />
        ) : (
          <Intro
            nextStep={() => nextStep(1)}
            handleStepChanges={handleStepChanges}
          />
        )
      case 1:
        return (
          <Params
            nextStep={() => nextStep(2)}
            prevStep={() => prevStep()}
            handleStepChanges={handleStepChanges}
            params={data?.modify}
          />
        )
      case 2:
        return (
          <Contact
            nextStep={() => nextStep(3)}
            prevStep={() => prevStep()}
            handleStepChanges={handleStepChanges}
            params={data?.contact}
          />
        )
      default:
        return (
          <Resume
            nextStep={() => nextStep()}
            prevStep={prevStep}
            handleStepChanges={handleStepChanges}
            postSubmit={fromD1 ? handleD1Post : handlePost}
            params={fromD1 ? { ...data, ...d1CaseData } : data}
          />
        )
    }
  }

  const nextStep = (step = false) => {
    step ? setActiveStep(step) : setActiveStep(activeStep + 1)
  }

  const prevStep = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
    if (fromD1 && activeStep === 0) {
      setActiveD1Step((activeD1Step) => activeD1Step - 1)
    }
  }

  return (
    <GlobalHotKeys handlers={handlers} keyMap={keyMap}>
      <div className={classes.root}>
        <Dialog
          open={adviceOpen}
          onClose={() => setAdviceOpen(false)}
          maxWidth="md">
          <DialogTitle>⚠️&nbsp;&nbsp;{t('WARNING_NP_TITLE')}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <Typography
                className={classes.warningMessage}
                dangerouslySetInnerHTML={{
                  __html: t('MODIFY_NP_ADVICE')
                }}></Typography>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setAdviceOpen(false)}
              color="primary"
              variant="contained">
              {t('I_ACCEPT')}
            </Button>
          </DialogActions>
        </Dialog>
        {fromD1 && (
          <Stepper
            className={classes.stepper}
            activeStep={activeD1Step}
            orientation="vertical">
            {d1Steps.map((label, index) => (
              <Step key={label}>
                <StepLabel>
                  <span className={classes.stepLabel}>{t(label)}</span>
                </StepLabel>
                <StepContent>
                  <Redirect
                    to={{
                      pathname: `/${props.match.params.language}/d1-detail`,
                      state: { d1CaseData: d1CaseData }
                    }}
                  />
                </StepContent>
              </Step>
            ))}
          </Stepper>
        )}
        <Stepper
          className={classes.stepper}
          activeStep={activeStep}
          orientation="vertical">
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel
                error={index === steps.length - 1 && data?.error !== undefined}>
                <span className={classes.stepLabel}>{t(label)}</span>
              </StepLabel>
              <StepContent>{getStepContent(index)}</StepContent>
            </Step>
          ))}
        </Stepper>
        {data?.error && (
          <Grow in={data?.error !== undefined}>
            <div className={classes.responseContainer}>
              <Alert severity="error">
                <AlertTitle>{t('ERROR_POST_MODIFY')}</AlertTitle>
                {t(data?.error?.code)}
              </Alert>
            </div>
          </Grow>
        )}
        {data?.response && (
          <Grow in={data?.response !== undefined}>
            <div className={classes.responseContainer}>
              <Alert severity="success">
                <AlertTitle>{t('MODIFY_POTTAR_SUCCESS_TITTLE')}</AlertTitle>
                {t('MODIFY_POTTAR_SUCCESS_MESSAGE')}
              </Alert>
            </div>
          </Grow>
        )}
        {showInspector && <DisplayFormikState {...data} />}
      </div>
    </GlobalHotKeys>
  )
}

export default ModifyContract
