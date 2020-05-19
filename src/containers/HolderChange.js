import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'

import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import Slide from '@material-ui/core/Slide'

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

import DisplayFormikState from '../components/DisplayFormikState'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  stepContainer: {
    marginTop: theme.spacing(4),
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

  const [showAll, setShowAll] = useState(true)
  const [activeStep, setActiveStep] = useState(0)
  const [isValidated, setValidated] = useState(true)

  const wizardSteps = [
    <VAT validate={setValidated} />,
    <CUPS validate={setValidated} />,
    <PersonalData validate={setValidated} />,
    <BecomeMember validate={setValidated} />,
    <VoluntaryCent validate={setValidated} />,
    <SpecialCases validate={setValidated} />,
    <IBAN validate={setValidated} />,
    <Review validate={setValidated} />
  ]

  const getWizardSteps = (props) => {
    return [
      <VAT validate={setValidated} {...props} />,
      <CUPS validate={setValidated} {...props} />,
      <PersonalData validate={setValidated} {...props} />,
      <BecomeMember validate={setValidated} {...props} />,
      <VoluntaryCent validate={setValidated} {...props} />,
      <SpecialCases validate={setValidated} {...props} />,
      <IBAN validate={setValidated} {...props} />,
      <Review validate={setValidated} {...props} />
    ]
  }

  const validationSchemas = [
    Yup.object().shape({
      nif: Yup.string().required(t('FILL_NIF'))
    }),
    Yup.object().shape({
      field2: Yup.string().required('Field1 Is Required')
    })
  ]

  useEffect(() => {
    const language = props.match.params.language
    i18n.changeLanguage(language)
  }, [props.match.params.language, i18n])

  const nextStep = props => {
    console.log('Next step')
    const next = activeStep + 1
    const last = wizardSteps.length - 1
    props.submitForm().then(() => {
      if (props.isValid) {
        props.validateForm()
        props.setTouched({})
        setActiveStep(Math.min(next, last))
      }
    })
  }

  const prevStep = () => {
    console.log('Prev step')
    const prev = activeStep - 1
    setActiveStep(Math.max(0, prev))
  }

  const handleSubmit = props => {
    console.log(props)
  }

  return (
    <Container maxWidth="md" className={classes.root}>
      <Formik
        onSubmit={handleSubmit}
        enableReinitialize
        initialValues={{ nif: '', cups: '' }}
        validationSchema={validationSchemas[activeStep]}
        render={props => (
          <Form>
            {
              getWizardSteps(props).map((step, index) => (
                <Slide key={index} direction="right" in={showAll || index === activeStep}>
                  <Paper elevation={3} className={classes.stepContainer}>
                    <Box mx={4} my={3}>
                      {step}
                    </Box>
                    <Box mx={4} my={3}>
                      <div className={classes.actionsContainer}>
                        {
                          <Button
                            className={classes.button}
                            startIcon={<ArrowBackIosIcon />}
                            disabled={(activeStep === 0)}
                            onClick={prevStep}
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
                            onClick={ () => nextStep(props)}
                          >
                            {t('SEGUENT_PAS')}
                          </Button>
                        }
                      </div>
                    </Box>
                  </Paper>
                </Slide>
              ))
            }
            <DisplayFormikState {...props} />
          </Form>
        )}
      />
    </Container>
  )
}

export default HolderChange
