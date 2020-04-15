import React from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Grid from '@material-ui/core/Grid'
import InputAdornment from '@material-ui/core/InputAdornment'
import MenuItem from '@material-ui/core/MenuItem'
import Switch from '@material-ui/core/Switch'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%'
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  actionsContainer: {
    marginBottom: theme.spacing(2)
  },
  resetContainer: {
    padding: theme.spacing(3)
  }
}))

function ModifyParams ({ nextStep, prevStep, handleStepChanges, params }) {
  const classes = useStyles()
  const { t } = useTranslation()

  const ModifySchema = Yup.object().shape({
    phases: Yup.string()
      .when('changePhases', {
        is: true,
        then: Yup.string()
          .required(t('NO_MONOPHASE_CHOICE'))
      }),
    power: Yup.number()
      .when('changePower', {
        is: true,
        then: Yup.number()
          .min(1, 'Too Short!')
          .max(3, 'Too Long!')
          .required(t('NO_POWER_CHOSEN'))
      }),
    fare: Yup.string()
      .when('changeFare', {
        is: true,
        then: Yup.string()
          .required(t('NO_HOURLY_DISCRIMINATION_CHOSEN'))
      })
  })

  return (
    <div>
      <Formik
        initialValues={
          {
            ...{
              changePhases: false,
              phases: '',
              changePower: false,
              power: '',
              moreThan15Kw: false,
              changeFare: false,
              fare: ''
            },
            ...params
          }
        }
        validationSchema={ModifySchema}
        onSubmit={(values, { setSubmitting }) => {
          console.log(values)
          handleStepChanges({ modify: values })
          nextStep()
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting
          /* and other goodies */
        }) => (
          <form onSubmit={handleSubmit}>
            <Box mx={1} mt={2} mb={1}>
              <Grid component="div" container alignItems="center" spacing={3}>
                <Grid item>
                  <Typography variant="h6">
                    {t('MODIFY_ANSWER_INSTAL_TYPE')}
                  </Typography>
                </Grid>
                <Grid item>
                  <div>
                    <Grid component="label" container alignItems="center" spacing={1}>
                      <Grid item>{t('NO')}</Grid>
                      <Grid item>
                        <Switch
                          name="changePhases"
                          onChange={event => handleChange(event)}
                          inputProps={{ 'aria-label': 'primary checkbox' }}
                          color="primary"
                          checked={values.changePhases}
                        />
                      </Grid>
                      <Grid item>{t('SI')}</Grid>
                    </Grid>
                  </div>
                </Grid>
              </Grid>
            </Box>
            {values.changePhases &&
            <Box mx={1} mt={2} mb={2}>
              <TextField
                select
                id="phases"
                name="phases"
                label={t('TIPUS_INSTALLACIO')}
                variant="outlined"
                fullWidth
                onChange={event => handleChange(event)}
                value={values.phases}
                error={(errors.phases && touched.phases)}
                helperText={(touched.phases && errors.phases)}
              >
                <MenuItem value="mono">
                  {t('MONOFASICA_NORMAL')}
                </MenuItem>f
                <MenuItem value="tri">
                  {t('TRIFASICA')}
                </MenuItem>
              </TextField>
            </Box>
            }
            <Box mx={1} mb={5}>
              <FormHelperText dangerouslySetInnerHTML={{ __html: t('HELP_INSTALL_TYPE', { url: t('HELP_INSTALL_TYPE_URL') }) }}></FormHelperText>
            </Box>

            <Box mx={1} mb={0}>
              <Grid component="div" container alignItems="center" spacing={3}>
                <Grid item>
                  <Typography variant="h6">
                    {t('MODIFY_ANSWER_POWER')}
                  </Typography>
                </Grid>
                <Grid item>
                  <div>
                    <Grid component="label" container alignItems="center" spacing={1}>
                      <Grid item>{t('NO')}</Grid>
                      <Grid item>
                        <Switch
                          name="changePower"
                          onChange={event => handleChange(event)}
                          inputProps={{ 'aria-label': 'primary checkbox' }}
                          color="primary"
                          checked={values.changePower}
                        />
                      </Grid>
                      <Grid item>{t('SI')}</Grid>
                    </Grid>
                  </div>
                </Grid>
              </Grid>
            </Box>
            {values.changePower &&
            <Box mx={1} mb={1}>
              <FormControlLabel
                control={<Checkbox onChange={handleChange} name="moreThan15Kw" color="primary" />}
                label={t('MES_GRAN_DE_15KW')}
              />
              <TextField
                id="power"
                name="power"
                label={t('POTENCIA_A_CONTRACTAR') + ' *'}
                InputProps={{
                  endAdornment: <InputAdornment position="end">kW</InputAdornment>,
                  startAdornment: (values.moreThan15Kw ? (<InputAdornment position="start">P1</InputAdornment>) : null)
                }}
                onChange={event => handleChange(event)}
                onBlur={handleBlur}
                value={values.power}
                fullWidth
                variant="outlined"
                margin="normal"
                error={(errors.power && touched.power)}
                helperText={(touched.power && errors.power)}
              />
              { values.moreThan15Kw &&
                <TextField
                  id="power2"
                  name="power2"
                  label={t('POTENCIA_A_CONTRACTAR') + ' *'}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">P2</InputAdornment>,
                    endAdornment: <InputAdornment position="end">kW</InputAdornment>,
                  }}
                  onChange={event => handleChange(event)}
                  onBlur={handleBlur}
                  value={values.power2}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  error={(errors.power2 && touched.power2)}
                  helperText={(touched.power2 && errors.power2)}
                />
              }
              { values.moreThan15Kw &&
                <TextField
                  id="power3"
                  name="power3"
                  label={t('POTENCIA_A_CONTRACTAR') + ' *'}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">P3</InputAdornment>,
                    endAdornment: <InputAdornment position="end">kW</InputAdornment>,
                  }}
                  onChange={event => handleChange(event)}
                  onBlur={handleBlur}
                  value={values.power3}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  error={(errors.power3 && touched.power3)}
                  helperText={(touched.power3 && errors.power3)}
                />
              }
            </Box>
            }
            <Box mx={1} mb={5}>
              <FormHelperText dangerouslySetInnerHTML={{ __html: t('HELP_POTENCIA', { url: t('HELP_POTENCIA_URL') }) }}></FormHelperText>
            </Box>

            <Box mx={1} mb={1}>
              <Grid component="div" container alignItems="center" spacing={3}>
                <Grid item>
                  <Typography variant="h6">
                    {t('MODIFY_ANSWER_FARE')}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography component="div">
                    <Grid component="label" container alignItems="center" spacing={1}>
                      <Grid item>{t('NO')}</Grid>
                      <Grid item>
                        <Switch
                          name="changeFare"
                          onChange={event => handleChange(event)}
                          inputProps={{ 'aria-label': 'primary checkbox' }}
                          color="primary"
                          checked={values.changeFare}
                        />
                      </Grid>
                      <Grid item>{t('SI')}</Grid>
                    </Grid>
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            {values.changeFare &&
              <Box mx={1} mt={1} mb={2}>
                <TextField
                  select
                  id="fare"
                  name="fare"
                  label={t('DISCRIMINACIO_HORARIA')}
                  onChange={event => handleChange(event)}
                  variant="outlined"
                  fullWidth
                  value={values.fare}
                  error={(errors.fare && touched.fare)}
                  helperText={(touched.fare && errors.fare)}
                >
                  <MenuItem value="nodh">
                    {t('SENSE_DISCRIMINACIO_HORARIA')}
                  </MenuItem>
                  <MenuItem value="dh">
                    {t('AMB_DISCRIMINACIO_HORARIA')}
                  </MenuItem>
                </TextField>
              </Box>
            }
            <Box mx={1} mb={5}>
              <FormHelperText
                dangerouslySetInnerHTML={{ __html: t('HELP_DISCRIMINACIO_HORARIA', { url: t('HELP_DISCRIMINACIO_HORARIA_URL') }) }}
              />
            </Box>

            <div className={classes.actionsContainer}>
              {
                prevStep &&
                <Button
                  onClick={prevStep}
                  className={classes.button}
                >
                  {t('PAS_ANTERIOR')}
                </Button>
              }
              {
                nextStep &&
                <Button
                  type="submit"
                  className={classes.button}
                  variant="contained"
                  color="primary"
                  disabled={!values.changePhases && !values.changePower && !values.changeFare}
                >
                  {t('SEGUENT_PAS')}
                </Button>
              }
            </div>
          </form>
        )}
      </Formik>
    </div>
  )
}

export default ModifyParams
