import React from 'react'
import { useTranslation } from 'react-i18next'

import { makeStyles } from '@material-ui/core/styles'

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

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
      <Box mx={1} mt={2} mb={1}>
        <Typography
          dangerouslySetInnerHTML={{ __html: t('HELP_CONTACT_INFO') }}
        />
      </Box>
      <Box mx={1} mb={3}>
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
