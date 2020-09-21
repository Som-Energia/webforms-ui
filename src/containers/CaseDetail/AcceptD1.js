import React, { useState } from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'

import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'
import Chooser from '../../components/Chooser'


import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'
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

function AcceptD1 ({ prevStep, handlePost, handleStepChanges, nextStep, params }) {
  const classes = useStyles()
  const { t } = useTranslation()
  const [sending, setSending] = useState(false)

  const AcceptD1Schema = Yup.object().shape({
    d1_attachments: Yup.string()
      .required(t('NO_NAME')),
    m1: Yup.bool()
      .required(t('UNACCEPTED_PRIVACY_POLICY'))
      .oneOf([true, false], t('UNACCEPTED_PRIVACY_POLICY'))
  })

  return (
    <Paper className={classes.paperContainer} elevation={0}>
      <Formik
        initialValues={
          {
            ...{
              d1_attachments: [],
              m1: ''
            },
            ...params
          }
        }
        validationSchema={AcceptD1Schema}
        onSubmit={ async (values) => {
          console.log("onSubmit", values?.d1_attachments)
          handleStepChanges({ d1_attachments: values?.d1_attachments, m1: values?.m1 })
          if (values?.m1) {
            nextStep()
          }
          else {
            setSending(true)
            await handlePost()
            setSending(false)
          }
        }}
      >
        {({
          values,
          errors,
          touched,
          isValid,
          handleSubmit,
          setFieldValue
        }) => (
          <form onSubmit={handleSubmit} noValidate>

            <Box mt={1} mx={1} mb={2}>
              <Typography variant="body1"
                dangerouslySetInnerHTML={{ __html: t('ATTACHMENTS_D1_INTRO') }}
              />
            </Box>
            <Box mx={1} mb={1}>
              <Divider />
            </Box>


            <Box mt={3} mb={1}>

              <Box mt={3} mx={1} mb={1}>
                <Typography>
                  {t('D1_ATTACHMENTS')}
                </Typography>
              </Box>
              <Box mx={3} mt={1} mb={1}>
                <Uploader
                  fieldError={errors?.d1_attachments && touched?.d1_attachments && errors?.d1_attachments}
                  callbackFn={d1_attachments => setFieldValue('d1_attachments', d1_attachments)}
                  values={values.d1_attachments}
                />
              </Box>

            </Box>

            <Box mt={1} mb={1}>
              <Chooser
                question={t('APROFITAR_LA_MODIFICACIO')}
                onChange={ option => setFieldValue('m1', option.option)}
                value={values.m1}
                options={[
                  {
                    value: true,
                    label: t('SI'),
                    description: t('AVIS_APROFITAR_M1')
                  },
                  {
                    value: false,
                    label: t('NO'),
                    description: t('AVIS_NO_APROFITAR_M1')
                  }
                ]}
              />
            </Box>
            <div className={classes.actionsContainer}>
              {
                <Button
                  data-cy="prev"
                  className={classes.button}
                  startIcon={<ArrowBackIosIcon />}
                  disabled={sending}
                  onClick={() => prevStep(params)}
                >
                  {t('PAS_ANTERIOR')}
                </Button>
              }
              {
                <Button
                  type="submit"
                  className={classes.button}
                  color="primary"
                  variant="contained"
                  disabled={!isValid || sending}
                  endIcon={ sending && <CircularProgress size={24} /> ||
                    (values?.m1 === false && <SendIcon/> || <ArrowForwardIosIcon/>)}
                >
                  {values?.m1 === false && t('ENVIAR') || t('SEGUENT_PAS')}
                </Button>
              }
            </div>
          </form>
        )}
      </Formik>
    </Paper>
  )
}

export default AcceptD1
