import React, { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { GlobalHotKeys } from 'react-hotkeys'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { useParams } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import CircularProgress from '@material-ui/core/CircularProgress'
import Container from '@material-ui/core/Container'
import LinearProgress from '@material-ui/core/LinearProgress'
import Paper from '@material-ui/core/Paper'

import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import SendIcon from '@material-ui/icons/Send'
import Typography from '@material-ui/core/Typography'
import Alert from '@material-ui/lab/Alert'


import VAT from './HolderChange/VAT'
import CUPS from './HolderChange/CUPS'
import PersonalData from './HolderChange/PersonalData'
import BecomeMember from './HolderChange/BecomeMember'
import VoluntaryCent from './HolderChange/VoluntaryCent'
import SpecialCases from './HolderChange/SpecialCases'
import IBAN from './HolderChange/IBAN'
import Review from './HolderChange/Review'
import MemberIdentifier from './HolderChange/MemberIdentifier'
import Success from './Success'
import Failure from './Failure'

import data from 'data/HolderChange/data.json'

import DisplayFormikState from 'components/DisplayFormikState'

import { holderChange } from 'services/api'
import { normalizeHolderChange } from 'services/utils'
import { checkIsTariffIndexed } from '../services/utils'

const contractJSON = JSON.parse(
  document.getElementById('contract-data').textContent
)

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#f2f2f2',
    color: theme.palette.text.primary
  },
  form: {
    position: 'relative'
  },
  stepContainer: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'transparent'
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

