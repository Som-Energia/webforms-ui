import React, { useState } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'

import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'
import TextField from '@material-ui/core/TextField'

import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import SendIcon from '@material-ui/icons/Send'

import Uploader from '../../components/Uploader'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
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

function RefuseD1 ({ prevStep, handlePost, handleRefuseClick, handleStepChanges, params }) {
  const classes = useStyles()
  const { t } = useTranslation()
  const [sending, setSending] = useState(false)

  const RefuseSchema = Yup.object().shape({
    refuseReason: Yup.string()
      .required(t('NO_REFUSE_REASON'))
      .max(500, t('REFUSE_REASON_TOO_LONG'))
  })

  return (
    <Paper className={classes.paperContainer} elevation={0}>
      <Formik
        initialValues={
          {
            d1Attachments: [],
            refuseReason: '',
            ...params
          }
        }
        validationSchema={RefuseSchema}
        onSubmit={ async (values) => {
          await handleStepChanges({ refuseReason: values?.refuseReason, d1Attachments: values?.d1Attachments })
          setSending(true)
          await handlePost(values)
          setSending(false)
        }}
      >
        {({
          values,
          errors,
          touched,
          isValid,
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue
        }) => (<>
          <Form onSubmit={handleSubmit} noValidate>

            <Box mt={1} mx={1} mb={2}>
              <Typography component="div" variant="body1"
                dangerouslySetInnerHTML={{ __html: t('ATTACHMENTS_D1_INTRO_REFUSE') }}
              />
            </Box>

            <Box mx={1} mb={2}>
              <TextField
                id="refuseReason"
                name="refuseReason"
                label={t('REFUSE_REASON')}
                error={(errors?.refuseReason && touched?.refuseReason)}
                helperText={(touched?.refuseReason && errors?.refuseReason)}
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
                <Typography>
                  {t('D1_ATTACHMENTS_REFUSE')}
                </Typography>
              </Box>
              <Box mx={1} mt={1} mb={1}>
                <Uploader
                  maxFiles={5}
                  fieldError={errors?.d1Attachments && touched?.d1Attachments && errors?.d1Attachments}
                  callbackFn={d1Attachments => setFieldValue('d1Attachments', d1Attachments)}
                  values={values.d1Attachments}
                />
              </Box>
            </Box>

            <div className={classes.actionsContainer}>
              {
                <Button
                  data-cy="prev"
                  className={classes.button}
                  startIcon={<ArrowBackIosIcon />}
                  disabled={params?.sending}
                  onClick={() => prevStep(params)}
                >
                  {t('PAS_ANTERIOR')}
                </Button>
              }
              {
                <>
                  <Button
                    type="submit"
                    className={classes.button}
                    color="primary"
                    variant="contained"
                    disabled={!isValid || sending}
                    startIcon={ sending ? <CircularProgress size={24} /> : <SendIcon /> }
                  >
                    {t('ENVIAR')}
                  </Button>
                </>
              }
            </div>
          </Form>
        </>
        )}
      </Formik>
    </Paper>
  )
}

export default RefuseD1
