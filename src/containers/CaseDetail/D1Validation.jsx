import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'

import { useTranslation } from 'react-i18next'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

import Chooser from '../../components/Chooser'

const label = {
  textTransform: 'uppercase',
  paddingRight: '12px',
  color: 'secondary.dark'
}

function D1Validation({ handleAcceptClick, handleStepChanges, params }) {
  const { t } = useTranslation()

  const handleValidateD1 = (setFieldValue, errors, option) => {
    setFieldValue('validate', option)
  }

  const ValidationSchema = Yup.object().shape({
    validate: Yup.boolean()
      .required(t('CHOOSER_REQUIRED'))
      .oneOf([true, false], t('INVALID_CHOOSER_OPTION'))
  })

  return (
    <Paper
      sx={{
        mt: 2,
        p: 2
      }}
      elevation={0}>
      <Formik
        enableReinitialize
        initialValues={{
          validate: '',
          ...params
        }}
        validateOnMount={true}
        validationSchema={ValidationSchema}
        onSubmit={(values) => {
          handleStepChanges({ validate: values?.validate })
          handleAcceptClick()
        }}>
        {({
          values,
          errors,
          touched,
          isValid,
          handleSubmit,
          setFieldValue
        }) => (
          <Form onSubmit={handleSubmit} noValidate autoComplete="off">
            {values?.to_validate && (
              <>
                <Box mt={1} mx={1} mb={2}>
                  <Typography
                    variant="body1"
                    dangerouslySetInnerHTML={{ __html: t('REVIEW_DATA_D1') }}
                  />
                </Box>
                <Box mx={1} mb={3}>
                  <Divider />
                </Box>
              </>
            )}

            <Box mx={1} mb={2}>
              <Typography
                sx={{
                  textTransform: 'uppercase',
                  mt: 2,
                  mb: 2
                }}
                variant="h6">
                {t('DATOS_AUTOCONSUMO')}
              </Typography>

              <Box mb={0}>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={6}>
                    <Typography sx={label} variant="subtitle2" gutterBottom>
                      {t('REGISTER_SECTION')}
                    </Typography>
                    <Typography
                      data-cy="register_section"
                      variant="body1"
                      gutterBottom>
                      {values?.register_section}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography sx={label} variant="subtitle2" gutterBottom>
                      {t('SUBSECTION')}
                    </Typography>
                    <Typography
                      data-cy="subsection"
                      variant="body1"
                      gutterBottom>
                      {values?.subsection}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography sx={label} variant="subtitle2" gutterBottom>
                      {t('CIL')}
                    </Typography>
                    <Typography data-cy="cil" variant="body1" gutterBottom>
                      {values?.cil}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography sx={label} variant="subtitle2" gutterBottom>
                      {t('CAU')}
                    </Typography>
                    <Typography data-cy="cau" variant="body1" gutterBottom>
                      {values?.cau}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography sx={label} variant="subtitle2" gutterBottom>
                      {t('COLLECTIVE')}
                    </Typography>
                    <Typography
                      data-cy="collective"
                      variant="body1"
                      gutterBottom>
                      {values?.collective ? t('YES') : t('NO')}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              <Typography
                sx={{
                  textTransform: 'uppercase',
                  mt: 2,
                  mb: 2
                }}
                variant="h6">
                {t('DATOS_GENERADORES')}
              </Typography>
              <Box mb={0}>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={6}>
                    <Typography sx={label} variant="subtitle2" gutterBottom>
                      {t('INSTALLATION_TYPE')}
                    </Typography>
                    <Typography
                      data-cy="installation_type"
                      variant="body1"
                      gutterBottom>
                      {values?.installation_type}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography sx={label} variant="subtitle2" gutterBottom>
                      {t('GENERATOR_TECHNOLOGY')}
                    </Typography>
                    <Typography
                      data-cy="generator_technology"
                      variant="body1"
                      gutterBottom>
                      {values?.generator_technology}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography sx={label} variant="subtitle2" gutterBottom>
                      {t('SSAA')}
                    </Typography>
                    <Typography data-cy="ssaa" variant="body1" gutterBottom>
                      {values?.ssaa ? t('YES') : t('NO')}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography sx={label} variant="subtitle2" gutterBottom>
                      {t('INSTALLED_POWER')}
                    </Typography>
                    <Typography
                      data-cy="installed_power"
                      variant="body1"
                      gutterBottom>
                      {values?.installed_power} kW
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Box>

            {values?.to_validate && (
              <>
                <Box mx={1} mb={3}>
                  <Divider />
                </Box>
                <Box
                  mx={1}
                  mb={2}
                  sx={{
                    '& label': {
                      minHeight: 'auto'
                    }
                  }}>
                  <Chooser
                    canBeEmpty={false}
                    question={t('ACCEPTACIO_AUTO')}
                    onChange={(option) =>
                      handleValidateD1(setFieldValue, errors, option?.option)
                    }
                    value={values?.validate}
                    options={[
                      {
                        value: true,
                        label: t('AVIS_ACCEPTACIO_AUTO')
                      },
                      {
                        value: false,
                        label: t('AVIS_REBUIG_AUTO')
                      }
                    ]}
                  />
                </Box>
                <Box
                  sx={{
                    mb: 1,
                    display: 'flex',
                    justifyContent: 'flex-end'
                  }}>
                  {
                    <Button
                      type="submit"
                      disableElevation={true}
                      sx={{
                        mt: 1,
                        mr: 1,
                        backgroundColor: '#CDFF80',
                        color: '#0B2E34',
                        '&:hover': {
                          color: '#CDFF80',
                          backgroundColor: '#0B2E34'
                        }
                      }}
                      variant="contained"
                      disabled={!isValid}
                      endIcon={<ArrowForwardIosIcon />}>
                      {t('NEXT')}
                    </Button>
                  }
                </Box>
              </>
            )}
          </Form>
        )}
      </Formik>
    </Paper>
  )
}

export default D1Validation
