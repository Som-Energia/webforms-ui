import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'

import StepHeader from '../../../components/StepHeader'
import IBANField from '../../../components/IBANField'

import AddIcon from '@material-ui/icons/AddBox'
import RemoveIcon from '@material-ui/icons/IndeterminateCheckBox'
import Box from '@material-ui/core/Box'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { contributionParams } from '../../../services/utils'
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
  },
  noHover: {
    backgroundColor: 'white',
    padding: 0,
    margin: 0,
    minWidth: 0
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

  const handleActionsChange = (action) => {
    let nActions =
      action === 'add'
        ? values.number_of_actions + 1
        : values.number_of_actions - 1
    if (
      nActions <= contributionParams.generationMaxNumActions &&
      nActions >= contributionParams.generationMinAnnualUse
    ) {
      setFieldValue('number_of_actions', nActions)
      setFieldValue('payment.amount', nActions * ACTION_VALUE)
      changePercentProductionAnnualUse(nActions, values.annual_use)
    }
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
      percentProd = '% Erròni'
    }

    return (
      <Box id="box_percent_use">
        <Grid
          container
          style={{
            border: errors.percent_over_annual_use
              ? '1.5px #f44336 solid'
              : '0.5px lightgrey solid'
          }}>
          <Grid
            item
            style={{
              padding: '10px 2px 10px 2px',
              width: percentProd,
              height: '100%',
              backgroundColor: errors.percent_over_annual_use
                ? '#ff00001c'
                : '#96b633'
            }}>
            <Typography id="percent_value" style={{ margin: '0px 10px' }}>
              {percentProd}
            </Typography>
          </Grid>
        </Grid>
        <Typography variant="body1" className={classes.helperText}>
          {errors.percent_over_annual_use ? errors.percent_over_annual_use : ''}
        </Typography>
      </Box>
    )
  }, [
    values.percent_over_annual_use,
    classes.helperText,
    errors.percent_over_annual_use
  ])

  return (
    <>
      <StepHeader title={t('GENERATION_FORM_TITLE')} />
      <Typography variant="h6">
        {t('GENERATION_FORM_ANNUAL_USE_TITLE')}
      </Typography>
      <Box pt={1}>
        <Typography variant="body1">
          {t('GENERATION_FORM_ANNUAL_USE_INPUT_TITLE')}
        </Typography>
      </Box>
      <Box pt={1} id="box_annual_use">
        <TextField
          required
          id="annual_use"
          name="annual_use"
          variant="outlined"
          className={classes.icon}
          fullWidth
          label={t('GENERATION_FORM_ANNUAL_USE_INPUT_LABEL')}
          value={values?.annual_use}
          margin="normal"
          onChange={handleAnnualUseChange}
          onBlur={handleBlur}
          error={errors?.annual_use && touched?.annual_use}
          helperText={
            (touched?.annual_use && errors?.annual_use) ||
            t('GENERATION_FORM_ANNUAL_USE_INPUT_HELP_TEXT')
          }
        />
      </Box>
      <Box pt={1}>
        <Typography
          variant="h6"
          className={classes.title}
          dangerouslySetInnerHTML={{
            __html: t('GENERATION_FORM_ACTIONS_INPUT_TITLE', {
              name: values.member.full_name
            })
          }}
        />
        {/*TODO: POSAR ELS ESTILS CORRECTAMENT*/}
        <Grid container style={{ gap: '1rem' }}>
          <Grid item xs={12} md>
            <TextField
              required
              id="number_of_actions"
              name="number_of_actions"
              variant="outlined"
              className={classes.icon}
              fullWidth
              label={t('GENERATION_FORM_ACTIONS_INPUT_LABEL')}
              value={values?.number_of_actions}
              margin="normal"
              disabled
              onChange={handleActionsChange}
              onBlur={handleBlur}
              error={errors?.number_of_actions}
              helperText={
                errors?.number_of_actions ||
                t('GENERATION_FORM_ACTIONS_INPUT_HELP_TEXT')
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Button
                      id="remove_action"
                      aria-label="Remove action"
                      className={classes.noHover}
                      onClick={() => handleActionsChange('remove')}>
                      <RemoveIcon fontSize="large" />
                    </Button>
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      id="add_action"
                      aria-label="Add action"
                      className={classes.noHover}
                      onClick={() => handleActionsChange('add')}>
                      <AddIcon fontSize="large" />
                    </Button>
                  </InputAdornment>
                )
              }}
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
            __html: t('GENERATION_FORM_ACTIONS_DESC_TEXT', {
              url: t('GENERATION_FORM_ACTIONS_URL_INFO_ACTION')
            })
          }}
        />
        <Typography
          variant="body2"
          dangerouslySetInnerHTML={{
            __html: t('GENERATION_FORM_ACTION_MAX_ACTIONS_INFO')
          }}
        />
      </Box>
      <Box pt={1} mb={0}>
        <Typography
          variant="h6"
          className={`${classes.title} ${classes.titleWithMargin}`}>
          {t('GENERATION_FORM_PROD_ANNUAL')}
        </Typography>
        <Typography
          variant="body2"
          className={`${classes.title} ${classes.titleWithMargin}`}>
          {t('GENERATION_FORM_PERCENT_ANNUAL_USE_TITLE')}
        </Typography>
        <PercentProductionToAnnualUse />
        <Typography
          variant="body2"
          dangerouslySetInnerHTML={{
            __html: t('GENERATION_FORM_PERCENT_ANNUAL_USE_INFO', {
              url: t('GENERATION_FORM_PERCENT_ANNUAL_USE_URL_INFO')
            })
          }}
        />
      </Box>
      <Box id="box_iban_input" pt={1} mb={0}>
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