function HolderChange(props) {
  const classes = useStyles()
  const { t, i18n } = useTranslation()
  const { language } = useParams()

  // const [showAll, setShowAll] = useState(false)
  const [showInspector, setShowInspector] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [sending, setSending] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [error, setError] = useState(false)
  const [result, setResult] = useState({})
  const [isTariffIndexed] = useState(checkIsTariffIndexed(contractJSON.tariff))


  const keyMap = {
    SHOW_INSPECTOR: 'ctrl+alt+shift+d'
  }

  const handlers = {
    SAMPLE_DATA: () => {
      const values = { ...initialValues, ...data }
      console.log(values)
    },
    SHOW_INSPECTOR: () => {
      setShowInspector(true)
    }
  }

  const validationSchemas = [
    Yup.object().shape({
      holder: Yup.object().shape({
        vat: Yup.string().required(t('FILL_NIF')),
        vatvalid: Yup.bool()
          .required(t('FILL_NIF'))
          .oneOf([true], t('FILL_NIF'))
      })
    }),
    Yup.object().shape({
      supply_point: Yup.object().shape({
        cups: Yup.string()
          .required(t('CUPS_INVALID'))
          .min(18, t('CUPS_INVALID'))
          .test('statusError', t('CUPS_INVALID'), function () {
            return !(this.parent.status === 'error')
          })
          .test('statusError', t('CUPS_IN_PROCESS'), function () {
            return !(this.parent.status === 'busy')
          })
          .test('statusNew', t('CUPS_SHOULD_BE_ACTIVE'), function () {
            return !(this.parent.status === 'new')
          })
          .test('statusInvalid', t('INVALID_SUPPLY_POINT_CUPS'), function () {
            return !(this.parent.status === 'invalid')
          }),
        verified: Yup.bool()
          .required(t('MARK_ADDRESS_CONFIRMATION_BOX'))
          .oneOf([true], t('MARK_ADDRESS_CONFIRMATION_BOX')),
        supply_point_accepted: Yup.bool()
          .required(t('CUPS_VERIFY_LABEL'))
          .oneOf([true], t('CUPS_VERIFY_LABEL'))
      })
    }),
    Yup.object().shape({
      holder: Yup.object().shape({
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
        proxynif_phisical: Yup.bool().when('isphisical', {
          is: false,
          then: Yup.bool()
            .required(t('PROXY_NIF_PHISICAL'))
            .oneOf([true], t('PROXY_NIF_PHISICAL'))
        }),
        address: Yup.string().required(t('NO_ADDRESS')),
        number: Yup.string().required(t('NO_NUMBER')),
        postal_code: Yup.string()
          .matches(/^\d*$/, t('NO_POSTALCODE'))
          .required(t('NO_POSTALCODE'))
          .min(5, t('NO_POSTALCODE'))
          .max(5, t('NO_POSTALCODE')),
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
            this.parent.holder.isphisical === false &&
            this.parent.legal_person_accepted !== true
          )
        }
      }),
      privacy_policy_accepted: Yup.bool()
        .required(t('UNACCEPTED_PRIVACY_POLICY'))
        .oneOf([true], t('UNACCEPTED_PRIVACY_POLICY'))
    }),
    Yup.object().shape({
      member: Yup.object().shape({
        become_member: Yup.bool()
          .required(t('UNACCEPTED_PRIVACY_POLICY'))
          .oneOf([true, false], t('UNACCEPTED_PRIVACY_POLICY'))
      })
    }),
    Yup.object().shape({
      member: Yup.object().shape({
        checked: Yup.bool()
          .required(t('UNACCEPTED_PRIVACY_POLICY'))
          .oneOf([true], t('UNACCEPTED_PRIVACY_POLICY'))
      })
    }),
    Yup.object().shape({
      payment: Yup.object().shape({
        voluntary_cent: Yup.bool()
          .required(t('NO_VOLUNTARY_DONATION_CHOICE_TAKEN'))
          .oneOf([false, true], t('NO_VOLUNTARY_DONATION_CHOICE_TAKEN'))
      })
    }),
    Yup.object().shape({
      especial_cases: Yup.object().shape({
        attachments: Yup.object()
          .when('reason_death', {
            is: true,
            then: Yup.object().shape({
              death: Yup.array()
                .min(1, t('ELECTRODEP_ATTACH_REQUIRED'))
                .max(1, t('ELECTRODEP_ATTACH_REQUIRED'))
                .required(t('ELECTRODEP_ATTACH_REQUIRED'))
            })
          })
          .when('reason_electrodep', {
            is: true,
            then: Yup.object().shape({
              medical: Yup.array()
                .min(1, t('ELECTRODEP_ATTACH_REQUIRED'))
                .max(1, t('ELECTRODEP_ATTACH_REQUIRED'))
                .required(t('ELECTRODEP_ATTACH_REQUIRED')),
              resident: Yup.array()
                .min(1, t('ELECTRODEP_ATTACH_REQUIRED'))
                .max(1, t('ELECTRODEP_ATTACH_REQUIRED'))
                .required(t('ELECTRODEP_ATTACH_REQUIRED'))
            })
          })
          .when('reason_merge', {
            is: true,
            then: Yup.object().shape({
              merge: Yup.array()
                .min(1, t('ELECTRODEP_ATTACH_REQUIRED'))
                .max(1, t('ELECTRODEP_ATTACH_REQUIRED'))
                .required(t('ELECTRODEP_ATTACH_REQUIRED')),
            })
          })
      })
    }),
    Yup.object().shape({
      payment: Yup.object().shape({
        iban: Yup.string().required(t('IBAN_ERROR')),
        iban_valid: Yup.bool()
          .required(t('IBAN_ERROR'))
          .oneOf([true], t('IBAN_ERROR')),
        sepa_accepted: Yup.bool()
          .required(t('IBAN_ERROR'))
          .oneOf([true], t('IBAN_ERROR'))
      })
    }),
    Yup.object().shape({
      terms_accepted: Yup.bool()
        .required(t('UNACCEPTED_TERMS'))
        .oneOf([true], t('UNACCEPTED_TERMS'))
    })
  ]

  const MAX_STEP_NUMBER = 9

  const getActiveStep = (props) => {
    const url = t('DATA_PROTECTION_HOLDERCHANGE_URL')
    return (
      <>
        {activeStep === 0 && <VAT {...props} />}
        {activeStep === 1 && <CUPS {...props} />}
        {activeStep === 2 && <PersonalData url={url} {...props} />}
        {activeStep === 3 && <BecomeMember {...props} />}
        {activeStep === 4 && <MemberIdentifier {...props} />}
        {activeStep === 5 && <VoluntaryCent {...props} />}
        {activeStep === 6 && <SpecialCases {...props} />}
        {activeStep === 7 && <IBAN {...props} />}
        {activeStep === 8 && <Review isTariffIndexed={isTariffIndexed} {...props} />}
      </>
    )
  }

  useEffect(() => {
    i18n.changeLanguage(language)
  }, [language, i18n])

  const nextStep = (values, actions) => {
    let next = activeStep + 1
    if (next === 3 && values?.holder?.ismember) {
      next += 2
    }
    if (next === 4 && values?.member?.become_member === true) {
      next++
    }
    // Neighbour comunity cannot become a member
    if (next === 3 && RegExp(/(^[H])/).test(values?.holder?.vat) === true) {
      next += 1
    }

    const last = MAX_STEP_NUMBER
    setActiveStep(Math.min(next, last))
    actions.setTouched({})
    actions.setSubmitting(false)
  }

  const prevStep = (values, actions) => {
    let prev = activeStep - 1
    if (prev === 4 && values?.holder?.ismember === true) {
      prev -= 2
    }
    if (prev === 4 && values?.member?.become_member === true) {
      prev--
    }
    // Neighbour comunity cannot become a member
    if (prev === 3 && RegExp(/(^[H])/).test(values?.holder?.vat) === true) {
      prev -= 1
    }
    setActiveStep(Math.max(0, prev))
    actions.setTouched({})
    actions.setSubmitting(false)

    if (completed) {
      setCompleted(false)
      setError(false)
    }
  }

  const isLastStep = useMemo(
    () => activeStep >= MAX_STEP_NUMBER - 1,
    [activeStep]
  )

  const handleError = async (error) => {
    let errorCode = error?.response?.data?.error?.code || 'UNEXPECTED'
    const errorResp = error?.response?.data?.data || {}

    if (error?.response?.data?.data?.invalid_fields) {
      errorCode =
        Object.keys(
          error?.response?.data?.data?.invalid_fields[0]
        )[0].toUpperCase() +
        '_' +
        errorCode
    }

    errorResp.code = errorCode
    console.error(errorResp)
    setError(errorResp)
    setCompleted(true)
  }

  const handleSubmit = (values, actions) => {
    isLastStep ? handlePost(values) : nextStep(values, actions)
  }

  const handlePost = async (values) => {
    setSending(true)
    const data = normalizeHolderChange(values)
    await holderChange(data)
      .then((response) => {
        const responseData = response?.data ? response.data : {}
        setResult(responseData)
        setError(false)
        setCompleted(true)
      })
      .catch((error) => {
        console.error(error?.response)
        handleError(error)
      })
    setActiveStep(MAX_STEP_NUMBER)
    setSending(false)
  }

  const initialValues = {
    holder: {
      vat: '',
      vatvalid: false,
      isphisical: true,
      proxynif_valid: false,
      proxynif_phisical: true,
      state: { id: '' },
      city: { id: '' },
      proxynif: '',
      proxyname: '',
      name: '',
      address: '',
      number: '',
      floor: '',
      door: '',
      postal_code: '',
      surname1: '',
      surname2: '',
      email: '',
      email2: '',
      phone1: '',
      phone2: '',
      language: `${i18n.language}_ES`
    },
    supply_point: {
      cups: '',
      status: false,
      address: '',
      verified: false,
      supply_point_accepted: false
    },
    member: {
      become_member: '',
      invite_token: false,
      checked: false
    },
    payment: {
      iban: '',
      sepa_accepted: false,
      voluntary_cent: ''
    },
    especial_cases: {
      reason_default: true,
      reason_death: false,
      reason_merge: false,
      reason_electrodep: false,
      attachments: {}
    },
    privacy_policy_accepted: false,
    terms_accepted: false,
    legal_person_accepted: false
  }

  return (
    <GlobalHotKeys handlers={handlers} keyMap={keyMap}>
      <Box className={classes.root}>
        <Container maxWidth="md">
          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={validationSchemas[activeStep]}
            validateOnMount
            onSubmit={handleSubmit}>
            {(props) => (
              <>
                <div className="ov-theme">
                  <Form className={classes.form} noValidate autoComplete="off">
                    {
                      <Paper elevation={0} className={classes.stepContainer}>
                        <LinearProgress
                          variant={sending ? 'indeterminate' : 'determinate'}
                          value={(activeStep / MAX_STEP_NUMBER) * 100}
                        />
                        <>
                          {completed ? (
                            <Box className="step-body">
                              {error ? (
                                <Failure error={error} />
                              ) : (
                                <Success result={result} />
                              )}
                            </Box>
                          ) : (
                            getActiveStep(props)
                          )}
                        </>
                        <Box mx={0} mt={2} mb={3}>
                          <div className={classes.actionsContainer}>
                            {result?.contract_number === undefined && (
                              <Button
                                data-cy="prev"
                                className={classes.button}
                                startIcon={<ArrowBackIosIcon />}
                                disabled={activeStep === 0 || sending}
                                onClick={() => prevStep(props.values, props)}>
                                {t('PAS_ANTERIOR')}
                              </Button>
                            )}
                            {!completed && (
                              <Button
                                type="submit"
                                data-cy="next"
                                className={classes.button}
                                variant="contained"
                                color="primary"
                                startIcon={
                                  isLastStep &&
                                  (sending ? (
                                    <CircularProgress size={24} />
                                  ) : (
                                    <SendIcon />
                                  ))
                                }
                                endIcon={!isLastStep && <ArrowForwardIosIcon />}
                                disabled={sending || !props.isValid}>
                                {!isLastStep ? t('SEGUENT_PAS') : t('SEND')}
                              </Button>
                            )}
                         </div>
                        </Box>
                        <Box mx={0} mt={2} mb={3}>
                          <div className={classes.actionsContainer}>
                            {activeStep === 4 && (RegExp(/(^[H])/).test(props.values?.holder?.vat)) && (
                              <>
                                <Box mt={3}>
                                  <Alert severity="warning">
                                    <Typography
                                      variant="body1"
                                      dangerouslySetInnerHTML={{
                                        __html: t('CIF_COMMUNITY_OWNERS')
                                      }}
                                    />
                                  </Alert>
                                </Box>
                              </>
                            )}
                          </div>
                        </Box>

                      </Paper>
                    }
                  </Form>
                </div>
                {showInspector && <DisplayFormikState {...props} />}
              </>
            )}
          </Formik>
        </Container>
      </Box>
    </GlobalHotKeys>
  )
}

export default HolderChange
