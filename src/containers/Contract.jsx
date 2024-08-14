import React, { useState, useEffect } from 'react'
import ReactGA from 'react-ga'
import Plausible from 'plausible-tracker'

import { useTranslation } from 'react-i18next'
import { GlobalHotKeys } from 'react-hotkeys'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { useParams } from 'react-router-dom'

import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import LinearProgress from '@mui/material/LinearProgress'
import Paper from '@mui/material/Paper'

import DisplayFormikState from '../components/DisplayFormikState'


import SendIcon from '@mui/icons-material/Send'

import MemberIdentifier from './Contract/MemberIdentifier'
import CUPS from './Contract/CUPS'
import SupplyPoint from './Contract/SupplyPoint'
import PowerFare from './Contract/PowerFare'
import TariffMode from './Contract/TariffMode'
import SelfConsumption from './Contract/SelfConsumption'
import SelfConsumptionDetails from './Contract/SelfConsumptionDetails'
import HolderIdentifier from './Contract/HolderIdentifier'
import PersonalData from './HolderChange/PersonalData'
import VoluntaryCent from './HolderChange/VoluntaryCent'
import IBAN from './HolderChange/IBAN'
import Review from './Contract/Review'

import Success from './Success'
import Failure from './Failure'

import { getRates, contract } from '../services/api'
import {
  CNAE_HOUSING,
  normalizeContract,
  testPowerForPeriods
} from '../services/utils'

import PrevButton from '../components/Buttons/PrevButton'
import NextButton from '../components/Buttons/NextButton'

const GA_TRACKING_ID = window?.config?.GA_TRAKING_ID

const keyMap = {
  SAMPLE_DATA: 'ctrl+shift+1',
  SHOW_INSPECTOR: 'ctrl+alt+shift+d',
  SHOW_ALL_STEPS: 'ctrl+alt+shift+a'
}

