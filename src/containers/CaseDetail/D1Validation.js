import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'

import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Chooser from '../../components/Chooser'

import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'

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
    justifyContent: 'flex-end'
  },
  paperContainer: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(2)
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 500,
    textTransform: 'uppercase',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2)
  },
  label: {
    textTransform: 'uppercase',
    paddingRight: '12px',
    fontSize: '14px',
    fontWeight: 400,
    color: 'rgba(0, 0, 0, 0.54)'
  },
  chooserLabelBox: {
    '& label': {
      minHeight: 'auto'
    }
  }
}))

function D1Validation ({ handleAcceptClick, handleStepChanges, params }) {
  const classes = useStyles()
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
    <Paper className={classes.paperContainer} elevation={0}>

      <Formik
        enableReinitialize
        initialValues={
          {
            ...params,
            validate: ''
          }
        }
        isInitialValid={false}
        validationSchema={ValidationSchema}
        onSubmit={ (values) => {
          handleStepChanges({ validate: values?.validate})
          handleAcceptClick()
        }}
        validateOnMount={true}
      >
        {({
          values,
          errors,
          touched,
          isValid,
          handleSubmit,
          setFieldValue
        }) => (
          <Form onSubmit={handleSubmit} noValidate autoComplete="off">

            { values?.to_validate && <>
              <Box mt={1} mx={1} mb={2}>
                <Typography variant="body1"
                  dangerouslySetInnerHTML={{ __html: t('REVIEW_DATA_D1') }}
                />
              </Box>
              <Box mx={1} mb={1}>
                <Divider />
              </Box>
            </> }

            <Box mx={1} mb={4}>
              <Typography className={classes.sectionTitle} variant="h6">{t('DATOS_AUTOCONSUMO')}</Typography>

              <Box mb={0}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography className={classes.label} variant="subtitle2" gutterBottom>
                      {t('REGISTER_SECTION')}
                    </Typography>
                    <Typography data-cy="register_section" variant="body1" gutterBottom>
                      {values?.register_section}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography className={classes.label} variant="subtitle2" gutterBottom>
                      {t('SUBSECTION')}
                    </Typography>
                    <Typography data-cy="subsection" variant="body1" gutterBottom>
                      {values?.subsection}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography className={classes.label} variant="subtitle2" gutterBottom>
                      {t('CIL')}
                    </Typography>
                    <Typography data-cy="cil" variant="body1" gutterBottom>
                      {values?.cil}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography className={classes.label} variant="subtitle2" gutterBottom>
                      {t('CAU')}
                    </Typography>
                    <Typography data-cy="cau" variant="body1" gutterBottom>
                      {values?.cau}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography className={classes.label} variant="subtitle2" gutterBottom>
                      {t('COLLECTIVE')}
                    </Typography>
                    <Typography data-cy="collective" variant="body1" gutterBottom>
                      {(values?.collective ? t('SI') : t('NO'))}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              <Typography className={classes.sectionTitle} variant="h6">{t('DATOS_GENERADORES')}</Typography>
              <Box mb={0}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography className={classes.label} variant="subtitle2" gutterBottom>
                      {t('INSTALLATION_TYPE')}
                    </Typography>
                    <Typography data-cy="installation_type" variant="body1" gutterBottom>
                      {values?.installation_type}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography className={classes.label} variant="subtitle2" gutterBottom>
                      {t('GENERATOR_TECHNOLOGY')}
                    </Typography>
                    <Typography data-cy="generator_technology" variant="body1" gutterBottom>
                      {values?.generator_technology}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography className={classes.label} variant="subtitle2" gutterBottom>
                      {t('SSAA')}
                    </Typography>
                    <Typography data-cy="ssaa" variant="body1" gutterBottom>
                      {(values?.ssaa ? t('SI') : t('NO'))}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography className={classes.label} variant="subtitle2" gutterBottom>
                      {t('INSTALLED_POWER')}
                    </Typography>
                    <Typography data-cy="installed_power" variant="body1" gutterBottom>
                      {values?.installed_power} kW
                    </Typography>
                  </Grid>

                </Grid>
              </Box>
            </Box>

            { values?.to_validate &&
            <>
              <Box mx={1} mb={2}>
                <Divider />
              </Box>
              <Box mx={1} mb={2} className={classes.chooserLabelBox}>
                <Chooser
                  question={t('ACCEPTACIO_AUTO')}
                  onChange={ option => handleValidateD1(setFieldValue, errors, option?.option) }
                  value={ values?.validate }
                  options={[
                    {
                      value: true,
                      label: t('SI'),
                      description: t('AVIS_ACCEPTACIO_AUTO')
                    },
                    {
                      value: false,
                      label: t('NO'),
                      description: t('AVIS_REBUIG_AUTO')
                    }
                  ]}
                />
              </Box>
              <div className={classes.actionsContainer}>
                {
                  <Button
                    type="submit"
                    className={classes.button}
                    variant="contained"
                    color="primary"
                    disabled={!isValid}
                    endIcon={<ArrowForwardIosIcon />}
                  >
                    {t('SEGUENT_PAS')}
                  </Button>
                }
              </div>
            </> }
          </Form>
        )}
      </Formik>
    </Paper>
  )
}

export default D1Validation
