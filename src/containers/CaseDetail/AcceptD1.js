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
import Chooser from '../../components/Chooser'

import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import SendIcon from '@material-ui/icons/Send'

import Uploader from '../../components/Uploader'

const useStyles = makeStyles((theme) => ({
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
  },
  chooserLabelBox: {
    '& label': {
      minHeight: '110px'
    }
  }
}))

function AcceptD1({
  prevStep,
  handlePost,
  handleStepChanges,
  nextStep,
  params
}) {
  const classes = useStyles()
  const { t } = useTranslation()
  const [sending, setSending] = useState(false)

  const AcceptD1Schema = Yup.object().shape({
    m1: Yup.bool()
      .required(t('UNACCEPTED_PRIVACY_POLICY'))
      .oneOf([true, false], t('UNACCEPTED_PRIVACY_POLICY')),
    d1Attachments: Yup.array().when('its_endesa', {
      is: true,
      then: Yup.array().min(1, t('MISSING_REQUIRED_ATTACHMENT'))
    })
  })

  return (
    <Paper className={classes.paperContainer} elevation={0}>
      <Formik
        initialValues={{
          ...{
            d1Attachments: [],
            m1: ''
          },
          ...params
        }}
        validationSchema={AcceptD1Schema}
        onSubmit={async (values) => {
          handleStepChanges({
            d1Attachments: values?.d1Attachments,
            m1: values?.m1
          })
          if (values?.m1) {
            nextStep()
          } else {
            setSending(true)
            await handlePost(values)
            setSending(false)
          }
        }}>
        {({
          values,
          errors,
          touched,
          isValid,
          handleSubmit,
          setFieldValue
        }) => (
          <Form onSubmit={handleSubmit} noValidate>
            <Box mt={1} mx={1} mb={2}>
              <Typography
                variant="body1"
                dangerouslySetInnerHTML={{
                  __html: t('ATTACHMENTS_D1_INTRO_ACCEPT')
                }}
              />
            </Box>

            <Box mt={3} mb={1}>
              <Box mt={3} mx={1} mb={1}>
                <Typography
                  variant="body1"
                  component="div"
                  dangerouslySetInnerHTML={{
                    __html: t('D1_ATTACHMENTS_ACCEPT')
                  }}
                />
              </Box>
              <Box mx={1} mt={3} mb={1}>
                <Uploader
                  maxFiles={5}
                  fieldError={
                    errors?.d1Attachments &&
                    (touched?.d1Attachments || values?.m1 !== "") &&
                    errors?.d1Attachments
                  }
                  callbackFn={(d1Attachments) =>
                    setFieldValue('d1Attachments', d1Attachments)
                  }
                  values={values.d1Attachments}
                />
              </Box>
            </Box>

            <Box mx={1} mt={1} mb={2} className={classes.chooserLabelBox}>
              <Chooser
                question={t('APROFITAR_LA_MODIFICACIO')}
                onChange={(option) => setFieldValue('m1', option.option)}
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
                  onClick={() => prevStep(params)}>
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
                  endIcon={
                    (sending && <CircularProgress size={24} />) ||
                    (values?.m1 === false && <SendIcon />) || (
                      <ArrowForwardIosIcon />
                    )
                  }>
                  {(values?.m1 === false && t('ENVIAR')) || t('SEGUENT_PAS')}
                </Button>
              }
            </div>
          </Form>
        )}
      </Formik>
    </Paper>
  )
}

export default AcceptD1
