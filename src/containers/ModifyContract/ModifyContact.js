import React, { Component } from 'react'
import { useTranslation } from 'react-i18next'

import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%'
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  actionsContainer: {
    marginBottom: theme.spacing(2)
  },
  resetContainer: {
    padding: theme.spacing(3)
  },
  stepLabel: {
    fontSize: '1.5rem',
    color: 'red'
  }
}))

export default function ModifyParams ({ nextStep, prevStep, handleChange }) {
  const classes = useStyles()
  const { t } = useTranslation()
  return (
    <div>
      MODIFY_POTTAR_CONTACT
      <Box mx={3} mb={3}>
        <TextField
          id="contact_name"
          name="contact_name"
          label="Nom"
          value=""
          helperText=""
          onChange={handleChange}
          required
          fullWidth
          variant="outlined"
          margin="normal"
        />
      </Box>
      <Box mx={3} mb={3}>
        <TextField
          id="contact_surname"
          name="contact_surname"
          label="Cognoms"
          value=""
          helperText=""
          onChange={handleChange}
          required
          fullWidth
          variant="outlined"
          margin="normal"
        />
      </Box>
      <Box mx={3} mb={3}>
        <TextField
          id="phone"
          name="phone"
          label="Telèfon"
          value=""
          helperText=""
          onChange={handleChange}
          required
          fullWidth
          variant="outlined"
          margin="normal"
        />
      </Box>
      <div className={classes.actionsContainer}>
        {
          prevStep &&
          <Button
            onClick={prevStep}
            className={classes.button}
          >
            {t('PAS_ANTERIOR')}
          </Button>
        }
        {
          nextStep &&
          <Button
            onClick={nextStep}
            className={classes.button}
            color="primary"
            variant="contained"
          >
            {t('SEGUENT_PAS')}
          </Button>
        }
      </div>
    </div>
  )
}
