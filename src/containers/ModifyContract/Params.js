import React from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'

import Badge from '@material-ui/core/Badge'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import Divider from '@material-ui/core/Divider'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import InputAdornment from '@material-ui/core/InputAdornment'
import Grid from '@material-ui/core/Grid'
import MenuItem from '@material-ui/core/MenuItem'
import Paper from '@material-ui/core/Paper'
import Switch from '@material-ui/core/Switch'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'

import Uploader from '../../components/Uploader'

import { calculateTariff } from '../../services/utils'

const useStyles = makeStyles(theme => ({
  root: {
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
  paramTitle: {
    fontSize: '1.15rem'
  },
  switch: {
    marginLeft: theme.spacing(2)
  },
  switchLabel: {
    marginLeft: 0,
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    '&:hover': {
      textDecoration: 'underline'
    }
  }
}))

const handleChangeModify = (event, setFieldValue, values) => {
  if (event.target.name === 'changePhases' && values.changePhases) {
    setFieldValue('phases', '')
    setFieldValue('attachments', [])
  } else if (event.target.name === 'changePower' && values.changePower) {
    setFieldValue('power', '')
    setFieldValue('power2', '')
    setFieldValue('power3', '')
    setFieldValue('moreThan15Kw', false)
  } else if (event.target.name === 'changeFare' && values.changeFare) {
    setFieldValue('fare', '')
  }
  setFieldValue(event.target.name, event.target.checked)
}

const handleChangePower = (event, setFieldValue, { moreThan15Kw }) => {
  const regexLessThan15 = /^\d*([.,'])?\d{0,1}/g
  const regexMoreThan15 = /^\d*([.,'])?\d{0,3}/g
  const regex = moreThan15Kw ? regexMoreThan15 : regexLessThan15

  const match = regex.exec(event.target.value)
  let result = match[0].replace(',', '.')
  result = result.replace('\'', '.')

  result = (!moreThan15Kw && result <= 15) ? result
    : (moreThan15Kw && result < 450) ? result : result.slice(0, -1)

  setFieldValue(event.target.name, result)
}

const ModifyParams = ({ nextStep, prevStep, handleStepChanges, params }) => {
  const classes = useStyles()
  const { t } = useTranslation()

  const ModifySchema = Yup.object().shape({
    phases: Yup.string()
      .when('changePhases', {
        is: true,
        then: Yup.string()
          .required(t('NO_MONOPHASE_CHOICE'))
      })
      .test('noMoreThan15KwForMono',
        t('NO_MORE_THAN_15KW_FOR_MONO'),
        function () {
          return !(this.parent.phases === 'mono' && this.parent.moreThan15Kw)
        }),
    attachments: Yup.array()
      .when('changePhases', {
        is: true,
        then: Yup.array()
          .required(t('NO_ATTACHMENTS'))
      }),
    moreThan15Kw: Yup.boolean()
      .test('noMoreThan15KwForMono',
        t('NO_MORE_THAN_15KW_FOR_MONO'),
        function () {
          return !(this.parent.phases === 'mono' && this.parent.moreThan15Kw)
        }),
    power: Yup.number()
      .when('changePower', {
        is: true,
        then: Yup.number()
          .required(t('NO_POWER_CHOSEN'))
      })
      .test('oneMoreThan15Kw',
        t('ALGUN_DELS_TRES_PERIODES_MAJOR_QUE_15'),
        function () {
          return !(this.parent.moreThan15Kw && this.parent.power <= 15 && this.parent.power2 <= 15 && this.parent.power3 <= 15)
        }),
    power2: Yup.number()
      .when('changePower', {
        is: true,
        then: Yup.number()
          .when('moreThan15Kw', {
            is: true,
            then: Yup.number()
              .required(t('NO_POWER_CHOSEN'))
          })
      })
      .test('oneMoreThan15Kw',
        t('ALGUN_DELS_TRES_PERIODES_MAJOR_QUE_15'),
        function () {
          return !(this.parent.moreThan15Kw && this.parent.power <= 15 && this.parent.power2 <= 15 && this.parent.power3 <= 15)
        }),
    power3: Yup.number()
      .when('changePower', {
        is: true,
        then: Yup.number()
          .when('moreThan15Kw', {
            is: true,
            then: Yup.number()
              .required(t('NO_POWER_CHOSEN'))
          })
      })
      .test('oneMoreThan15Kw',
        t('ALGUN_DELS_TRES_PERIODES_MAJOR_QUE_15'),
        function () {
          return !(this.parent.moreThan15Kw && this.parent.power <= 15 && this.parent.power2 <= 15 && this.parent.power3 <= 15)
        }),
    fare: Yup.string()
      .when('changeFare', {
        is: true,
        then: Yup.string()
          .required(t('NO_HOURLY_DISCRIMINATION_CHOSEN'))
      })
  })

  return (
    <Paper className={classes.paperContainer} elevation={0}>
      <Formik
        initialValues={
          {
            ...{
              changePhases: false,
              phases: '',
              attachments: [],
              changePower: false,
              power: '',
              power2: '',
              power3: '',
              power_attachments: [],
              moreThan15Kw: false,
              changeFare: false,
              fare: '',
              tariff: ''
            },
            ...params
          }
        }
        validationSchema={ModifySchema}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(true)
          const tariff = calculateTariff(values)
          handleStepChanges({ modify: { ...values, tariff: tariff } })
          nextStep()
          setSubmitting(false)
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
            <Box mx={1} mt={1} mb={1}>
              <FormControlLabel
                className={classes.switchLabel}
                label={
                  <Typography variant="h6" className={classes.paramTitle}>
                    {t('MODIFY_ANSWER_INSTAL_TYPE')}
                  </Typography>
                }
                labelPlacement="start"
                control={
                  <Switch
                    name="changePhases"
                    className={classes.switch}
                    onChange={ event => handleChangeModify(event, setFieldValue, values)}
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                    color="primary"
                    checked={values.changePhases}
                  />
                }
              />
            </Box>
            {values.changePhases &&
            <>
              <Box mx={1} mt={1} mb={2}>
                <TextField
                  select
                  id="phases"
                  name="phases"
                  label={t('TIPUS_INSTALLACIO')}
                  variant="outlined"
                  fullWidth
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.phases}
                  error={(errors.phases && touched.phases)}
                  helperText={(touched.phases && errors.phases)}
                >
                  <MenuItem value="mono">
                    {t('MONOFASICA_NORMAL')}
                  </MenuItem>
                  <MenuItem value="tri">
                    {t('TRIFASICA')}
                  </MenuItem>
                </TextField>
              </Box>

              <Box mt={3} mx={1} mb={1}>
                <Typography>
                  {t('INSTALL_TYPE_ATTACHMENTS')}
                </Typography>
              </Box>
              <Box mx={1} mt={1} mb={2}>
                <Uploader
                  fieldError={errors.attachments && touched.attachments && errors.attachments}
                  callbackFn={attachments => setFieldValue('attachments', attachments)}
                  values={values.attachments}
                />
              </Box>
            </>
            }
            <Box mx={1} mb={3}>
              <FormHelperText dangerouslySetInnerHTML={{ __html: t('HELP_INSTALL_TYPE', { url: t('HELP_INSTALL_TYPE_URL') }) }}></FormHelperText>
            </Box>

            <Box mx={1} mb={2}>
              <Divider />
            </Box>

            <Box mx={1} mb={0}>
              <FormControlLabel
                className={classes.switchLabel}
                label={
                  <Typography variant="h6" className={classes.paramTitle}>
                    {t('MODIFY_ANSWER_POWER')}
                  </Typography>
                }
                labelPlacement="start"
                control={
                  <Switch
                    name="changePower"
                    className={classes.switch}
                    onChange={event => handleChangeModify(event, setFieldValue, values)}
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                    color="primary"
                    checked={values.changePower}
                  />
                }
              />
            </Box>
            {values.changePower &&
            <Box mx={1} mb={0}>
              <FormControlLabel
                control={<Checkbox checked={values.moreThan15Kw} onChange={handleChange} name="moreThan15Kw" color="primary" />}
                label={t('MES_GRAN_DE_15KW')}
              />
              <TextField
                required
                id="power"
                name="power"
                label={t('POTENCIA_A_CONTRACTAR')}
                InputProps={{
                  endAdornment: <InputAdornment position="end">kW</InputAdornment>,
                  startAdornment: (values.moreThan15Kw ? (<InputAdornment position="start">P1</InputAdornment>) : null)
                }}
                onChange={event => handleChangePower(event, setFieldValue, values)}
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
                  required
                  id="power2"
                  name="power2"
                  label={t('POTENCIA_A_CONTRACTAR')}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">P2</InputAdornment>,
                    endAdornment: <InputAdornment position="end">kW</InputAdornment>
                  }}
                  onChange={event => handleChangePower(event, setFieldValue, values)}
                  onBlur={handleBlur}
                  value={values.power2}
                  disabled={!values.moreThan15Kw}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  error={(errors.power2 && touched.power2)}
                  helperText={(touched.power2 && errors.power2)}
                />
              }
              { values.moreThan15Kw &&
                <TextField
                  required
                  id="power3"
                  name="power3"
                  label={t('POTENCIA_A_CONTRACTAR')}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">P3</InputAdornment>,
                    endAdornment: <InputAdornment position="end">kW</InputAdornment>
                  }}
                  onChange={event => handleChangePower(event, setFieldValue, values)}
                  onBlur={handleBlur}
                  value={values.power3}
                  disabled={!values.moreThan15Kw}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  error={(errors.power3 && touched.power3)}
                  helperText={(touched.power3 && errors.power3)}
                />
              }
              <Box mt={3} mb={1}>
                <Typography>
                  {t('POWER_ATTACHMENTS')}
                </Typography>
              </Box>
              <Box mt={1} mb={2}>
                <Uploader
                  fieldError={errors.power_attachments && touched.power_attachments && errors.power_attachments}
                  callbackFn={ values => { setFieldValue('power_attachments', values) } }
                  values={values.power_attachments}
                />
              </Box>
            </Box>
            }
            <Box mx={1} mt={1} mb={3}>
              <FormHelperText dangerouslySetInnerHTML={{ __html: t('HELP_POTENCIA', { url: t('HELP_POTENCIA_URL') }) }}></FormHelperText>
            </Box>

            <Box mx={1} mb={2}>
              <Divider />
            </Box>

            <Box mx={1} mb={1}>
              <FormControlLabel
                className={classes.switchLabel}
                label={
                  <Typography variant="h6" className={classes.paramTitle}>
                    {t('MODIFY_ANSWER_FARE')}
                  </Typography>
                }
                labelPlacement="start"
                control={
                  <Switch
                    name="changeFare"
                    className={classes.switch}
                    onChange={event => handleChangeModify(event, setFieldValue, values)}
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                    color="primary"
                    checked={(!values.moreThan15Kw) ? values.changeFare : false}
                    disabled={values.moreThan15Kw}
                  />
                }
              />
            </Box>
            {(values.changeFare && !values.moreThan15Kw) &&
              <Box mx={1} mt={1} mb={2}>
                <TextField
                  select
                  id="fare"
                  name="fare"
                  label={t('DISCRIMINACIO_HORARIA')}
                  onChange={event => handleChange(event)}
                  variant="outlined"
                  fullWidth
                  value={ (!values.moreThan15Kw) ? values.fare : ''}
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
            <Box mx={1} mb={3}>
              <FormHelperText
                dangerouslySetInnerHTML={{ __html: t('HELP_DISCRIMINACIO_HORARIA', { url: t('HELP_DISCRIMINACIO_HORARIA_URL') }) }}
              />
            </Box>

            { (values.changePower && values.power && ((values.changeFare && values.fare) || values.moreThan15Kw)) &&
              <Box mx={1} mb={3}>
                <Grid container spacing={4}>
                  <Grid item>{t('LA_TEVA_TARIFA_ES')}</Grid>
                  <Grid item>&nbsp;<Badge color="primary" badgeContent={calculateTariff(values)} /></Grid>
                </Grid>
              </Box>
            }

            <div className={classes.actionsContainer}>
              {
                prevStep &&
                <Button
                  onClick={prevStep}
                  className={classes.button}
                  startIcon={<ArrowBackIosIcon />}
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
                  endIcon={<ArrowForwardIosIcon />}
                  disabled={(!values.changePhases && !values.changePower && !values.changeFare) || isSubmitting}
                >
                  {t('SEGUENT_PAS')}
                </Button>
              }
            </div>
          </form>
        )}
      </Formik>
    </Paper>
  )
}

export default React.memo(ModifyParams)
