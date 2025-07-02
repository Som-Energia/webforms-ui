import React, { useState, useEffect, useCallback } from 'react'
import { Navigate, useParams, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { normalizeD1ConfirmationData, templateData } from '../services/utils'
import { confirmD1Case } from '../services/api'

import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

import Grow from '@mui/material/Grow'

import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import StepContent from '@mui/material/StepContent'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import D1Validation from './CaseDetail/D1Validation'
import RefuseD1 from './CaseDetail/RefuseD1'
import AcceptD1 from './CaseDetail/AcceptD1'

function D1Detail(props) {
  const { t, i18n } = useTranslation()
  const { language } = useParams()
  const { state } = useLocation()

  const { templateProps = templateData } = props

  useEffect(() => {
    i18n.changeLanguage(language)
  }, [language, i18n])

  const [activeStep, setActiveStep] = useState(state?.d1CaseData ? 1 : 0)
  const [data, setData] = useState(state?.d1CaseData || templateProps)

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

  const steps = [
    t('DETAIL_D1_TITLE'),
    t('ACCEPT_OR_REFUSE_TITLE'),
    t('REVISIO_CONFIRMACIO_DADES'),
  ]

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
          <Navigate
            to={{
              pathname: `/${language}/contract/modification`
            }}
            state={{ d1CaseData: data }}
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
    <Box
      sx={{
        width: '100%',
        backgroundColor: 'background.third'
      }}>
      {(data?.to_validate && (
        <>
          <Stepper
            sx={{
              '& .MuiStepIcon-root.Mui-active': {
                color: 'primary.main'
              },
              '& .MuiStepIcon-root.Mui-completed': {
                color: 'primary.main'
              },
              pl: 1,
              pr: 1,
              pb: 1
            }}
            activeStep={activeStep}
            orientation="vertical">
            {steps.map((label, index) => (
              <Step key={`step_${index}`}>
                <StepLabel
                  error={
                    index === steps.length - 1 && data?.error !== undefined
                  }>
                  <Typography component="body1" sx={{ fontSize: '1.15rem' }}>
                    {label}
                  </Typography>
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
              <Box sx={{ m: 1 }}>
                <Alert severity="error">
                  <AlertTitle>{t('ERROR_POST_MODIFY')}</AlertTitle>
                  {t(data?.error?.code)}
                </Alert>
              </Box>
            </Grow>
          )}
          {data?.response && (
            <Grow in={data?.response !== undefined}>
              <Box sx={{ m: 1 }}>
                <Alert severity="success">
                  {(data?.validate && (
                    <AlertTitle>{t('MODIFY_POTTAR_SUCCESS_TITTLE')}</AlertTitle>
                  )) || <AlertTitle>{t('REFUSE_SUCCESS_TITTLE')}</AlertTitle>}
                  {t('MODIFY_POTTAR_SUCCESS_MESSAGE')}
                </Alert>
              </Box>
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
    </Box>
  )
}

export default D1Detail
