import React from 'react'

import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'

import { Formik } from 'formik'
import * as Yup from 'yup'

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

export default function Contact ({ nextStep, prevStep, handleStepChanges, params }) {
  const classes = useStyles()
  const { t } = useTranslation()

  const ContactSchema = Yup.object().shape({
    contact_name: Yup.string()
      .required(t('NO_NAME')),
    contact_surname: Yup.string()
      .required(t('NO_SURNAME')),
    phone: Yup.string()
      .matches(/^\d{9}$/, t('NO_PHONE'))
      .required(t('NO_PHONE'))
  })

  return (
    <div>
      <Formik
        initialValues={
          {
            ...{
              contact_name: '',
              contact_surname: '',
              phone: ''
            },
            ...params
          }
        }
        validationSchema={ContactSchema}
        onSubmit={(values, { setSubmitting }) => {
          handleStepChanges({ contact: values })
          nextStep()
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting
          /* and other goodies */
        }) => (
          <form onSubmit={handleSubmit}>
            <Box mx={1} mt={2} mb={1}>
              <Typography
                dangerouslySetInnerHTML={{ __html: t('HELP_CONTACT_INFO') }}
              />
            </Box>
            <Box mx={1} mb={3}>
              <TextField
                id="contact_name"
                name="contact_name"
                label={t('NAME') + ' *'}
                error={(errors.contact_name && touched.contact_name)}
                helperText={(touched.contact_name && errors.contact_name)}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.contact_name}
                fullWidth
                variant="outlined"
                margin="normal"
              />
              <TextField
                id="contact_surname"
                name="contact_surname"
                label={t('SURNAME') + ' *'}
                error={(errors.contact_surname && touched.contact_surname)}
                helperText={(touched.contact_surname && errors.contact_surname)}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.contact_surname}
                fullWidth
                variant="outlined"
                margin="normal"
              />
              <TextField
                id="phone"
                name="phone"
                label={t('PHONE') + ' *'}
                error={(errors.phone && touched.phone)}
                helperText={(touched.phone && errors.phone)}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.phone}
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
                  type="submit"
                  className={classes.button}
                  color="primary"
                  variant="contained"
                >
                  {t('SEGUENT_PAS')}
                </Button>
              }
            </div>
          </form>
        )}
      </Formik>
    </div>
  )
}
