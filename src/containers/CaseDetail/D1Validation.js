import React, { useState } from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'

import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'

import { modifyContract } from '../../services/api'
import { normalizeModifyData } from '../../services/utils'

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Chooser from '../../components/Chooser'

import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import HighlightOff from '@material-ui/icons/HighlightOff'
import SendIcon from '@material-ui/icons/Send'

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
  resetContainer: {
    padding: theme.spacing(3)
  },
  paperContainer: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(2)
  },
  resumeLabel: {
    textTransform: 'uppercase'
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 500,
    textTransform: 'uppercase',
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2)
  },
  label: {
    textTransform: 'uppercase',
    paddingRight: '12px',
    fontSize: '14px',
    fontWeight: 400,
    color: 'rgba(0, 0, 0, 0.54)'
  }
}))

function D1Validation ({ handleAcceptClick, handleRefuseClick, handleStepChanges, params }) {
  const classes = useStyles()
  const { t } = useTranslation()

  const [touched, setTouched] = useState(false)

  const handleValidateD1 = ( option ) => {
    handleStepChanges({ validate: option })
    setTouched(true)
  }

  return (
    <Paper className={classes.paperContainer} elevation={0}>
      <Formik
        initialValues={
          {
            ...{
              validate: ''
            },
            ...params
          }
        }
        onSubmit={(values, { setSubmitting }) => {
          console.log("onSubmit", values)
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


            { params?.to_validate && <>
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

              <Box mb={1}>
                <Grid container spacing={4}>
                  <Grid item xs={12} sm={6}>
                    <Typography className={classes.label} variant="subtitle2" gutterBottom>
                      {t('REGISTER_SECTION')}
                    </Typography>
                    <Typography data-cy="register_section" variant="body1" gutterBottom>
                      {params?.register_section}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography className={classes.label} variant="subtitle2" gutterBottom>
                      {t('SUBSECTION')}
                    </Typography>
                    <Typography data-cy="subsection" variant="body1" gutterBottom>
                      {params?.subsection}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography className={classes.label} variant="subtitle2" gutterBottom>
                      {t('CIL')}
                    </Typography>
                    <Typography data-cy="cil" variant="body1" gutterBottom>
                      {params?.cil}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography className={classes.label} variant="subtitle2" gutterBottom>
                      {t('CAU')}
                    </Typography>
                    <Typography data-cy="cau" variant="body1" gutterBottom>
                      {params?.cau}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography className={classes.label} variant="subtitle2" gutterBottom>
                      {t('COLLECTIVE')}
                    </Typography>
                    <Typography data-cy="collective" variant="body1" gutterBottom>
                      {(params?.collective ? t('SI') : t('NO'))}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              <Typography className={classes.sectionTitle} variant="h6">{t('DATOS_GENERADORES')}</Typography>
              <Box mb={1}>
                <Grid container spacing={4}>
                  <Grid item xs={12} sm={6}>
                    <Typography className={classes.label} variant="subtitle2" gutterBottom>
                      {t('INSTALLATION_TYPE')}
                    </Typography>
                    <Typography data-cy="installation_type" variant="body1" gutterBottom>
                      {params?.installation_type}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography className={classes.label} variant="subtitle2" gutterBottom>
                      {t('GENERATOR_TECHNOLOGY')}
                    </Typography>
                    <Typography data-cy="generator_technology" variant="body1" gutterBottom>
                      {params?.generator_technology}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography className={classes.label} variant="subtitle2" gutterBottom>
                      {t('SSAA')}
                    </Typography>
                    <Typography data-cy="ssaa" variant="body1" gutterBottom>
                      {(params?.ssaa ? t('SI') : t('NO'))}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography className={classes.label} variant="subtitle2" gutterBottom>
                      {t('INSTALLED_POWER')}
                    </Typography>
                    <Typography data-cy="installed_power" variant="body1" gutterBottom>
                      {params?.installed_power} kW
                    </Typography>
                  </Grid>

                </Grid>
              </Box>
            </Box>

            { params?.to_validate && <>

              <Box mt={1} mb={1}>
                <Chooser
                  question={t('APROFITAR_LA_MODIFICACIO')}
                  onChange={ option => handleValidateD1(option?.option) }
                  value={ values.validate }
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
                    className={classes.button}
                    onClick={() => handleAcceptClick()}
                    variant="contained"
                    color="primary"
                    disabled={ ! touched }
                    endIcon={<ArrowForwardIosIcon />}
                  >
                    {t('SEGUENT_PAS')}
                  </Button>
                }
              </div>
            </> }

          </form>
        )}
      </Formik>
    </Paper>
  )
}

export default D1Validation
