import React, { useState } from 'react'

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

const CancellationDetails = (props) => {
  const classes = useStyles()
  const { t } = useTranslation()

  const [open, setOpen] = useState(false)
  const [selectedDate, handleDateChange] = useState()

  const handleCheckBoxClick = (event) => {
    event.preventDefault()
    setOpen(true)
  }

  const handleAccept = () => {
    setOpen(false)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div className={classes.root}>
      <Header>{t('CANCELLATION_DETAILS_TITLE')}</Header>
      <LabelFieldRow label={t('CUPS')}>
        <TextField id="cups" fullWidth variant="outlined" size="small" />
      </LabelFieldRow>
      <LabelFieldRow label={t('CANCELLATION_DATE')}>
        <DatePicker
          id="date"
          fullWidth
          className={classes.icon}
          inputVariant="outlined"
          variant="inline"
          autoOk
          disableToolbar
          minDate={new Date()}
          size="small"
          format="DD/MM/YYYY"
          value={selectedDate}
          onChange={handleDateChange}
          InputProps={{
            startAdornment: (
              <IconButton edge="start" size="small">
                <TodayOutlinedIcon />
              </IconButton>
            )
          }}
        />
        <FormHelperText
          className={classes.helper}
          dangerouslySetInnerHTML={{ __html: t('CANCELLATION_DATE_HELPER') }}
        />
      </LabelFieldRow>
      <LabelFieldRow label={t('PHONE')}>
        <TextField id="phone" fullWidth variant="outlined" size="small" />
        <FormHelperText
          className={classes.helper}
          dangerouslySetInnerHTML={{ __html: t('CANCELLATION_PHONE_HELPER') }}
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
              onClick={() => false}
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
