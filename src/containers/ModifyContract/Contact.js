import React from 'react'

import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'

import { Formik } from 'formik'
import * as Yup from 'yup'

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%'
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  actionsContainer: {
    marginBottom: theme.spacing(1),
    display: 'flex',
    justifyContent: 'space-between'
  },
  resetContainer: {
    padding: theme.spacing(3)
  },
  paperContainer: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(2)
  }
}))

export default function Contact ({ nextStep, prevStep, handleStepChanges, params }) {
  const classes = useStyles()
  const { t } = useTranslation()

  const ContactSchema = Yup.object().shape({
    contactName: Yup.string()
      .required(t('NO_NAME')),
    contactSurname: Yup.string()
      .required(t('NO_SURNAME')),
    phone: Yup.string()
      .matches(/^\d{9}$/, t('NO_PHONE'))
      .required(t('NO_PHONE'))
  })

  return (
    <Paper className={classes.paperContainer} elevation={0}>
      <Formik
        initialValues={
          {
            ...{
              contactName: '',
              contactSurname: '',
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
        }) => (
          <form onSubmit={handleSubmit} noValidate>
            <Box mx={1} mt={1} mb={1}>
              <Typography
                dangerouslySetInnerHTML={{
                  __html: t('HELP_CONTACT_INFO', {
                    url: t('HELP_CONTACT_INFO_URL')
                  })
                }}
              />
            </Box>
            <Box mx={1} mb={2}>
              <TextField
                id="contactName"
                name="contactName"
                label={t('NAME')}
                error={(errors.contactName && touched.contactName)}
                helperText={(touched.contactName && errors.contactName)}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.contactName}
                fullWidth
                variant="outlined"
                margin="normal"
                required
                autoFocus
              />
              <TextField
                id="contactSurname"
                name="contactSurname"
                label={t('SURNAME')}
                error={(errors.contactSurname && touched.contactSurname)}
                helperText={(touched.contactSurname && errors.contactSurname)}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.contactSurname}
                fullWidth
                variant="outlined"
                margin="normal"
                required
              />
              <TextField
                id="phone"
                name="phone"
                type="tel"
                label={t('PHONE')}
                error={(errors.phone && touched.phone)}
                helperText={(touched.phone && errors.phone)}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.phone}
                fullWidth
                variant="outlined"
                margin="normal"
                required
              />
            </Box>

            <div className={classes.actionsContainer}>
              {
                prevStep &&
                <Button
                  onClick={prevStep}
                  className={classes.button}
                  startIcon={<ArrowBackIosIcon />}
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
                  endIcon={<ArrowForwardIosIcon />}
                >
                  {t('SEGUENT_PAS')}
                </Button>
              }
            </div>
          </form>
        )}
      </Formik>
    </Paper>
  )
}
