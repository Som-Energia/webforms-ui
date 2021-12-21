import React, { useState } from 'react'
import dayjs from 'dayjs'

import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'

import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import TextField from '@material-ui/core/TextField'
import FormHelperText from '@material-ui/core/FormHelperText'
import IconButton from '@material-ui/core/IconButton'

import { DatePicker } from '@material-ui/pickers'

import TodayOutlinedIcon from '@material-ui/icons/TodayOutlined'

import Header from '../../components/oficinavirtual/Header'
import Card from '../../components/oficinavirtual/Card'
import LabelFieldRow from '../../components/oficinavirtual/LabelFieldRow'
import TermsDialog from '../../components/TermsDialog'
import GeneralTerms from '../../components/GeneralTerms'

import { nationalHolidays, getNextBussinessDay } from '../../services/utils'

const CancellationDetails = (props) => {
  const { values, setFieldValue, handleChange, handleBlur, errors, touched } =
    props
  const classes = useStyles()
  const { t } = useTranslation()
  const nextBussinesDay = getNextBussinessDay()

  const [open, setOpen] = useState(false)

  const handleDateChange = (date) => {
    setFieldValue('date_action', date.format('DD/MM/YYYY'))
  }

  const handleCheckBoxClick = (event) => {
    event.preventDefault()
    setOpen(true)
  }

  const handleAccept = () => {
    setOpen(false)
    setFieldValue('terms_accepted', true)
  }

  const handleClose = () => {
    setOpen(false)
    setFieldValue('terms_accepted', false)
  }

  const handlePrivacyPolicy = () => {
    setFieldValue('privacy_policy', !values?.privacy_policy)
  }

  const shouldDisableDate = (date) => {
    if (dayjs().isSame(date)) {
      return true
    }
    if (date.day() === 0 || date.day() === 6) {
      return true
    }
    if (nationalHolidays.includes(date.format('DD/MM'))) {
      return true
    }
    return false
  }

  return (
    <div className={classes.root}>
      <Header>{t('CANCELLATION_DETAILS_TITLE')}</Header>
      <LabelFieldRow label={t('CUPS')}>
        <TextField
          id="cups"
          name="cups"
          fullWidth
          variant="outlined"
          size="small"
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors?.cups && touched?.cups}
          helperText={
            touched?.cups && (
              <span
                dangerouslySetInnerHTML={{
                  __html: errors?.cups
                }}
              />
            )
          }
        />
      </LabelFieldRow>
      <LabelFieldRow label={t('CANCELLATION_DATE')}>
        <DatePicker
          name="date_action"
          fullWidth
          className={classes.icon}
          inputVariant="outlined"
          variant="inline"
          autoOk
          disableToolbar
          minDate={nextBussinesDay}
          size="small"
          format="DD/MM/YYYY"
          value={dayjs(values.date_action, 'DD/MM/YYYY')}
          onChange={handleDateChange}
          shouldDisableDate={shouldDisableDate}
          InputProps={{
            startAdornment: (
              <IconButton edge="start" size="small">
                <TodayOutlinedIcon />
              </IconButton>
            )
          }}
        />
        <FormHelperText
          component="span"
          className={classes.helper}
          dangerouslySetInnerHTML={{ __html: t('CANCELLATION_DATE_HELPER') }}
        />
      </LabelFieldRow>
      <LabelFieldRow label={t('PHONE')}>
        <TextField
          id="phone"
          name="phone"
          fullWidth
          variant="outlined"
          size="small"
          value={values.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors?.phone && touched?.phone}
          helperText={
            (errors?.phone && touched?.phone && (
              <span
                dangerouslySetInnerHTML={{
                  __html: errors?.phone
                }}
              />
            )) || (
              <FormHelperText
                component="span"
                className={classes.helper}
                dangerouslySetInnerHTML={{
                  __html: t('CANCELLATION_PHONE_HELPER')
                }}
              />
            )
          }
        />
      </LabelFieldRow>
      <Card className={classes.legalChecks}>
        <TermsDialog
          title={t('GENERAL_TERMS')}
          open={open}
          onAccept={handleAccept}
          onClose={handleClose}>
          <GeneralTerms />
        </TermsDialog>

        <FormControlLabel
          control={
            <Checkbox
              name="privacy_policy"
              checked={values.privacy_policy}
              onClick={handlePrivacyPolicy}
              color="primary"
            />
          }
          label={
            <label
              dangerouslySetInnerHTML={{
                __html: t('ACCEPT_PRIVACY_POLICY', {
                  url: t('ACCEPT_PRIVACY_POLICY_URL')
                })
              }}
            />
          }
        />

        <FormControlLabel
          control={
            <Checkbox
              name="terms_accepted"
              checked={values.terms_accepted}
              onClick={handleCheckBoxClick}
              color="primary"
            />
          }
          label={t('CANCELLATION_TERMS')}
        />
      </Card>
    </div>
  )
}

export default CancellationDetails

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginBottom: '0.5rem',
    '#root & input[type="text"]': {
      fontSize: '14px !important',
      padding: '14px !important'
    }
  },
  helper: {
    paddingTop: '4px',
    marginBottom: '-0.25rem !important'
  },
  legalChecks: {
    marginTop: '4px',
    display: 'flex',
    flexDirection: 'column',
    padding: '0.75rem 1.5rem',
    '& .MuiFormControlLabel-label': {
      fontSize: '14px !important'
    }
  },
  icon: {
    '& path': {
      color: 'rgba(0, 0, 0, 0.54)'
    }
  }
}))
