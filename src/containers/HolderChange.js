import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'

import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'

import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'

import VAT from './HolderChange/VAT'
import CUPS from './HolderChange/CUPS'
import PersonalData from './HolderChange/PersonalData'
import BecomeMember from './HolderChange/BecomeMember'
import VoluntaryCent from './HolderChange/VoluntaryCent'
import SpecialCases from './HolderChange/SpecialCases'
import IBAN from './HolderChange/IBAN'
import Review from './HolderChange/Review'

import { checkVat } from '../services/api'

import DisplayFormikState from '../components/DisplayFormikState'

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative'
  },
  stepContainer: {
    marginTop: theme.spacing(4),
    width: '100%',
    display: 'flex',
    flexDirection: 'column'
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

function HolderChange (props) {
  const classes = useStyles()
  const { t, i18n } = useTranslation()

  const [showAll, setShowAll] = useState(false)
  const [activeStep, setActiveStep] = useState(0)

  const validationSchemas = [
    Yup.object().shape({
      holder: Yup.object().shape({
        vat: Yup.string().required(t('FILL_NIF')),
        vatvalid: Yup.bool().required(t('FILL_NIF'))
          .oneOf([true], t('FILL_NIF'))
      })
    }),
    Yup.object().shape({
      supply_point: Yup.object().shape({
        cups: Yup.string().required(t('CUPS_INVALID'))
          .min(18, t('CUPS_INVALID'))
          .test('statusError',
            t('CUPS_INVALID'),
            function () { return !(this.parent.status === 'error') })
          .test('statusError',
            t('CUPS_IN_PROCESS'),
            function () { return !(this.parent.status === 'busy') })
          .test('statusNew',
            t('CUPS_SHOULD_BE_ACTIVE'),
            function () { return !(this.parent.status === 'new') })
          .test('statusInvalid',
            t('INVALID_SUPPLY_POINT_CUPS'),
            function () { return !(this.parent.status === 'invalid') }),
        verified: Yup.bool().required(t('MARK_ADDRESS_CONFIRMATION_BOX'))
          .oneOf([true], t('MARK_ADDRESS_CONFIRMATION_BOX'))
      })
    }),
    Yup.object().shape({
      privacy_policy_accepted: Yup.bool()
        .required(t('UNACCEPTED_PRIVACY_POLICY'))
        .oneOf([true], t('UNACCEPTED_PRIVACY_POLICY')),
      holder: Yup.object().shape({
        name: Yup.string()
          .required(t('NO_NAME')),
        surname1: Yup.string()
          .when('isphisical', {
            is: true,
            then: Yup.string()
              .required(t('NO_SURNAME1'))
          }),
        proxyname: Yup.string()
          .when('isphisical', {
            is: false,
            then: Yup.string()
              .required(t('NO_PROXY_NAME'))
          }),
        proxynif: Yup.string()
          .when('isphisical', {
            is: false,
            then: Yup.string()
              .required(t('NO_PROXY_NIF'))
          }),
        proxynif_valid: Yup.bool()
          .when('isphisical', {
            is: false,
            then: Yup.bool().required(t('FILL_NIF'))
              .oneOf([true], t('FILL_NIF'))
          }),
        address: Yup.string()
          .required(t('NO_ADDRESS')),
        postal_code: Yup.string()
          .required(t('NO_POSTALCODE')),
        state: Yup.string()
          .required(t('NO_STATE')),
        city: Yup.string()
          .required(t('NO_CITY')),
        email: Yup.string()
          .required(t('NO_EMAIL'))
          .email(t('NO_EMAIL')),
        email2: Yup.string()
          .test('repeatEmail',
            t('NO_REPEATED_EMAIL'),
            function () {
              return this.parent.email === this.parent.email2
            }),
        phone1: Yup.string()
          .min(9, t('NO_PHONE'))
          .required(t('NO_PHONE')),
        language: Yup.string().required(t('NO_LANGUAGE'))
      })
    })
  ]

  const MAX_STEP_NUMBER = 7

  const getActiveStep = (props) => {
    return <>
      { activeStep === 0 &&
        <VAT {...props} />
      }
      { activeStep === 1 &&
        <CUPS {...props} />
      }
      { activeStep === 2 &&
        <PersonalData {...props} />
      }
      { activeStep === 3 &&
        <BecomeMember {...props} />
      }
      { activeStep === 4 &&
        <VoluntaryCent {...props} />
      }
      { activeStep === 5 &&
        <SpecialCases {...props} />
      }
      { activeStep === 6 &&
        <IBAN {...props} />
      }
      { activeStep === 7 &&
        <Review {...props} />
      }
    </>
  }

  useEffect(() => {
    const language = props.match.params.language
    i18n.changeLanguage(language)
  }, [props.match.params.language])

  const nextStep = props => {
    const next = activeStep + 1
    const last = MAX_STEP_NUMBER
    props.submitForm().then(() => {
      if (props.isValid) {
        setActiveStep(Math.min(next, last))
        props.validateForm()
        props.setTouched({})
      }
    })
  }

  const prevStep = props => {
    const prev = activeStep - 1
    setActiveStep(Math.max(0, prev))
    props.submitForm().then(() => {
      props.validateForm()
      props.setTouched({})
    })
  }

  const handleSubmit = props => {
    console.log('submit', props)
  }

  return (
    <Container maxWidth="md">
      <Formik
        onSubmit={handleSubmit}
        enableReinitialize
        initialValues={{
          holder: {
            vat: 'C35875459',
            vatvalid: false,
            isphisical: true,
            proxynif_valid: false,
            state: '',
            city: '',
            language: i18n.language
          },
          supply_point: {
            cups: 'ES0031101322018013GN0F',
            status: false,
            address: '',
            verified: false
          },
          privacy_policy_accepted: false
        }}
        validationSchema={validationSchemas[activeStep]}
        validateOnMount={true}
      >
        {props => (
          <>
            <div>
              <Form className={classes.root} noValidate>
                {
                  <Paper elevation={3} className={classes.stepContainer}>
                    <Box mx={4} mb={3}>
                      {getActiveStep(props)}
                    </Box>
                    <Box mx={4} my={3}>
                      <div className={classes.actionsContainer}>
                        {
                          <Button
                            className={classes.button}
                            startIcon={<ArrowBackIosIcon />}
                            disabled={(activeStep === 0)}
                            onClick={() => prevStep(props)}
                          >
                            {t('PAS_ANTERIOR')}
                          </Button>
                        }
                        {
                          <Button
                            type="button"
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            endIcon={<ArrowForwardIosIcon />}
                            disabled={!props.isValid}
                            onClick={() => nextStep(props)}
                          >
                            {t('SEGUENT_PAS')}
                          </Button>
                        }
                      </div>
                    </Box>
                  </Paper>
                }
              </Form>
            </div>
            <DisplayFormikState {...props} />
          </>
        )}
      </Formik>
    </Container>
  )
}

export default HolderChange
