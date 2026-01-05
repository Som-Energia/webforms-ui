import React, { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'

import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import TextField from '@mui/material/TextField'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import Box from '@mui/material/Box'

import { DatePicker } from '@mui/x-date-pickers/DatePicker'

import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined'

import Header from '../../components/oficinavirtual/Header'
import Card from '../../components/oficinavirtual/Card'
import LabelFieldRow from '../../components/oficinavirtual/LabelFieldRow'
import TermsDialog from '../../components/TermsDialog'
import LegalText from '../../components/LegalText'
import Loading from '../../components/NewLoading'

import { getNextNBussinesDays } from '../../services/utils'

import { getNationalHolidays } from '../../services/api'

const CancellationDetails = (props) => {
  const { values, setFieldValue, handleChange, handleBlur, errors, touched } =
    props
  const { t } = useTranslation()

  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [availableDates, setAvailableDates] = useState([])
  const [firstDate, setFirstDate] = useState(null)
  const [lastDate, setLastDate] = useState(null)

  useEffect(() => {
    setIsLoading(true)
    const today = dayjs()
    getNationalHolidays(today, today.add(30, 'days'))
      .then(({ data }) => {
        var dates = getNextNBussinesDays(today, 14, data)
        setAvailableDates(dates)
        setIsLoading(false)
      })
      .catch((error) => {
        const errorStatus = error?.response?.data?.state
          ? error?.response?.data?.state
          : false
        setAvailableDates([])
        setIsLoading(false)
      })
  }, [])

  useEffect(() => {
    if (availableDates.length > 0) {
      setFirstDate(availableDates[0])
      setLastDate(availableDates[availableDates.length - 1])
      setFieldValue(
        'date_action',
        dayjs(availableDates[0]).format('DD/MM/YYYY')
      )
    } else {
      setFirstDate(null)
      setLastDate(null)
    }
  }, [availableDates])

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
    if (!availableDates) return true
    var iso = date.format('YYYY-MM-DD')
    return !availableDates.includes(iso)
  }

  return isLoading ? (
    <Loading />
  ) : (
    <Box sx={{
      width: '100%',
      mb: '0.5rem',
      '#root & input[type="text"]': {
        fontSize: '14px !important',
        padding: '14px !important'
      }
    }}>
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
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {values.contract_cups === values.cups && (
                  <CheckOutlinedIcon color="primary" />
                )}
              </InputAdornment>
            )
          }}
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
          value={dayjs(values.date_action, 'DD/MM/YYYY')}
          onChange={handleDateChange}
          name="date_action"
          sx={{
            width: '100%',
            '& path': {
              color: 'secondary.dark'
            }
          }}
          inputVariant="outlined"
          variant="inline"
          autoOk
          disableToolbar
          minDate={dayjs(firstDate)}
          maxDate={dayjs(lastDate)}
          size="small"
          format="DD/MM/YYYY"
          shouldDisableDate={shouldDisableDate}
        />

        <FormHelperText
          component="span"
          sx={{
            pt: '4px',
            mb: '-0.25rem !important',
            color: '#c8071e'
          }}
          dangerouslySetInnerHTML={{ __html: t('CANCELLATION_DATE_HELPER') }}
        />
      </LabelFieldRow >
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
                sx={{
                  pt: '4px',
                  mb: '-0.25rem !important'
                }}
                dangerouslySetInnerHTML={{
                  __html: t('CANCELLATION_PHONE_HELPER')
                }}
              />
            )
          }
        />
      </LabelFieldRow>
      <Card sx={{
        mt: '4px',
        display: 'flex',
        flexDirection: 'column',
        padding: '0.75rem 1.5rem',
        '& .MuiFormControlLabel-label': {
          fontSize: '14px'
        }
      }}>
        <TermsDialog
          title={t('CANCELLATION_TERMS_TITLE')}
          open={open}
          onAccept={handleAccept}
          onClose={handleClose}>
          <LegalText documentName={'cancellation-terms'} />
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
    </Box >
  )
}

export default CancellationDetails
