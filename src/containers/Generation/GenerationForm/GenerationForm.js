import React, { useState, useEffect, useCallback } from 'react'

import { useTranslation } from 'react-i18next'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { useParams } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'

import Box from '@material-ui/core/Box'
import CircularProgress from '@material-ui/core/CircularProgress'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'

import DisplayFormikState from '../../../components/DisplayFormikState'

import SendIcon from '@material-ui/icons/Send'

import GenerationMemberIdentifier from './GenerationMemberIdentifier'
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
import PrevButton from 'components/Buttons/PrevButton'
import NextButton from 'components/Buttons/NextButton'
import SubmitButton from 'components/Buttons/SubmitButton'
import ExitButton from 'components/Buttons/ExitButton'
import PersonalData from '../../HolderChange/PersonalData'

const MAX_STEP_NUMBER = 4

const GenerationContribution = (props) => {
  const classes = useStyles()
  const { t, i18n } = useTranslation()
  const { language } = useParams()

  const [activeStep, setActiveStep] = useState(0)
  const [sending, setSending] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [error, setError] = useState(false)
  const [result, setResult] = useState({})

  useEffect(() => {
    i18n.changeLanguage(language)
  }, [language, i18n])

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
      language: `${i18n.language}_ES`,
      has_generation_enabled_zone: true,
      postal_code_checked: false,
      generation_zone_checked: false
    },
    payment: {
      amount: '',
      iban: '',
      payment_method: 'iban',
      sepa_accepted: false
    },
    number_of_actions: 0,
    annual_use: 0,
    privacy_policy_accepted: false,
    percent_over_annual_use: 0
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
      member: Yup.object().shape({
        name: Yup.string().required(t('NO_NAME')),
        surname1: Yup.string().when('isphisical', {
          is: true,
          then: Yup.string().required(t('NO_SURNAME1'))
        }),
        proxyname: Yup.string().when('isphisical', {
          is: false,
          then: Yup.string().required(t('NO_PROXY_NAME'))
        }),
        proxynif: Yup.string().when('isphisical', {
          is: false,
          then: Yup.string().required(t('NO_PROXY_NIF'))
        }),
        proxynif_valid: Yup.bool().when('isphisical', {
          is: false,
          then: Yup.bool().required(t('FILL_NIF')).oneOf([true], t('FILL_NIF'))
        }),
        address: Yup.string().required(t('NO_ADDRESS')),
        postal_code: Yup.string()
          .matches(/^\d*$/, t('NO_POSTALCODE'))
          .required(t('NO_POSTALCODE')),
        state: Yup.object().shape({
          id: Yup.number().required(t('NO_STATE'))
        }),
        city: Yup.object().shape({
          id: Yup.number().required(t('NO_CITY'))
        }),
        email: Yup.string().required(t('NO_EMAIL')).email(t('NO_EMAIL')),
        email2: Yup.string().test(
          'repeatEmail',
          t('NO_REPEATED_EMAIL'),
          function () {
            return this.parent.email === this.parent.email2
          }
        ),
        phone1: Yup.string().min(9, t('NO_PHONE')).required(t('NO_PHONE')),
        phone2: Yup.string().min(9, t('NO_PHONE')),
        language: Yup.string().required(t('NO_LANGUAGE'))
      }),
      legal_person_accepted: Yup.bool().test({
        name: 'isTheMemberVat',
        message: t('ACCEPT_LEGAL_PERSON'),
        test: function () {
          return !(
            this.parent.member.isphisical === false &&
            this.parent.legal_person_accepted !== true
          )
        }
      }),
      privacy_policy_accepted: Yup.bool()
        .required(t('UNACCEPTED_PRIVACY_POLICY'))
        .oneOf([true], t('UNACCEPTED_PRIVACY_POLICY'))
    }),
    Yup.object().shape({
      annual_use: Yup.number()
        .required(
          t('GENERATION_ANNUAL_USE_HELPER_MIN', {
            generationMinAnnualUse: new Intl.NumberFormat('ca').format(
              contributionParams?.generationMinAnnualUse
            )
          })
        )
        .min(
          contributionParams?.generationMinAnnualUse,
          t('GENERATION_ANNUAL_USE_MIN', {
            generationMinNumActions: new Intl.NumberFormat('ca').format(
              contributionParams?.generationMinAnnualUse
            )
          })
        )
        .typeError("El valor de l'ús anual no és vàlid!"),
      number_of_actions: Yup.number().required(
        t('GENERATION_ACTIONS_HELPER_MIN', {
          generationMinNumActions: new Intl.NumberFormat('ca').format(
            contributionParams?.generationMinNumActions
          )
        })
      ),
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
    }),
    Yup.object().shape({
      privacy_policy_accepted: Yup.bool()
        .required(t('HAY QUE ACEPTAR LA POLÍTICA DE PRIVACIDAD'))
        .oneOf([true], t('PRIVATE_POLICY'))
    })
  ]

  const nextStep = useCallback(
    (props) => {
      let next = activeStep + 1
      const last = MAX_STEP_NUMBER
      if (activeStep === 0 && props?.values?.member?.is_member) {
        next++
      }

      setActiveStep(Math.min(next, last))

      props.submitForm().then(() => {
        if (props.isValid) {
          setActiveStep(Math.min(next, last))
          props.validateForm()
          props.setTouched({})
        }
      })
    },
    [activeStep]
  )

  const prevStep = useCallback(
    (props) => {
      const prev = activeStep - 1
      if (activeStep === 2 && props?.values?.member?.is_member) {
        setActiveStep(Math.max(activeStep - 2, 0))
      } else {
        setActiveStep(Math.max(0, prev))
      }
      if (completed) {
        setCompleted(false)
        setError(false)
      }
      props.submitForm().then(() => {
        props.validateForm()
        props.setTouched({})
      })
    },
    [activeStep, completed]
  )

  const getNextButton = useCallback(
    (nextStepChecked, canNextStep, formikProps) => { 
      return canNextStep ? (
        <NextButton
          disabled={activeStep === 0 ? !formikProps.isValid || !nextStepChecked : !formikProps.isValid}
          onClick={() => nextStep(formikProps)}
          title={t('SEGUENT_PAS')}
        />
      ) : (
        <ExitButton
          disabled={!formikProps.isValid}
          onClick={() => (window.location.href = '/')}
          title={t('EXIT')}
        />
      )
    },
    [nextStep, t]
  )

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
                <GenerationMemberIdentifier
                  {...formikProps}
                  title={t('GENERATION_FORM_TITLE')}
                />
              )}
              {activeStep === 1 && (
                <PersonalData {...formikProps} entity="member" />
              )}
              {activeStep === 2 && (
                <GenerationContributionForm {...formikProps} />
              )}
              {activeStep === 3 && <GenerationReview {...formikProps} />}

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
                    <PrevButton
                      disabled={activeStep === 0 || sending}
                      onClick={() => prevStep(formikProps)}
                      title={t('PAS_ANTERIOR')}
                    />
                  )}
                  {activeStep < MAX_STEP_NUMBER - 1
                    ? getNextButton(
                        formikProps.values.member.generation_zone_checked,
                        formikProps.values.member.has_generation_enabled_zone,
                        formikProps
                      )
                    : !completed && (
                        <SubmitButton
                          startIcon={
                            sending ? (
                              <CircularProgress size={24} />
                            ) : (
                              <SendIcon />
                            )
                          }
                          disabled={sending || !formikProps.isValid}
                          onClick={() => handlePost(formikProps.values)}
                          title={t('SEND')}
                        />
                      )}
                </div>
              </Box>
            </Paper>
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
