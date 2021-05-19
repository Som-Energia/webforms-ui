import React, { useState, useEffect, useCallback } from 'react'
import { Redirect } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { makeStyles } from '@material-ui/core/styles'
import { normalizeD1ConfirmationData, fakeD1Data } from '../services/utils'
import { confirmD1Case } from '../services/api'

import Alert from '@material-ui/lab/Alert'
import AlertTitle from '@material-ui/lab/AlertTitle'

import Grow from '@material-ui/core/Grow'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import StepContent from '@material-ui/core/StepContent'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Typography from '@material-ui/core/Typography'

import D1Validation from './CaseDetail/D1Validation'
import RefuseD1 from './CaseDetail/RefuseD1'
import AcceptD1 from './CaseDetail/AcceptD1'

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
  }
}))

const steps = [
  'DETAIL_D1_TITLE',
  'ACCEPT_OR_REFUSE_TITLE',
  'REVISIO_CONFIRMACIO_DADES'
]

function D1Detail(props) {
  const classes = useStyles()
  const { t, i18n } = useTranslation()

  const { templateProps = fakeD1Data } = props

  useEffect(() => {
    const language = props.match.params.language
    i18n.changeLanguage(language)
  }, [props.match.params.language, i18n])

  const [activeStep, setActiveStep] = useState(
    props?.location?.state?.d1CaseData ? 1 : 0
  )
  const [data, setData] = useState(
    props?.location?.state?.d1CaseData || templateProps
  )

  const [adviceOpen, setAdviceOpen] = useState(true)

  const handleStepChanges = useCallback(
    (params) => {
      setData({ ...data, ...params })
    },
    [data]
  )

  const handlePost = async (values) => {
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
        return (
          <D1Validation
            handleAcceptClick={() => nextStep(1)}
            handleStepChanges={handleStepChanges}
            params={data}
          />
        )
      case 1:
        if (data?.validate) {
          return (
            <AcceptD1
              prevStep={() => prevStep()}
              nextStep={() => nextStep(2)}
              handlePost={handlePost}
              handleStepChanges={handleStepChanges}
              params={data}
            />
          )
        } else {
          return (
            <RefuseD1
              handlePost={handlePost}
              prevStep={() => prevStep()}
              handleStepChanges={handleStepChanges}
              params={data}
            />
          )
        }
      default:
        return (
          <Redirect
            to={{
              pathname: `/${props.match.params.language}/contract/modification`,
              state: { d1CaseData: data }
            }}
          />
        )
    }
  }

  const nextStep = (step) => {
    setActiveStep(step)
  }

  const prevStep = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  return (
    <div className={classes.root}>
      {(data?.to_validate && (
        <>
          <Dialog
            open={adviceOpen}
            onClose={() => setAdviceOpen(false)}
            maxWidth="sm">
            <DialogTitle>⚠️&nbsp;&nbsp;{t('WARNING_NP_TITLE')}</DialogTitle>
            <DialogContent dividers={true}>
              <DialogContentText>
                <Typography
                  className={classes.warningMessage}
                  dangerouslySetInnerHTML={{
                    __html: t('NP_FORM_WARNING')
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

          <Stepper
            className={classes.stepper}
            activeStep={activeStep}
            orientation="vertical">
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel
                  error={
                    index === steps.length - 1 && data?.error !== undefined
                  }>
                  <span className={classes.stepLabel}>{t(label)}</span>
                </StepLabel>
                <StepContent>
                  {data?.error === undefined &&
                    data?.response === undefined &&
                    getStepContent(index)}
                </StepContent>
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
                  {(data?.validate && (
                    <AlertTitle>{t('MODIFY_POTTAR_SUCCESS_TITTLE')}</AlertTitle>
                  )) || <AlertTitle>{t('REFUSE_SUCCESS_TITTLE')}</AlertTitle>}
                  {t('MODIFY_POTTAR_SUCCESS_MESSAGE')}
                </Alert>
              </div>
            </Grow>
          )}
        </>
      )) || (
        <D1Validation
          nextStep={() => nextStep(1)}
          handleStepChanges={handleStepChanges}
          params={data}
        />
      )}
    </div>
  )
}

export default D1Detail
