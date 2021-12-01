import React from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'

import Badge from '@material-ui/core/Badge'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Grid from '@material-ui/core/Grid'
import MenuItem from '@material-ui/core/MenuItem'
import Paper from '@material-ui/core/Paper'
import Switch from '@material-ui/core/Switch'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'

import Uploader from '../../components/Uploader'
import PowerInputs from '../../components/PowerInputs'
import Chooser from '../../components/Chooser'

import { calculateTariff, testPowerForPeriods } from '../../services/utils'
import { getRates } from '../../services/api'

const useStyles = makeStyles((theme) => ({
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
    setFieldValue('phases', '', false)
    setFieldValue('attachments', [], false)
  } else if (event.target.name === 'changePower' && values.changePower) {
    setFieldValue('power', '', false)
    setFieldValue('power2', '', false)
    setFieldValue('power3', '', false)
    setFieldValue('power4', '', false)
    setFieldValue('power5', '', false)
    setFieldValue('power6', '', false)
    setFieldValue('moreThan15Kw', false)
    setFieldValue('tariff', '2.0TD', false)
  }
  setFieldValue(event.target.name, event.target.checked)
}

const handleChangeMoreThan15 = (values, setFieldValue) => {
  const tariff = calculateTariff({ moreThan15Kw: !values.moreThan15Kw })
  setFieldValue('tariff', tariff, false)

  setFieldValue('power', '', false)
  setFieldValue('power2', '', false)
  setFieldValue('power3', '', false)
  setFieldValue('power4', '', false)
  setFieldValue('power5', '', false)
  setFieldValue('power6', '', false)

  setFieldValue('moreThan15Kw', !values.moreThan15Kw)
}

const ModifyParams = ({ nextStep, prevStep, handleStepChanges, params }) => {
  const classes = useStyles()
  const { t } = useTranslation()
  const rates = getRates()

  const ModifySchema = Yup.object().shape({
    changePower: Yup.bool(),
    changePhases: Yup.bool(),
    phases: Yup.string()
      .when('changePhases', {
        is: true,
        then: Yup.string().required(t('NO_MONOPHASE_CHOICE'))
      })
      .test(
        'noMoreThan15KwForMono',
        t('NO_MORE_THAN_15KW_FOR_MONO'),
        function () {
          return !(this.parent.phases === 'mono' && this.parent.moreThan15Kw)
        }
      ),
    attachments: Yup.array().when('changePhases', {
      is: true,
      then: Yup.array().min(1, t('NO_ATTACHMENTS'))
    }),
    moreThan15Kw: Yup.boolean().test(
      'noMoreThan15KwForMono',
      t('NO_MORE_THAN_15KW_FOR_MONO'),
      function () {
        return !(this.parent.phases === 'mono' && this.parent.moreThan15Kw)
      }
    ),
    power: Yup.number()
      .test('required', t('NO_POWER_CHOSEN_PX'), function () {
        return this.parent.changePower ? this.parent.power : true
      })
      .test({
        name: 'minPowerValue',
        test: function () {
          return testPowerForPeriods(
            rates,
            this.parent,
            'min_power',
            this.createError,
            t
          )
        }
      })
      .test({
        name: 'maxPowerValue',
        test: function () {
          return testPowerForPeriods(
            rates,
            this.parent,
            'max_power',
            this.createError,
            t
          )
        }
      }),
    power2: Yup.number()
      .test('required', t('NO_POWER_CHOSEN_PX'), function () {
        return this.parent.changePower &&
          rates[this.parent.tariff]?.num_power_periods >= 2
          ? this.parent.power2
          : true
      })
      .test('increasing', t('NO_POWER_INCREASING'), function () {
        return rates[this.parent.tariff]?.increasing
          ? parseFloat(this.parent.power2) >= parseFloat(this.parent.power)
          : true
      })
      .test({
        name: 'minPowerValue',
        test: function () {
          return testPowerForPeriods(
            rates,
            this.parent,
            'min_power',
            this.createError,
            t
          )
        }
      })
      .test({
        name: 'maxPowerValue',
        test: function () {
          return testPowerForPeriods(
            rates,
            this.parent,
            'max_power',
            this.createError,
            t
          )
        }
      }),
    power3: Yup.number()
      .test('required', t('NO_POWER_CHOSEN_PX'), function () {
        return this.parent.changePower &&
          rates[this.parent.tariff]?.num_power_periods >= 3
          ? this.parent.power3
          : true
      })
      .test('increasing', t('NO_POWER_INCREASING'), function () {
        return rates[this.parent.tariff]?.increasing
          ? parseFloat(this.parent.power3) >= parseFloat(this.parent.power2)
          : true
      })
      .test({
        name: 'minPowerValue',
        test: function () {
          return testPowerForPeriods(
            rates,
            this.parent,
            'min_power',
            this.createError,
            t
          )
        }
      })
      .test({
        name: 'maxPowerValue',
        test: function () {
          return testPowerForPeriods(
            rates,
            this.parent,
            'max_power',
            this.createError,
            t
          )
        }
      }),
    power4: Yup.number()
      .test('required', t('NO_POWER_CHOSEN_PX'), function () {
        return this.parent.changePower &&
          rates[this.parent.tariff]?.num_power_periods >= 4
          ? this.parent.power4
          : true
      })
      .test('increasing', t('NO_POWER_INCREASING'), function () {
        return rates[this.parent.tariff]?.increasing
          ? parseFloat(this.parent.power4) >= parseFloat(this.parent.power3)
          : true
      })
      .test({
        name: 'minPowerValue',
        test: function () {
          return testPowerForPeriods(
            rates,
            this.parent,
            'min_power',
            this.createError,
            t
          )
        }
      })
      .test({
        name: 'maxPowerValue',
        test: function () {
          return testPowerForPeriods(
            rates,
            this.parent,
            'max_power',
            this.createError,
            t
          )
        }
      }),
    power5: Yup.number()
      .test('required', t('NO_POWER_CHOSEN_PX'), function () {
        return this.parent.changePower &&
          rates[this.parent.tariff]?.num_power_periods >= 5
          ? this.parent.power5
          : true
      })
      .test('increasing', t('NO_POWER_INCREASING'), function () {
        return rates[this.parent.tariff]?.increasing
          ? parseFloat(this.parent.power5) >= parseFloat(this.parent.power4)
          : true
      })
      .test({
        name: 'minPowerValue',
        test: function () {
          return testPowerForPeriods(
            rates,
            this.parent,
            'min_power',
            this.createError,
            t
          )
        }
      })
      .test({
        name: 'maxPowerValue',
        test: function () {
          return testPowerForPeriods(
            rates,
            this.parent,
            'max_power',
            this.createError,
            t
          )
        }
      }),
    power6: Yup.number()
      .test('required', t('NO_POWER_CHOSEN_PX'), function () {
        return this.parent.changePower &&
          rates[this.parent.tariff]?.num_power_periods >= 6
          ? this.parent.power6
          : true
      })
      .test('increasing', t('NO_POWER_INCREASING'), function () {
        return rates[this.parent.tariff]?.increasing
          ? parseFloat(this.parent.power6) >= parseFloat(this.parent.power5)
          : true
      })
      .test({
        name: 'minPowerValue',
        test: function () {
          return testPowerForPeriods(
            rates,
            this.parent,
            'min_power',
            this.createError,
            t
          )
        }
      })
      .test({
        name: 'maxPowerValue',
        test: function () {
          return testPowerForPeriods(
            rates,
            this.parent,
            'max_power',
            this.createError,
            t
          )
        }
      })
  })

  return (
    <Paper className={classes.paperContainer} elevation={0}>
      <Formik
        initialValues={{
          ...{
            changePhases: false,
            phases: '',
            attachments: [],
            changePower: false,
            power: '',
            power2: '',
            power3: '',
            power4: '',
            power5: '',
            power6: '',
            power_attachments: [],
            moreThan15Kw: false,
            tariff: '2.0TD'
          },
          ...params
        }}
        validationSchema={ModifySchema}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(true)
          const tariff = calculateTariff(values)
          handleStepChanges({ modify: { ...values, tariff: tariff } })
          nextStep()
          setSubmitting(false)
        }}>
        {(props) => {
          const {
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            isSubmitting
          } = props

          return (
            <form onSubmit={handleSubmit} noValidate>
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
                      onChange={(event) =>
                        handleChangeModify(event, setFieldValue, values)
                      }
                      inputProps={{ 'aria-label': 'primary checkbox' }}
                      color="primary"
                      checked={values.changePower}
                    />
                  }
                />
              </Box>
              {values.changePower && (
                <Box mx={1} mb={0}>
                  <Chooser
                    name="moreThan15Kw"
                    condensed
                    question={t('POTENCIA_A_CONTRACTAR_CONTRACTACIO')}
                    onChange={(event) =>
                      handleChangeMoreThan15(values, setFieldValue)
                    }
                    value={values.moreThan15Kw}
                    options={[
                      {
                        value: false,
                        label: t('MENOR_IGUAL_A_15KW_CONTRACTACIO')
                      },
                      {
                        value: true,
                        label: t('MES_GRAN_DE_15KW_CONTRACTACIO')
                      }
                    ]}
                  />

                  {values.moreThan15Kw && (
                    <Box mt={2} mb={2}>
                      <Typography variant="body1">
                        {t('MORE_THAN_15KW_ADVICE')}
                      </Typography>
                    </Box>
                  )}

                  <Box mt={2} mb={0}>
                    <Typography variant="body1">
                      {t('NEW_TOLLS_AND_TARIFF_INFO')}
                    </Typography>
                  </Box>

                  <Box my={2}>
                    <FormHelperText
                      dangerouslySetInnerHTML={{
                        __html: t('POWER_PERIODS_MORE_INFO', {
                          tariff: values?.tariff,
                          url: values?.moreThan15Kw
                            ? t('POWER_PERIODS_30TD_MORE_INFO_URL')
                            : t('POWER_PERIODS_20TD_MORE_INFO_URL')
                        })
                      }}></FormHelperText>
                  </Box>

                  <PowerInputs
                    numInputs={rates[values?.tariff]?.num_power_periods}
                    {...props}
                  />

                  <Box mt={3} mb={1}>
                    <Typography>{t('POWER_ATTACHMENTS')}</Typography>
                  </Box>
                  <Box mt={1} mb={2}>
                    <Uploader
                      fieldError={
                        errors.power_attachments &&
                        touched.power_attachments &&
                        errors.power_attachments
                      }
                      callbackFn={(values) => {
                        setFieldValue('power_attachments', values)
                      }}
                      values={values.power_attachments}
                      maxFiles={5}
                    />
                  </Box>
                </Box>
              )}

              {values.changePower && values.power && (
                <Box mx={1} mb={3}>
                  <Grid container spacing={4}>
                    <Grid item>{t('LA_TEVA_TARIFA_ES')}</Grid>
                    <Grid item>
                      &nbsp;
                      <Badge
                        color="primary"
                        badgeContent={calculateTariff(values)}
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}

              <Box mx={1} mt={1} mb={3}>
                <FormHelperText
                  dangerouslySetInnerHTML={{
                    __html: t('HELP_POTENCIA', { url: t('HELP_POTENCIA_URL') })
                  }}></FormHelperText>
              </Box>

              <Box mx={1} mb={2}>
                <Divider />
              </Box>

              <Box mx={1} mt={1} mb={0}>
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
                      onChange={(event) =>
                        handleChangeModify(event, setFieldValue, values)
                      }
                      inputProps={{ 'aria-label': 'primary checkbox' }}
                      color="primary"
                      checked={values.changePhases}
                    />
                  }
                />
              </Box>
              {values.changePhases && (
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
                      error={errors.phases && touched.phases}
                      helperText={touched.phases && errors.phases}>
                      <MenuItem value="mono">{t('MONOFASICA_NORMAL')}</MenuItem>
                      <MenuItem value="tri">{t('TRIFASICA')}</MenuItem>
                    </TextField>
                  </Box>

                  <Box mt={3} mx={1} mb={1}>
                    <Typography>{t('INSTALL_TYPE_ATTACHMENTS')}</Typography>
                  </Box>
                  <Box mx={1} mt={1} mb={2}>
                    <Uploader
                      fieldError={
                        errors.attachments &&
                        touched.attachments &&
                        errors.attachments
                      }
                      callbackFn={(attachments) =>
                        setFieldValue('attachments', attachments)
                      }
                      values={values.attachments}
                      maxFiles={5}
                    />
                  </Box>
                </>
              )}
              <Box mx={1} mt={1} mb={3}>
                <FormHelperText
                  dangerouslySetInnerHTML={{
                    __html: t('HELP_INSTALL_TYPE', {
                      url: t('HELP_INSTALL_TYPE_URL')
                    })
                  }}></FormHelperText>
              </Box>

              <div className={classes.actionsContainer}>
                {prevStep && (
                  <Button
                    onClick={prevStep}
                    className={classes.button}
                    startIcon={<ArrowBackIosIcon />}>
                    {t('PAS_ANTERIOR')}
                  </Button>
                )}
                {nextStep && (
                  <Button
                    type="submit"
                    className={classes.button}
                    variant="contained"
                    color="primary"
                    endIcon={<ArrowForwardIosIcon />}
                    disabled={
                      (!values.changePhases && !values.changePower) ||
                      isSubmitting
                    }>
                    {t('SEGUENT_PAS')}
                  </Button>
                )}
              </div>
            </form>
          )
        }}
      </Formik>
    </Paper>
  )
}

export default React.memo(ModifyParams)