const Contract = (props) => {
  const { t, i18n } = useTranslation()
  const { language } = useParams()
  const {
    is30ContractEnabled = true,
    isIndexedContractEnabled = false,
    isCadastralReference = false,
    isGurbEnabled = false
  } = props

  const [showInspector, setShowInspector] = useState(false)
  const [showAllSteps, setShowAllSteps] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [sending, setSending] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [error, setError] = useState(false)
  const [result, setResult] = useState({})
  const [rates] = useState(getRates())

  useEffect(() => {
    i18n.changeLanguage(language)
  }, [language, i18n])

  const handlers = {
    SAMPLE_DATA: () => {
      const values = { ...initialValues }
    },
    SHOW_INSPECTOR: () => {
      setShowInspector((oldvalue) => !oldvalue)
    },
    SHOW_ALL_STEPS: () => {
      setShowAllSteps((oldvalue) => !oldvalue)
    }
  }

  const validationSchemas = [
    Yup.object().shape({
      member: Yup.object().shape({
        number: Yup.string().required(t('NO_MEMBER_NUMBER')),
        vat: Yup.string()
          .required(t('NO_MEMBER_VAT'))
          .matches(/^[0-9A-Z][0-9]{7}[0-9A-Z]\d*$/, t('INVALID_NIF')),
        checked: Yup.bool()
          .required(t('NO_MEMBER_MATCH'))
          .oneOf([true], t('NO_MEMBER_MATCH'))
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
          .test('statusNew', t('CUPS_IS_ACTIVE'), function () {
            return !(this.parent.status === 'active')
          })
          .test('statusInvalid', t('INVALID_SUPPLY_POINT_CUPS'), function () {
            return !(this.parent.status === 'invalid')
          })
      }),
      contract: Yup.object().shape({
        has_service: Yup.bool()
          .required(t('UNSELECTED_NEW_SUPPLY_POINT'))
          .oneOf([true, false], t('UNSELECTED_NEW_SUPPLY_POINT'))
      })
    }),
    Yup.object().shape({
      supply_point: Yup.object().shape(
        {
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
          is_housing: Yup.bool()
            .oneOf([true, false], t('NO_IS_HOUSING'))
            .test('CnaeNoHousing', t('INVALID_CNAE_NO_HOUSING'), function () {
              return !(
                this.parent.is_housing === false &&
                this.parent.cnae === CNAE_HOUSING
              )
            }),
          cnae: Yup.string()
            .required(t('INVALID_SUPPLY_POINT_CNAE'))
            .min(3, t('INVALID_SUPPLY_POINT_CNAE'))
            .test('CnaeNoHousing', t('INVALID_CNAE_NO_HOUSING'), function () {
              return !(
                this.parent.is_housing === false &&
                this.parent.cnae === CNAE_HOUSING
              )
            }),
          cnae_valid: Yup.bool()
            .required(t('INVALID_SUPPLY_POINT_CNAE'))
            .oneOf([true], t('INVALID_SUPPLY_POINT_CNAE')),
          supply_point_accepted: Yup.bool()
            .required(t('CUPS_VERIFY_LABEL'))
            .oneOf([true], t('CUPS_VERIFY_LABEL')),
          cadastral_reference: Yup.string().when(
            'cadastral_reference_error',
            (cadastral_reference_error) => {
              if (cadastral_reference_error)
                return Yup.string().test({
                  name: 'cadastral_reference_error',
                  test: () => false,
                  message: cadastral_reference_error
                })
              return Yup.string(t('INVALID_REF_CADASTRAL_LENGTH'))
            }
          ),
          cadastral_reference_error: Yup.string().notRequired()
        },
        [['cadastral_reference', 'cadastral_reference']]
      )
    }),
    Yup.object().shape({
      contract: Yup.object().shape({
        phases: Yup.string().when('has_service', {
          is: false,
          then: Yup.string().required(t('NO_MONOPHASE_CHOICE'))
        }),
        rate: Yup.string().when('has_service', {
          is: true,
          then: Yup.string().required(t('NO_FARE_CHOSEN'))
        }),
        moreThan15Kw: Yup.boolean().required(),
        power: Yup.number()
          .required(t('NO_POWER_CHOSEN_PX'))
          .test({
            name: 'minPowerValue',
            test: function () {
              return testPowerForPeriods(
                rates,
                this.parent,
                'min_power',
                this.createError,
                t
              )
            }
          })
          .test({
            name: 'maxPowerValue',
            test: function () {
              return testPowerForPeriods(
                rates,
                this.parent,
                'max_power',
                this.createError,
                t
              )
            }
          }),
        power2: Yup.number()
          .test('required', t('NO_POWER_CHOSEN_PX'), function () {
            return rates[this.parent.rate]?.num_power_periods >= 2
              ? this.parent.power2
              : true
          })
          .test('increasing', t('NO_POWER_INCREASING'), function () {
            return rates[this.parent.rate]?.increasing
              ? parseFloat(this.parent.power2) >= parseFloat(this.parent.power)
              : true
          })
          .test({
            name: 'minPowerValue',
            test: function () {
              return testPowerForPeriods(
                rates,
                this.parent,
                'min_power',
                this.createError,
                t
              )
            }
          })
          .test({
            name: 'maxPowerValue',
            test: function () {
              return testPowerForPeriods(
                rates,
                this.parent,
                'max_power',
                this.createError,
                t
              )
            }
          }),
        power3: Yup.number()
          .test('required', t('NO_POWER_CHOSEN_PX'), function () {
            return rates[this.parent.rate]?.num_power_periods >= 3
              ? this.parent.power3
              : true
          })
          .test('increasing', t('NO_POWER_INCREASING'), function () {
            return rates[this.parent.rate]?.increasing
              ? parseFloat(this.parent.power3) >= parseFloat(this.parent.power2)
              : true
          })
          .test({
            name: 'minPowerValue',
            test: function () {
              return testPowerForPeriods(
                rates,
                this.parent,
                'min_power',
                this.createError,
                t
              )
            }
          })
          .test({
            name: 'maxPowerValue',
            test: function () {
              return testPowerForPeriods(
                rates,
                this.parent,
                'max_power',
                this.createError,
                t
              )
            }
          }),
        power4: Yup.number()
          .test('required', t('NO_POWER_CHOSEN_PX'), function () {
            return rates[this.parent.rate]?.num_power_periods >= 4
              ? this.parent.power4
              : true
          })
          .test('increasing', t('NO_POWER_INCREASING'), function () {
            return rates[this.parent.rate]?.increasing
              ? parseFloat(this.parent.power4) >= parseFloat(this.parent.power3)
              : true
          })
          .test({
            name: 'minPowerValue',
            test: function () {
              return testPowerForPeriods(
                rates,
                this.parent,
                'min_power',
                this.createError,
                t
              )
            }
          })
          .test({
            name: 'maxPowerValue',
            test: function () {
              return testPowerForPeriods(
                rates,
                this.parent,
                'max_power',
                this.createError,
                t
              )
            }
          }),
        power5: Yup.number()
          .test('required', t('NO_POWER_CHOSEN_PX'), function () {
            return rates[this.parent.rate]?.num_power_periods >= 5
              ? this.parent.power5
              : true
          })
          .test('increasing', t('NO_POWER_INCREASING'), function () {
            return rates[this.parent.rate]?.increasing
              ? parseFloat(this.parent.power5) >= parseFloat(this.parent.power4)
              : true
          })
          .test({
            name: 'minPowerValue',
            test: function () {
              return testPowerForPeriods(
                rates,
                this.parent,
                'min_power',
                this.createError,
                t
              )
            }
          })
          .test({
            name: 'maxPowerValue',
            test: function () {
              return testPowerForPeriods(
                rates,
                this.parent,
                'max_power',
                this.createError,
                t
              )
            }
          }),
        power6: Yup.number()
          .test('required', t('NO_POWER_CHOSEN_PX'), function () {
            return rates[this.parent.rate]?.num_power_periods >= 6
              ? this.parent.power6
              : true
          })
          .test('increasing', t('NO_POWER_INCREASING'), function () {
            return rates[this.parent.rate]?.increasing
              ? parseFloat(this.parent.power6) >= parseFloat(this.parent.power5)
              : true
          })
          .test({
            name: 'minPowerValue',
            test: function () {
              return testPowerForPeriods(
                rates,
                this.parent,
                'min_power',
                this.createError,
                t
              )
            }
          })
          .test({
            name: 'maxPowerValue',
            test: function () {
              return testPowerForPeriods(
                rates,
                this.parent,
                'max_power',
                this.createError,
                t
              )
            }
          })
      })
    }),
    Yup.object().shape({
      contract: Yup.object().shape({
        isIndexed: Yup.bool().required()
      })
    }),
    Yup.object().shape({
      self_consumption: Yup.object().shape({
        have_installation: Yup.bool().required(
          t('FILL_SELFCONSUMPTION_QUESTION')
        )
      })
    }),
    Yup.object().shape({
      self_consumption: Yup.object().shape({
        cau: Yup.string().when('cau_error', (cau_error) => {
          if (cau_error)
            return Yup.mixed().test({
              name: 'cau_error',
              test: () => false,
              message: cau_error
            })
          return Yup.string().required(t('FILL_SELFCONSUMPTION_CAU'))
        }),
        cau_error: Yup.mixed().oneOf([Yup.bool(), Yup.string()]),
        collective_installation: Yup.bool().required(
          t('FILL_SELFCONSUMPTION_COLLECTIVE_INSTALLATION')
        ),
        installation_power: Yup.number().required(
          t('FILL_SELFCONSUMPTION_INSTALLATION_POWER')
        ),
        installation_type: Yup.string().required(
          t('FILL_SELFCONSUMPTION_INSTALLATION_SITUATION')
        ),
        technology: Yup.string().required(t('FILL_SELFCONSUMPTION_TECHNOLOGY')),
        aux_services: Yup.bool().required(
          t('FILL_SELFCONSUMPTION_AUX_SERVICES')
        )
      })
    }),
    Yup.object().shape({
      holder: Yup.object().shape({
        previous_holder: Yup.bool()
          .required(t('FILL_PREVIOUS_HOLDER'))
          .oneOf([true, false], t('FILL_PREVIOUS_HOLDER')),
        vat: Yup.string()
          .required(t('FILL_NIF'))
          .matches(/^[0-9A-Z][0-9]{7}[0-9A-Z]\d*$/, t('INVALID_NIF')),
        vatvalid: Yup.bool()
          .required(t('FILL_NIF'))
          .oneOf([true], t('FILL_NIF'))
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
        address: Yup.string().required(t('NO_ADDRESS')),
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
        email2: Yup.string()
          .required(t('NO_EMAIL'))
          .test('repeatEmail', t('NO_REPEATED_EMAIL'), function () {
            return this.parent.email === this.parent.email2
          }),
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
        .oneOf([true], t('UNACCEPTED_TERMS')),
      particular_contract_terms_accepted: Yup.bool()
        .required(t('UNACCEPTED_TERMS'))
        .oneOf([true], t('UNACCEPTED_TERMS')),
      privacy_policy_accepted: Yup.bool()
        .required(t('UNACCEPTED_PRIVACY_POLICY'))
        .oneOf([true], t('UNACCEPTED_PRIVACY_POLICY'))
    })
  ]

  const showProgress = false

  const steps = [
    <MemberIdentifier />,
    <CUPS />,
    <SupplyPoint />,
    <PowerFare />,
    <TariffMode />,
    <SelfConsumption />,
    <SelfConsumptionDetails />,
    <HolderIdentifier />,
    <PersonalData />,
    <VoluntaryCent />,
    <IBAN />,
    <Review />
  ]
  const memberIdentifierPage = 0
  const cupsPage = 1
  const supplyPointPage = 2
  const powerFarePage = 3
  const tariffModePage = 4
  const selfConsumptionPage = 5
  const selfConsumptionDetailsPage = 6
  const holderIdentifierPage = 7
  const personalDataPage = 8
  const voluntaryCentPage = 9
  const ibanPage = 10
  const reviewPage = 11

  const maxStepNumber = steps.length

  useEffect(() => {
    // matomo.push(['trackEvent', 'Event Category', 'Event Action', 'Event Name'])
    _paq.push([
      'trackEvent',
      'Contract',
      'setContractStep',
      `contract-step-${activeStep}`
    ])
  }, [activeStep])

  const getActiveStep = (props) => {
    const url = t('DATA_PROTECTION_CONTRACT_URL')
    return (
      <>
        {(showAllSteps || activeStep === memberIdentifierPage) && (
          <MemberIdentifier
            {...props}
            is30ContractEnabled={is30ContractEnabled}
          />
        )}
        {(showAllSteps || activeStep === cupsPage) && <CUPS {...props} />}
        {(showAllSteps || activeStep === supplyPointPage) && (
          <SupplyPoint
            isCadastralReference={isCadastralReference}
            isGurbEnabled={isGurbEnabled}
            {...props}
          />
        )}
        {(showAllSteps || activeStep === powerFarePage) && (
          <PowerFare
            rates={rates}
            isIndexedContractEnabled={isIndexedContractEnabled}
            is30ContractEnabled={is30ContractEnabled}
            {...props}
          />
        )}
        {(showAllSteps || activeStep === tariffModePage) && (
          <TariffMode {...props} />
        )}
        {(showAllSteps || activeStep === selfConsumptionPage) && (
          <SelfConsumption {...props} />
        )}
        {(showAllSteps || activeStep === selfConsumptionDetailsPage) && (
          <SelfConsumptionDetails {...props} />
        )}
        {(showAllSteps || activeStep === holderIdentifierPage) && (
          <HolderIdentifier {...props} />
        )}
        {(showAllSteps || activeStep === personalDataPage) && (
          <PersonalData skipPrivacyPolicy url={url} {...props} />
        )}
        {(showAllSteps || activeStep === voluntaryCentPage) && (
          <VoluntaryCent {...props} />
        )}
        {(showAllSteps || activeStep === ibanPage) && <IBAN {...props} />}
        {(showAllSteps || activeStep === reviewPage) && (
          <Review
            isIndexedContractEnabled={isIndexedContractEnabled}
            {...props}
          />
        )}
      </>
    )
  }

  const nextStep = (props) => {
    let next = activeStep + 1

    // If indexed contracts are not enabled, skip tariffModePage
    if (next === tariffModePage && !isIndexedContractEnabled) {
      next++
    }

    // If the contract has no service, do not ask about self consumption
    if (next === selfConsumptionPage && !props.values.contract.has_service) {
      next++
    }

    // If no self consumption, do not ask for details
    if (
      next === selfConsumptionDetailsPage &&
      !props.values.self_consumption.have_installation
    ) {
      next++
    }

    // If the owner is the member, do not ask personal data
    if (
      next === personalDataPage &&
      props.values.holder.vat === props.values.member.vat &&
      props.values.holder.isphisical
    ) {
      next++
    }

    const last = maxStepNumber
    setActiveStep(Math.min(next, last))

    props.submitForm().then(() => {
      if (props.isValid) {
        props.validateForm()
        props.setTouched({})
      }
    })
  }

  const prevStep = (props) => {
    let prev = activeStep - 1
    // Skip holder personal data unless holder is not member or judiric
    if (
      prev === personalDataPage &&
      props.values.holder.vat === props.values.member.vat &&
      props.values.holder.isphisical
    ) {
      prev--
    }
    // Skip selfConsumptionDetailsPage if has no self consumption installation
    if (
      prev === selfConsumptionDetailsPage &&
      !props.values.self_consumption.have_installation
    ) {
      prev--
    }
    // Skip selfConsumption choice if the supply point has no service
    if (prev === selfConsumptionPage && !props.values.contract.has_service) {
      prev--
    }

    // If indexed contracts are not enabled, skip tariffModePage
    if (prev === tariffModePage && !isIndexedContractEnabled) {
      prev--
    }

    setActiveStep(Math.max(0, prev))
    if (completed) {
      setCompleted(false)
      setError(false)
    }
    props.submitForm().then(() => {
      props.validateForm()
      props.setTouched({})
    })
  }

  const initialValues = {
    holder: {
      vat: '',
      vatvalid: false,
      previous_holder: '',
      isphisical: true,
      proxynif_valid: false,
      proxynif: '',
      proxyname: '',
      name: '',
      address: '',
      number: '',
      floor: '',
      door: '',
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
    supply_point: {
      cups: '',
      status: false,
      address: '',
      number: '',
      floor: '',
      door: '',
      postal_code: '',
      state: { id: '' },
      city: { id: '' },
      is_housing: '',
      cnae: '',
      cnae_valid: false,
      cadastral_reference: '',
      cadastral_reference_error: undefined,
      attachments: [],
      supply_point_accepted: false,
      lat: false,
      long: false,
      coordinates_accuracy: ''
    },
    self_consumption: {
      have_installation: ''
    },
    contract: {
      has_service: '',
      rate: '',
      power: '',
      power2: '',
      power3: '',
      phases: '',
      fare: '',
      moreThan15Kw: false,
      isIndexed: ''
    },
    member: {
      number: '',
      vat: '',
      full_name: '',
      checked: false,
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
      iban: '',
      sepa_accepted: false,
      voluntary_cent: ''
    },
    privacy_policy_accepted: false,
    terms_accepted: false,
    particular_contract_terms_accepted: false,
    legal_person_accepted: false
  }

  const plausible = Plausible({
    domain: import.meta.env.VITE_PLAUSIBLE_TRACK_DOMAIN,
    apiHost: import.meta.env.VITE_PLAUSIBLE_APIHOST_URL
  })

  const trackSucces = () => {
    // matomo.push(['trackEvent', 'Event Category', 'Event Action', 'Event Name'])
    _paq.push(['trackEvent', 'Contract', 'contractFormOk', 'send-contract-ok'])
    // end matomo
    plausible.trackPageview({
      url:
        window.location.protocol +
        '//' +
        window.location.hostname +
        '/es/contratacion-realizada/'
    })

    ReactGA.initialize(GA_TRACKING_ID)
    ReactGA.pageview('/es/contratacion-realizada/')
  }

  const handlePost = async (values) => {
    setSending(true)
    // matomo.push(['trackEvent', 'Event Category', 'Event Action', 'Event Name'])
    _paq.push(['trackEvent', 'Send', 'sendContractClick', 'send-contract'])
    const data = normalizeContract(values)
    await contract(data)
      .then((response) => {
        if (response?.state === true) {
          setError(false)
          setResult({ contract_number: response?.data?.contract_number })
          trackSucces()
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
    setSending(false)
    setActiveStep(maxStepNumber)
    setCompleted(true)
  }

  return (
    <GlobalHotKeys handlers={handlers} keyMap={keyMap}>
      <Container maxWidth="md" disableGutters={true}>
        <Formik
          onSubmit={() => { }}
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchemas[activeStep]}
          validateOnMount={true}>
          {(props) => (
            <>
              <Box>
                <Form
                  sx={{
                    position: 'relative',
                    color: 'text.primary'
                  }}
                  noValidate
                  autoComplete="off">
                  {
                    <Paper
                      elevation={0}
                      sx={{
                        mt: 0,
                        mb: 4,
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        backgroundColor: 'background.default'
                      }}>
                      {showProgress && (
                        <LinearProgress
                          variant={sending ? 'indeterminate' : 'determinate'}
                          value={(activeStep / maxStepNumber) * 100}
                        />
                      )}

                      <Box mx={0} mb={3}>
                        {completed ? (
                          error ? (
                            <Failure error={error} />
                          ) : (
                            <Success result={result} />
                          )
                        ) : (
                          getActiveStep(props)
                        )}
                      </Box>
                      <Box mx={0} mt={1} mb={3}>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between'
                          }}>
                          {result?.contract_number === undefined && (
                            <PrevButton
                              disabled={activeStep === 0 || sending}
                              onClick={() => prevStep(props)}
                              title={t('PAS_ANTERIOR')}
                            />
                          )}
                          {activeStep < maxStepNumber - 1 ? (
                            <NextButton
                              disabled={!props.isValid}
                              onClick={() => nextStep(props)}
                              title={t('SEGUENT_PAS')}
                            />                        
                          ) : (
                            !completed && (
                              <Button
                                type="button"
                                data-cy="submit"
                                variant="contained"
                                color="primary"
                                startIcon={
                                  sending ? (
                                    <CircularProgress size={24} />
                                  ) : (
                                    <SendIcon />
                                  )
                                }
                                disabled={sending || !props.isValid}
                                onClick={() => handlePost(props.values)}>
                                {t('SEND')}
                              </Button>
                            )
                          )}
                        </Box>
                      </Box>
                    </Paper>
                  }
                </Form>
              </Box>
              {showInspector && (
                <>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setShowAllSteps(!showAllSteps)}>
                    Show all steps
                  </Button>
                  <DisplayFormikState {...props} />
                </>
              )}
            </>
          )}
        </Formik>
      </Container>
    </GlobalHotKeys>
  )
}

export default Contract
