import React, { useState } from 'react'
import { Formik } from 'formik'

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

import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
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

  return (
    <Paper className={classes.paperContainer} elevation={0}>
      <Formik
        initialValues={
          {
            ...{
              attachments: [],
              m1: ''
            },
            ...params
          }
        }
        // validationSchema={ModifySchema}
        onSubmit={(values, { setSubmitting }) => {
          console.log("onSubmit", values?.attachments)
          handleStepChanges({ attachments: values?.attachments })
          if (values?.m1) {
            nextStep()
          }
          else {
            setSubmitting(true)
            handlePost()
            setSubmitting(false)
          }
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          isSubmitting
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
                  fieldError={false /*errors.attachments && touched.attachments && errors.attachments*/}
                  callbackFn={attachments => setFieldValue('attachments', attachments)}
                  values={values.attachments}
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
                    startIcon={<CheckCircleOutlineIcon />}
                  >
                    {t('ACCEPTAR')}
                  </Button>
                </>
              }
            </div>
          </form>
        )}
      </Formik>
    </Paper>
  )
}

export default AcceptD1
