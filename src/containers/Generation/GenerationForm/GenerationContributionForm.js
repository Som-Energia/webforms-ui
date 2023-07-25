import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'

import StepHeader from '../../../components/StepHeader'
import IBANField from '../../../components/IBANField'

import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import EuroIcon from '@material-ui/icons/EuroRounded'

const ACTION_VALUE = 100
const KWH_ACTION = 170

const useStyles = makeStyles((theme) => ({
  title: {
    fontSize: '1rem',
    marginTop: theme.spacing(2),
    paddingBottom: theme.spacing(1)
  },
  titleWithMargin: {
    marginBottom: theme.spacing(2)
  },
  icon: {
    '& path': {
      color: 'rgba(0, 0, 0, 0.54)'
    }
  },
  helperText: {
    marginLeft: '14px',
    color: '#f44336',
    fontSize: '0.75rem',
    marginTop: '3px',
    textAlign: 'left',
    fontWeight: '400',
    lineHeight: '1.66',
    letterSpacing: '0.03333em'
  }
}))

const GenerationContributionForm = (props) => {
  const { values, handleBlur, errors, touched, setFieldValue } = props

  const { t } = useTranslation()
  const classes = useStyles()

  const handleIBANChange = ({ IBAN, IBANValid }) => {
    setFieldValue('payment.iban', IBAN, false)
    setFieldValue('payment.iban_valid', IBANValid)
  }

  const handleActionsChange = (event) => {
    const nActions = event.target.value
    setFieldValue('number_of_actions', nActions)
    setFieldValue('payment.amount', nActions * ACTION_VALUE)
    changePercentProductionAnnualUse(nActions, values.annual_use)
  }

  const handleAnnualUseChange = (event) => {
    const annualUse = event.target.value
    setFieldValue('annual_use', annualUse)
    changePercentProductionAnnualUse(values.number_of_actions, annualUse)
  }

  const changePercentProductionAnnualUse = (nActions, annualUse) => {
    let percentNum = 0
    if (nActions !== 0) {
      percentNum = ((nActions * KWH_ACTION * 100) / annualUse).toFixed(2)
    }
    setFieldValue('percent_over_annual_use', percentNum)
  }

  const PercentProductionToAnnualUse = useCallback(() => {
    let percentProd = values.percent_over_annual_use + '%'
    if (
      isNaN(values.percent_over_annual_use) ||
      !isFinite(values.percent_over_annual_use)
    ) {
      percentProd = '0%'
    }

    return (
      <>
        <Grid container style={{ border: '0.5px lightgrey solid' }}>
          <Grid
            item
            style={{
              padding: '10px',
              width: percentProd,
              height: '100%',
              backgroundColor: '#96b633'
            }}>
            <Typography>{percentProd}</Typography>
          </Grid>
        </Grid>
        <Typography variant="body1" className={classes.helperText}>
          {errors.percent_over_annual_use
            ? errors.percent_over_annual_use
            : ""}
        </Typography>
      </>
    )
  }, [
    values.percent_over_annual_use,
    classes.helperText,
    errors.percent_over_annual_use
  ])

  return (
    <>
      <StepHeader
        title={t('FORMULARIO DE PARTICIPACIÓN GENERATION KWH -trans')}
      />
      <Typography variant="h6">{t('Uso electrico anual- trans')}</Typography>
      <Box pt={1}>
        <Typography variant="body1">
          {t(
            'Introduce la cantidad de electricidad que usas anualmente (p.e.2500) - trans'
          )}
        </Typography>
      </Box>

      <TextField
        required
        id="annual-use"
        name="annual_use"
        variant="outlined"
        className={classes.icon}
        fullWidth
        label={t('Consumo anual kWh - trans')}
        value={values?.annual_use}
        margin="normal"
        onChange={handleAnnualUseChange}
        onBlur={handleBlur}
        error={errors?.annual_use && touched?.annual_use}
        helperText={
          (touched?.annual_use && errors?.annual_use) || 'Por ejemplo 2500'
        }
      />

      <Box pt={1}>
        <Typography
          variant="h6"
          className={classes.title}
          dangerouslySetInnerHTML={{
            __html: t('CUANTAS ACCIONES ENERGETICAS QUIERES? - trans', {
              name: values.member.full_name
            })
          }}
        />
        {/*TODO: POSAR ELS ESTILS CORRECTAMENT*/}
        <Grid container style={{ gap: '1rem' }}>
          <Grid item xs={12} md>
            <TextField
              type="number"
              required
              id="number_of_actions"
              name="number_of_actions"
              variant="outlined"
              className={classes.icon}
              fullWidth
              label={t('ACCIONES ENERGETICAS')}
              value={values?.number_of_actions}
              margin="normal"
              onChange={handleActionsChange}
              onBlur={handleBlur}
              error={errors?.number_of_actions && touched?.number_of_actions}
              helperText={
                (touched?.number_of_actions && errors?.number_of_actions) ||
                'Por ejemplo 2 acciones correspondrian a: 200€'
              }
            />
          </Grid>
          <Grid item xs={12} md>
            <TextField
              required
              id="amount"
              name="payment.amount"
              variant="outlined"
              className={classes.icon}
              fullWidth
              disabled
              value={values?.payment?.amount}
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <EuroIcon />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
        </Grid>
      </Box>
      <Box pt={1} mb={0}>
        <Typography
          variant="body1"
          className={`${classes.title} ${classes.titleWithMargin}`}
          dangerouslySetInnerHTML={{
            __html: t(
              'Cada acció energètica representa un préstec de 100€ que fas a la cooperativa. A cada acció energètica li corresponen aproximadament 170 kWh cada any, provinents de les plantes vinculades al Generation kWh. Més informació. - trans',
              {
                name: values.member.full_name
              }
            )
          }}
        />
        <Typography
          variant="body2"
          dangerouslySetInnerHTML={{
            __html: t(
              ' *Màxim 49 Accions Energètiques. Per valors superiors, posa’t en contacte amb nosaltres a generationkwh@somenergia.coop. - trans',
              {
                name: values.member.full_name
              }
            )
          }}
        />
      </Box>
      <Box pt={1} mb={0}>
        <Typography
          variant="h6"
          className={`${classes.title} ${classes.titleWithMargin}`}>
          {t('AUTOPRODUCCIÓN ALCANZADA ANUALMENTE - trans')}
        </Typography>
        <Typography
          variant="body"
          className={`${classes.title} ${classes.titleWithMargin}`}>
          {t('PORCENTAJE DE PRODUCCION SOBRE TÚ USO TOTAL')}
        </Typography>
        <PercentProductionToAnnualUse />
      </Box>
      <Box pt={1} mb={0}>
        <Typography
          variant="h6"
          className={`${classes.title} ${classes.titleWithMargin}`}
          dangerouslySetInnerHTML={{
            __html: t('CONTRIBUTION_IBAN_TITLE', {
              name: values.member.full_name
            })
          }}
        />
        <IBANField
          id="iban"
          name="payment.iban"
          label={t('IBAN_LABEL')}
          onChange={handleIBANChange}
          onBlur={handleBlur}
          value={values?.payment?.iban}
          error={
            (errors?.payment?.iban || errors?.payment?.iban_valid) &&
            touched?.payment?.iban
          }
          helperText={
            (touched?.payment?.iban &&
              (errors?.payment?.iban || errors?.payment?.iban_valid)) ||
            t('IBAN_HELP')
          }
          variant="outlined"
        />
      </Box>
    </>
  )
}

export default GenerationContributionForm
