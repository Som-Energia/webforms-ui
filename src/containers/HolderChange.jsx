import React, { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { GlobalHotKeys } from 'react-hotkeys'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { useParams } from 'react-router-dom'

import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import LinearProgress from '@mui/material/LinearProgress'
import Paper from '@mui/material/Paper'

import SendIcon from '@mui/icons-material/Send'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'

import VAT from './HolderChange/VAT'
import CUPS from './HolderChange/CUPS'
import PersonalData from './HolderChange/PersonalData'
import BecomeMember from './HolderChange/BecomeMember'
import HolderCase from './HolderChange/HolderCase'
import VoluntaryCent from './HolderChange/VoluntaryCent'
import SpecialCases from './HolderChange/SpecialCases'
import IBAN from './HolderChange/IBAN'
import Review from './HolderChange/Review'
import MemberIdentifier from './HolderChange/MemberIdentifier'
import Success from './Success'
import Failure from './Failure'

import data from '../data/HolderChange/data.json'

import DisplayFormikState from '../components/OldComponents/DisplayFormikState'

import { holderChange } from '../services/api'
import {
  normalizeHolderChange,
  isHomeOwnerCommunityNif
} from '../services/utils'
import PrevButton from '../components/OldComponents/Buttons/PrevButton'
import NextButton from '../components/OldComponents/Buttons/NextButton'
import SubmitButton from '../components/OldComponents/Buttons/SubmitButton'

function HolderChange(props) {
  const { t, i18n } = useTranslation()
  const { language } = useParams()

  const { isMemberMandatoryForHolderchange = false } = props

  const [showInspector, setShowInspector] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [sending, setSending] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [error, setError] = useState(false)
  const [result, setResult] = useState({})
  const [isValid, setIsValid] = useState(false)

  const keyMap = {
    SHOW_INSPECTOR: 'ctrl+alt+shift+d'
  }

  const handlers = {
    SAMPLE_DATA: () => {
      const values = { ...initialValues, ...data }
    },
    SHOW_INSPECTOR: () => {
      setShowInspector(true)
    }
  }

  const validationSchemas = [
    Yup.object().shape({
      holder: Yup.object().shape({
        vat: Yup.string()
          .required(t('FILL_NIF'))
          .matches(/^[0-9A-Z][0-9]{7}[0-9A-Z]\d*$/, t('INVALID_NIF')),
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
          .test('statusBusy', t('CUPS_IN_PROCESS'), function () {
            return !(this.parent.status === 'busy')
          })
          .test('statusNew', t('CUPS_SHOULD_BE_ACTIVE'), function () {
            return !(this.parent.status === 'new')
          })
          .test('statusInactive', t('CUPS_SHOULD_BE_ACTIVE'), function () {
            return !(this.parent.status === 'inactive')
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
      member: Yup.object().shape({
        become_member: Yup.bool()
          .required(t('UNACCEPTED_PRIVACY_POLICY'))
          .oneOf([true, false], t('UNACCEPTED_PRIVACY_POLICY'))
      })
    }),
    Yup.object().shape({
      member: Yup.object().shape({
        link_member: Yup.bool()
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
        /* phone2: Yup.string().min(9, t('NO_PHONE')), */
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
      payment: Yup.object().shape({
        voluntary_cent: Yup.bool()
          .required(t('NO_VOLUNTARY_DONATION_CHOICE_TAKEN'))
          .oneOf([false, true], t('NO_VOLUNTARY_DONATION_CHOICE_TAKEN'))
      })
    }),
    Yup.object().shape({
      especial_cases: Yup.object()
        .shape({
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
                  .required(t('ELECTRODEP_ATTACH_REQUIRED'))
              })
            }),
          reason_default: Yup.bool(),
          reason_death: Yup.bool(),
          reason_merge: Yup.bool(),
          reason_electrodep: Yup.bool()
        })
        .test(
          'At least one checked',
          t('AT_LEAST_ONE_CHANGE_REASON'),
          function () {
            const {
              reason_death,
              reason_default,
              reason_merge,
              reason_electrodep
            } = this.parent.especial_cases
            if (
              reason_death ||
              reason_default ||
              reason_merge ||
              reason_electrodep
            )
              return true
          }
        )
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

  const MAX_STEP_NUMBER = 10

  const getActiveStep = (props) => {
    const url = t('DATA_PROTECTION_HOLDERCHANGE_URL')
    return (
      <>
        {activeStep === 0 && <VAT {...props} />}
        {activeStep === 1 && <CUPS {...props} />}
        {activeStep === 2 && (
          <BecomeMember
            {...props}
            isMemberMandatoryForHolderchange={isMemberMandatoryForHolderchange}
          />
        )}
        {activeStep === 3 && <HolderCase {...props} />}
        {activeStep === 4 && <MemberIdentifier {...props} />}
        {activeStep === 5 && (
          <PersonalData
            url={url}
            {...props}
            isMemberMandatoryForHolderchange={isMemberMandatoryForHolderchange}
            form='holderchange'
          />
        )}
        {activeStep === 6 && <VoluntaryCent {...props} />}
        {activeStep === 7 && <SpecialCases {...props} />}
        {activeStep === 8 && <IBAN {...props} />}
        {activeStep === 9 && <Review {...props} />}
      </>
    )
  }

  useEffect(() => {
    i18n.changeLanguage(language)
  }, [language, i18n])

  /// True if the step has to be skipped according to the values
  function skipStep(step, values, isBackwards = false) {
    // TODO: backwards ismember was checked with "=== true", check it still works
    // without
    switch (step) {
      case 2: // BecomeMember
        if (values?.holder?.ismember) return true
        if (isHomeOwnerCommunityNif(values?.holder?.vat)) return true
        return false
      case 3: // HolderCase
        if (values?.holder?.ismember) return true
        if (values?.member?.become_member === true) return true
        if (isMemberMandatoryForHolderchange === true) return true
        return false
      case 4: // MemberIdentifier
        if (values?.holder?.ismember) return true
        if (values?.member?.become_member === true) return true
        if (
          isMemberMandatoryForHolderchange === false &&
          values?.member?.link_member === false
        )
          return true
        return false
    }
    return false
  }

  const nextStep = (values, actions, callBack) => {
    let next = activeStep + 1

    while (skipStep(next, values, false)) next++

    const last = MAX_STEP_NUMBER

    const nextStep = Math.min(next, last)
    setActiveStep(nextStep)
    actions.setTouched({})
    actions.setSubmitting(false)
    callBack(nextStep)
  }

  const prevStep = (values, actions, callBack) => {
    let prev = activeStep - 1

    while (skipStep(prev, values, true)) prev--

    const prevStep = Math.max(0, prev)
    setActiveStep(prevStep)
    actions.setTouched({})
    actions.setSubmitting(false)

    if (completed) {
      setCompleted(false)
      setError(false)
    }
    callBack(prevStep)
  }

  const isLastStep = activeStep >= MAX_STEP_NUMBER - 1

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
      supply_point_accepted: false,
      tariff_type: ''
    },
    member: {
      become_member: undefined,
      link_member: undefined,
      invite_token: false,
      checked: false
    },
    payment: {
      iban: '',
      sepa_accepted: false,
      voluntary_cent: undefined
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

  const validateStep = (values, step) => {
    const stepToValidate =
      step !== null && step !== undefined ? step : activeStep
    validationSchemas[stepToValidate]
      .validate(values)
      .then(() => {
        setIsValid(true)
      })
      .catch((e) => {
        setIsValid(false)
      })
  }

  return (
    <GlobalHotKeys handlers={handlers} keyMap={keyMap}>
      <Box sx={{ backgroundColor: 'background.third', color: 'primary.main' }}>
        <Container maxWidth="md">
          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={validationSchemas[activeStep]}
            validateOnMount={true}
            validate={(values) => validateStep(values, activeStep)}
            onSubmit={handleSubmit}>
            {(props) => (
              <>
                <Box className="ov-theme">
                  <Form
                    sx={{ position: 'relative' }}
                    noValidate
                    autoComplete="off">
                    {
                      <Paper
                        elevation={0}
                        sx={{
                          mt: 4,
                          mb: 4,
                          width: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          backgroundColor: 'transparent'
                        }}>
                        <LinearProgress
                          color="primary.mainOrange"
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
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between'
                            }}>
                            {result?.contract_number === undefined && (
                              <PrevButton
                                disabled={activeStep === 0 || sending}
                                onClick={() =>
                                  prevStep(props.values, props, (step) =>
                                    validateStep(
                                      props.values,
                                      step,
                                      props.setErrors
                                    )
                                  )
                                }
                                title={t('PREV')}
                              />
                            )}
                            {!completed && !isLastStep ? (
                              <NextButton
                                onClick={() =>
                                  nextStep(props.values, props, (step) =>
                                    validateStep(props.values, step)
                                  )
                                }
                                disabled={sending || !isValid}
                                title={t('NEXT')}
                              />
                            ) : null}
                            {!completed && isLastStep ? (
                              <SubmitButton
                                loading={sending}
                                startIcon={<SendIcon />}
                                title={t('SEND')}
                                disabled={sending || !isValid}
                              />
                            ) : null}
                          </Box>
                        </Box>
                        <Box mx={0} mt={2} mb={3}>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between'
                            }}>
                            {activeStep === 4 &&
                              isHomeOwnerCommunityNif(
                                props.values?.holder?.vat
                              ) && (
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
                          </Box>
                        </Box>
                      </Paper>
                    }
                  </Form>
                </Box>
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
