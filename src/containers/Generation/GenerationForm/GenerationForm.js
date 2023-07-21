import React, { useState, useEffect } from 'react'

import { useTranslation } from 'react-i18next'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { useParams } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'

import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import CircularProgress from '@material-ui/core/CircularProgress'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'

import DisplayFormikState from '../../../components/DisplayFormikState'

import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import SendIcon from '@material-ui/icons/Send'

import MemberIdentifier from '../../Contribution/MemberIdentifier'
import GenerationContributionForm from './GenerationContributionForm'
import GenerationReview from './GenerationReview'

import Failure from '../../Failure'
import Success from '../../Success'

import {
  contributionParams,
  normalizeContribution,
  normalizeMember
} from '../../../services/utils'
import { contribution, member } from '../../../services/api'

const MAX_STEP_NUMBER = 4

const GenerationContribution = (props) => {
  const classes = useStyles()
  const { t, i18n } = useTranslation()
  const { language } = useParams()

  const [showInspector, setShowInspector] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [sending, setSending] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [error, setError] = useState(false)
  const [result, setResult] = useState({})

  useEffect(() => {
    i18n.changeLanguage(language)
  }, [language, i18n])

  const handlers = {
    SHOW_INSPECTOR: () => {
      setShowInspector(!showInspector)
    }
  }

  const initialValues = {
    member: {
      is_member: true,
      number: '',
      vat: '',
      checked: false,
      full_name: '',
      proxynif: '',
      proxyname: '',
      name: '',
      address: '',
      postal_code: '',
      state: { id: '' },
      city: { id: '' },
      surname1: '',
      surname2: '',
      email: '',
      email2: '',
      phone1: '',
      phone2: '',
      language: `${i18n.language}_ES`
    },
    payment: {
      amount: '',
      iban: '',
      payment_method: 'iban',
      sepa_accepted: false
    },
    number_of_actions: 0,
    annual_use: 0,
    terms_accepted: false,
    privacy_policy_accepted: false,
    legal_person_accepted: false
  }

  const validationSchemas = [
    Yup.object().shape({
      is_member: Yup.bool().oneOf([true, false], t('NO_IS_MEMBER')),
      member: Yup.object().shape({
        number: Yup.string().when('is_member', {
          is: true,
          then: Yup.string().required(t('NO_MEMBER_NUMBER'))
        }),
        vat: Yup.string()
          .required(t('NO_MEMBER_VAT'))
          .when('is_member', {
            is: false,
            then: Yup.string().matches(
              /(^[A-GI-Z0-9])/,
              t('CIF_COMMUNITY_OWNERS')
            )
          }),
        vatvalid: Yup.bool().when('is_member', {
          is: false,
          then: Yup.bool().required(t('FILL_NIF')).oneOf([true], t('FILL_NIF'))
        }),
        checked: Yup.bool().when('is_member', {
          is: true,
          then: Yup.bool()
            .required(t('NO_MEMBER_MATCH'))
            .oneOf([true], t('NO_MEMBER_MATCH'))
        }),
        exists: Yup.bool().when('is_member', {
          is: false,
          then: Yup.bool()
            .required(t('DNI_EXIST'))
            .oneOf([false], t('DNI_EXIST'))
        })
      })
    }),
    Yup.object().shape({
      annual_use: Yup.number().required(
        t('GENERATION_ANNUAL_USE_HELPER_MIN', {
          generationMinAnnualUse: new Intl.NumberFormat('ca').format(
            contributionParams?.generationMinAnnualUse
          )
        })
      ),
      number_of_actions: Yup.number()
        .required(
          t('GENERATION_ACTIONS_HELPER_MIN', {
            generationMinNumActions: new Intl.NumberFormat('ca').format(
              contributionParams?.generationMinNumActions
            )
          })
        )
        .min(
          contributionParams?.generationMinNumActions,
          t('GENERATION_ACTIONS_HELPER_MIN', {
            generationMinNumActions: new Intl.NumberFormat('ca').format(
              contributionParams?.generationMinNumActions
            )
          })
        ),
      //TODO: validar el consum anual i el nombre d'accions energètiques
      payment: Yup.object().shape({
        amount: Yup.number()
          .required(
            t('AMOUNT_HELPER_MIN', {
              amount: new Intl.NumberFormat('ca').format(
                contributionParams?.minContribution
              )
            })
          )
          .min(
            contributionParams?.minContribution,
            t('AMOUNT_HELPER_MIN', {
              amount: new Intl.NumberFormat('ca').format(
                contributionParams?.minContribution
              )
            })
          )
          .max(
            contributionParams?.maxContribution,
            t('AMOUNT_HELPER_MAX', {
              amount: new Intl.NumberFormat('ca').format(
                contributionParams?.maxContribution
              )
            })
          )
          .test(
            'amountStep',
            t('AMOUNT_HELPER_STEP', {
              amount: contributionParams?.contributionStep
            }),
            (value) => value % contributionParams?.contributionStep === 0
          ),
        iban: Yup.string().required(t('IBAN_ERROR')),
        iban_valid: Yup.bool()
          .required(t('IBAN_ERROR'))
          .oneOf([true], t('IBAN_ERROR'))
      })
    })
  ]

  const nextStep = (props) => {
    let next = activeStep + 1
    const last = MAX_STEP_NUMBER
    //This part of code i for the no partners
    /* if (activeStep === 0 && props?.values?.member?.is_member) {
      next++
    } */

    setActiveStep(Math.min(next, last))

    props.submitForm().then(() => {
      if (props.isValid) {
        setActiveStep(Math.min(next, last))
        props.validateForm()
        props.setTouched({})
      }
    })
  }

  const prevStep = (props) => {
    const prev = activeStep - 1
    /*if (activeStep === 2 && props?.values?.member?.is_member) {
      setActiveStep(Math.max(activeStep - 2, 0))
    } else {*/
    setActiveStep(Math.max(0, prev))
    //}

    if (completed) {
      setCompleted(false)
      setError(false)
    }
    props.submitForm().then(() => {
      props.validateForm()
      props.setTouched({})
    })
  }

  const handlePost = async (values) => {
    setSending(true)

    if (!values.member.is_member) {
      const data = normalizeMember(values)
      await member(data)
        .then((response) => {
          if (response?.state === true) {
            setError(false)
            // setResult({ contract_number: response?.data?.soci_num })
            values.member.number = response?.data?.soci_num
          } else {
            setError(true)
          }
        })
        .catch((error) => {
          console.error(error)
          const errorResp = error?.response?.data?.error
            ? error?.response?.data?.error
            : { code: 'UNEXPECTED' }
          setError(errorResp)
        })
    }

    const data = normalizeContribution(values)
    await contribution(data)
      .then((response) => {
        if (response?.state === true) {
          setError(false)
          setResult(response?.data)
        } else {
          setError(true)
        }
      })
      .catch((error) => {
        console.error(error?.response?.data)
        const errorResp = error?.response?.data?.data
          ? error?.response?.data?.data
          : { code: 'UNEXPECTED' }
        setError(errorResp)
      })
    setSending(false)
    setActiveStep(MAX_STEP_NUMBER)
    setCompleted(true)
  }

  return (
    <Formik
      onSubmit={() => {}}
      enableReinitialize
      initialValues={initialValues}
      validationSchema={validationSchemas[activeStep]}
      validateOnMount={true}>
      {(formikProps) => (
        <Form className={classes.root} noValidate autoComplete="off">
          <Container maxWidth="md" disableGutters={true}>
            <Paper elevation={0} className={classes.stepContainer}>
              {activeStep === 0 && (
                <MemberIdentifier
                  {...formikProps}
                  title={t('FORMULARIO GNERATION - trans')}
                />
              )}
              {activeStep === 1 && (
                <GenerationContributionForm {...formikProps} />
              )}
              {activeStep === 2 && <GenerationReview {...formikProps} />}

              {completed && (
                <Box mx={0} mb={1}>
                  {error ? (
                    <Failure error={error} />
                  ) : (
                    <Success
                      description="CONTRIBUTION_OK_MSG"
                      result={result}
                    />
                  )}
                </Box>
              )}

              <Box mx={0} mt={2} mb={3}>
                <div className={classes.actionsContainer}>
                  {result?.investment === undefined && (
                    <Button
                      data-cy="prev"
                      className={classes.button}
                      startIcon={<ArrowBackIosIcon />}
                      disabled={activeStep === 0 || sending}
                      onClick={() => prevStep(formikProps)}>
                      {t('PAS_ANTERIOR')}
                    </Button>
                  )}
                  {activeStep < MAX_STEP_NUMBER - 1 ? (
                    <Button
                      type="button"
                      data-cy="next"
                      className={classes.button}
                      variant="contained"
                      color="primary"
                      endIcon={<ArrowForwardIosIcon />}
                      disabled={!formikProps.isValid}
                      onClick={() => nextStep(formikProps)}>
                      {t('SEGUENT_PAS')}
                    </Button>
                  ) : (
                    !completed && (
                      <Button
                        type="button"
                        data-cy="submit"
                        className={classes.button}
                        variant="contained"
                        color="primary"
                        startIcon={
                          sending ? (
                            <CircularProgress size={24} />
                          ) : (
                            <SendIcon />
                          )
                        }
                        disabled={sending || !formikProps.isValid}
                        onClick={() => handlePost(formikProps.values)}>
                        {t('SEND')}
                      </Button>
                    )
                  )}
                </div>
              </Box>
            </Paper>
            {showInspector && <DisplayFormikState {...formikProps} />}
          </Container>
        </Form>
      )}
    </Formik>
  )
}

export default GenerationContribution

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    color: theme.palette.text.primary
  },
  stepContainer: {
    marginTop: 0,
    marginBottom: theme.spacing(4),
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.backgroundColor
  },
  step: {
    position: 'absolute',
    width: '100%'
  },
  actionsContainer: {
    display: 'flex',
    justifyContent: 'space-between'
  }
}))
