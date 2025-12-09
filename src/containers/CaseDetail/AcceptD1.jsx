import React, { useState } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'

import { useTranslation } from 'react-i18next'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import CircularProgress from '@mui/material/CircularProgress'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import SendIcon from '@mui/icons-material/Send'

import Chooser from '../../components/Chooser'
import Uploader from '../../components/Uploader'
import PrevButton from '../../components/Buttons/PrevButton'

const showD1PowerModificationChooser =
  import.meta.env.VITE_SHOW_D1_POWER_MODIFICATION_CHOOSER === 'true'

function AcceptD1({
  prevStep,
  handlePost,
  handleStepChanges,
  nextStep,
  params
}) {
  const { t } = useTranslation()
  const [sending, setSending] = useState(false)

  const AcceptD1Schema = Yup.object().shape({
    m1: Yup.bool()
      .required(t('UNACCEPTED_PRIVACY_POLICY'))
      .oneOf([true, false], t('UNACCEPTED_PRIVACY_POLICY'))
  })

  return (
    <Paper
      sx={{
        mt: 2,
        p: 2
      }}>
      <Formik
        initialValues={{
          ...{
            d1Attachments: [],
            m1: showD1PowerModificationChooser ? '' : false
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
                    (touched?.d1Attachments || values?.m1 !== '') &&
                    errors?.d1Attachments
                  }
                  callbackFn={(d1Attachments) =>
                    setFieldValue('d1Attachments', d1Attachments)
                  }
                  values={values.d1Attachments}
                />
              </Box>
            </Box>

            {showD1PowerModificationChooser && (
              <Box
                mx={1}
                mt={1}
                mb={2}
                sx={{
                  '& label': {
                    minHeight: '110px'
                  }
                }}>
                <Chooser
                  question={t('APROFITAR_LA_MODIFICACIO')}
                  onChange={(option) => setFieldValue('m1', option.option)}
                  value={values.m1}
                  options={[
                    {
                      value: true,
                      label: t('YES'),
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
            )}

            <Box
              sx={{
                mb: 1,
                display: 'flex',
                justifyContent: 'space-between',
              }}>
              {
                <PrevButton
                  disabled={sending}
                  onClick={() => prevStep(params)}
                  title={t('PREV')}
                />
              }
              {
                <Button
                  type="submit"
                  disableElevation={true}
                  sx={{
                    backgroundColor: '#CDFF80',
                    color: '#0B2E34',
                    '&:hover': {
                      color: '#CDFF80',
                      backgroundColor: '#0B2E34'
                    }
                  }}
                  variant="contained"
                  disabled={
                    (showD1PowerModificationChooser && !isValid) || sending
                  }
                  endIcon={
                    (sending && <CircularProgress size={24} />) ||
                    (values?.m1 === false && <SendIcon />) || (
                      <ArrowForwardIosIcon />
                    )
                  }>
                  {(values?.m1 === false && t('ENVIAR')) || t('NEXT')}
                </Button>
              }
            </Box>
          </Form>
        )}
      </Formik>
    </Paper>
  )
}

export default AcceptD1
