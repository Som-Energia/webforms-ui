import React from 'react'

import { useTranslation } from 'react-i18next'

import { Formik } from 'formik'
import * as Yup from 'yup'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'

export default function Contact({
  nextStep,
  prevStep,
  handleStepChanges,
  params
}) {
  const { t } = useTranslation()

  const ContactSchema = Yup.object().shape({
    contactName: Yup.string().required(t('NO_NAME')),
    contactSurname: Yup.string().required(t('NO_SURNAME')),
    phone: Yup.string()
      .matches(/^\d{9}$/, t('NO_PHONE'))
      .required(t('NO_PHONE'))
  })

  return (
    <Paper sx={{ mt: 2, padding: 2 }} elevation={0}>
      <Formik
        initialValues={{
          ...{
            contactName: '',
            contactSurname: '',
            phone: ''
          },
          ...params
        }}
        validationSchema={ContactSchema}
        onSubmit={(values, { setSubmitting }) => {
          handleStepChanges({ contact: values })
          nextStep()
        }}>
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
                error={errors.contactName && touched.contactName}
                helperText={touched.contactName && errors.contactName}
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
                error={errors.contactSurname && touched.contactSurname}
                helperText={touched.contactSurname && errors.contactSurname}
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
                error={errors.phone && touched.phone}
                helperText={touched.phone && errors.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.phone}
                fullWidth
                variant="outlined"
                margin="normal"
                required
              />
            </Box>

            <Box
              sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}>
              {prevStep && (
                <Button
                  onClick={prevStep}
                  sx={{ mt: 1, mr: 1 }}
                  startIcon={<ArrowBackIosIcon />}>
                  {t('PAS_ANTERIOR')}
                </Button>
              )}
              {nextStep && (
                <Button
                  type="submit"
                  sx={{ mt: 1, mr: 1 }}
                  color="primary"
                  variant="contained"
                  endIcon={<ArrowForwardIosIcon />}>
                  {t('SEGUENT_PAS')}
                </Button>
              )}
            </Box>
          </form>
        )}
      </Formik>
    </Paper>
  )
}
