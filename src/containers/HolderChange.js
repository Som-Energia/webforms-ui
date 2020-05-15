import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

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
  },
  withoutLabel: {
    marginTop: theme.spacing(3)
  },
  textField: {
    width: '25ch'
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
    <VoluntaryCent validate={setValidated} />
  ]

  useEffect(() => {
    const language = props.match.params.language
    i18n.changeLanguage(language)
  }, [props.match.params.language, i18n])

  const getCurrentStep = () => {
    return wizardSteps[activeStep]
  }

  const nextStep = () => {
    const next = activeStep + 1
    return (next < wizardSteps.length) ? setActiveStep(next) : null
  }

  const backStep = () => {
    const back = activeStep - 1
    return (back >= 0) ? setActiveStep(back) : null
  }

  return (
    <Container maxWidth="md" className={classes.root}>
      {
        wizardSteps.map((step, index) => (
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
                      onClick={backStep}
                    >
                      {t('PAS_ANTERIOR')}
                    </Button>
                  }
                  {
                    <Button
                      type="submit"
                      className={classes.button}
                      variant="contained"
                      color="primary"
                      endIcon={<ArrowForwardIosIcon />}
                      disabled={!isValidated}
                      onClick={nextStep}
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
    </Container>
  )
}

export default HolderChange
