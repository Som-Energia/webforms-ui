import React, { useState, useEffect, useCallback } from 'react'
import { Navigate, useParams, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { GlobalHotKeys } from 'react-hotkeys'

import { modifyContract, confirmD1Case } from '../services/api'
import {
  normalizeModifyData,
  normalizeD1ConfirmationData
} from '../services/utils'

import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grow from '@mui/material/Grow'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import StepContent from '@mui/material/StepContent'

import Intro from './ModifyContract/Intro'
import IntroFromD1 from './CaseDetail/Intro'
import Params from './ModifyContract/Params'
import Contact from './ModifyContract/Contact'
import Resume from './ModifyContract/Resume'

import DisplayFormikState from '../components/DisplayFormikState'
import AlertBox from '../components/AlertBox'

const keyMap = {
  SHOW_INSPECTOR: 'ctrl+shift+d'
}

function ModifyContract(props) {
  const params = useParams()
  const { state } = useLocation()

  const fromD1 = state?.d1CaseData?.m1
  const d1CaseData = state?.d1CaseData

  const { t, i18n } = useTranslation()

  const steps = [
    t('MODIFY_POTTAR_INTRO_TITLE'),
    t('MODIFY_POTTAR_SELECT_TITLE'),
    t('MODIFY_POTTAR_CONTACT_TITLE'),
    t('REVISIO_CONFIRMACIO_DADES'),
  ]

  const d1Steps = [
    t('ACCEPT_OR_REFUSE_TITLE'),
    t('DETAIL_D1_TITLE'),
  ]

  const handlers = {
    SHOW_INSPECTOR: () => {
      setShowInspector(!showInspector)
    }
  }

  useEffect(() => {
    const language = params.language
    i18n.changeLanguage(language)
  }, [params.language, i18n])

  const [showInspector, setShowInspector] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [activeD1Step, setActiveD1Step] = useState(2)
  const [data, setData] = useState({ token: props?.token })

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
      <Box sx={{ width: '100%', backgroundColor: 'secondary.light' }}>
        {noticeAutonomous ? (
          <AlertBox
            severity={'warning'}
            variant={'body2'}
            title={t('MODIFY_POTTAR_AUTON_ENTERPRISE_INTRO_TITLE')}
            description={t('MODIFY_POTTAR_BANER', {
              baner_boe_url: t('MODIFY_POTTAR_BANER_BOE_URL'),
              baner_document_url: t('MODIFY_POTTAR_BANER_DOCUMENT_URL'),
              baner_help_url: t('MODIFY_POTTAR_BANER_HELP_URL')
            })}></AlertBox>) : null
        }
        {fromD1 && (
          <Stepper
            sx={{ backgroundColor: 'secondary.light', pl: 1, pr: 1, pb: 1 }}
            activeStep={activeD1Step}
            orientation="vertical">
            {d1Steps.map((label, index) => (
              <Step key={`step-${index}`}>
                <StepLabel>
                  <Typography variant="pagetitle">{label}</Typography>
                </StepLabel>
                <StepContent>
                  <Navigate
                    to={{
                      pathname: `/${params.language}/d1-detail`
                    }}
                    state={{ d1CaseData: d1CaseData }}
                  />
                </StepContent>
              </Step>
            ))}
          </Stepper>
        )}
        <Stepper
          sx={{ backgroundColor: 'secondary.light', pl: 1, pr: 1, pb: 1 }}
          activeStep={activeStep}
          orientation="vertical">
          {steps.map((label, index) => (
            <Step key={`step-${index}`}>
              <StepLabel
                error={index === steps.length - 1 && data?.error !== undefined}>
                <Typography variant="pagetitle">{label}</Typography>
              </StepLabel>
              <StepContent>{getStepContent(index)}</StepContent>
            </Step>
          ))}
        </Stepper>
        {data?.error && (
          <Grow in={data?.error !== undefined}>
            <Box sx={{ padding: 1 }}>
              <Alert severity="error">
                <AlertTitle>{t('ERROR_POST_MODIFY')}</AlertTitle>
                {t(data?.error?.code)}
              </Alert>
            </Box>
          </Grow>
        )}
        {data?.response && (
          <Grow in={data?.response !== undefined}>
            <Box sx={{ padding: 1 }}>
              <Alert severity="success">
                <AlertTitle>{t('MODIFY_POTTAR_SUCCESS_TITTLE')}</AlertTitle>
                {t('MODIFY_POTTAR_SUCCESS_MESSAGE')}
              </Alert>
            </Box>
          </Grow>
        )}
        {showInspector && <DisplayFormikState {...data} />}
      </Box>
    </GlobalHotKeys>
  )
}

export default ModifyContract
