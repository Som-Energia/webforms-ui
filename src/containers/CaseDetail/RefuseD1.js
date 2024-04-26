import React, { useState } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'

import { useTranslation } from 'react-i18next'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import TextField from '@mui/material/TextField'

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import SendIcon from '@mui/icons-material/Send'

import Uploader from '../../components/Uploader'

function RefuseD1({
  prevStep,
  handlePost,
  handleRefuseClick,
  handleStepChanges,
  params
}) {
  const { t } = useTranslation()
  const [sending, setSending] = useState(false)

  const RefuseSchema = Yup.object().shape({
    refuseReason: Yup.string()
      .required(t('NO_REFUSE_REASON'))
      .max(500, t('REFUSE_REASON_TOO_LONG'))
  })

  return (
    <Paper sx={{ mt: 2, p: 2 }} elevation={0}>
      <Formik
        initialValues={{
          d1Attachments: [],
          refuseReason: '',
          ...params
        }}
        validationSchema={RefuseSchema}
        onSubmit={async (values) => {
          await handleStepChanges({
            refuseReason: values?.refuseReason,
            d1Attachments: values?.d1Attachments
          })
          setSending(true)
          await handlePost(values)
          setSending(false)
        }}>
        {({
          values,
          errors,
          touched,
          isValid,
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue
        }) => (
          <>
            <Form onSubmit={handleSubmit} noValidate>
              <Box mt={1} mx={1} mb={2}>
                <Typography
                  component="div"
                  variant="body1"
                  dangerouslySetInnerHTML={{
                    __html: t('ATTACHMENTS_D1_INTRO_REFUSE')
                  }}
                />
              </Box>

              <Box mx={1} mb={2}>
                <TextField
                  id="refuseReason"
                  name="refuseReason"
                  label={t('REFUSE_REASON')}
                  error={errors?.refuseReason && touched?.refuseReason}
                  helperText={touched?.refuseReason && errors?.refuseReason}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.refuseReason}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  required
                  inputProps={{ maxLength: 500 }}
                />
              </Box>

              <Box mt={2} mb={1}>
                <Box mt={3} mx={1} mb={1}>
                  <Typography>{t('D1_ATTACHMENTS_REFUSE')}</Typography>
                </Box>
                <Box mx={1} mt={1} mb={1}>
                  <Uploader
                    maxFiles={5}
                    fieldError={
                      errors?.d1Attachments &&
                      touched?.d1Attachments &&
                      errors?.d1Attachments
                    }
                    callbackFn={(d1Attachments) =>
                      setFieldValue('d1Attachments', d1Attachments)
                    }
                    values={values.d1Attachments}
                  />
                </Box>
              </Box>

              <Box
                sx={{
                  mb: 1,
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                {
                  <Button
                    data-cy="prev"
                    sx={{ mt: 1, mr: 1 }}
                    startIcon={<ArrowBackIosIcon />}
                    disabled={params?.sending}
                    onClick={() => prevStep(params)}>
                    {t('PAS_ANTERIOR')}
                  </Button>
                }
                {
                  <>
                    <Button
                      type="submit"
                      sx={{ mt: 1, mr: 1 }}
                      color="primary"
                      variant="contained"
                      disabled={!isValid || sending}
                      startIcon={
                        sending ? <CircularProgress size={24} /> : <SendIcon />
                      }>
                      {t('ENVIAR')}
                    </Button>
                  </>
                }
              </Box>
            </Form>
          </>
        )}
      </Formik>
    </Paper>
  )
}

export default RefuseD1
