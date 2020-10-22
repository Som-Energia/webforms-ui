import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import FormHelperText from '@material-ui/core/FormHelperText'

import StepHeader from '../../components/StepHeader'
import TermsDialog from '../../components/TermsDialog'

import { languages } from '../../services/utils'

import GeneralTerms from '../../components/GeneralTerms'

const useStyles = makeStyles((theme) => ({
  withoutLabel: {
    marginTop: theme.spacing(1)
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 500,
    textTransform: 'uppercase',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(1.2)
  },
  field: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(0.8)
  },
  label: {
    textTransform: 'uppercase',
    paddingRight: '12px',
    fontSize: '14px',
    fontWeight: 400,
    color: 'rgba(0, 0, 0, 0.54)'
  },
  value: {
    fontSize: '16px'
  }
}))

const Review = (props) => {
  const classes = useStyles()
  const { t } = useTranslation()
  const { values, setFieldValue } = props

  const [open, setOpen] = useState(false)

  const handleClick = (event) => {
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

  const ReviewField = ({ label, value }) => {
    return (
      <div className={classes.field}>
        <div className="field__title">
          <Typography className={classes.label} variant="subtitle2">{label}</Typography>
        </div>
        <div className="field__value">
          <Typography className={classes.value} variant="body2">{value}</Typography>
        </div>
      </div>
    )
  }

  return (
    <>
      <StepHeader title={t('REVIEW_MEMBER_TITLE')} />
      <Typography variant="body1"
        dangerouslySetInnerHTML={{ __html: t('REVIEW_DESCRIPTION') }}
      />
      <Grid container>
        <Grid item xs={12} sm={6}>
          <Typography className={classes.sectionTitle} variant="h6">{t('NEW_MEMBER')}</Typography>
          <ReviewField label={'NIF'} value={values?.member?.vat} />
          { values?.member?.isphisical
            ? <>
              <ReviewField label={t('NAME')} value={`${values?.member?.name} ${values?.member?.surname1} ${values?.member?.surname2}`} />
            </>
            : <>
              <ReviewField label={t('LEGAL_NAME')} value={values?.member?.name} />
              <ReviewField label={t('PROXY')} value={`${values?.member.proxyname}(${values?.member?.proxyvat})`} />
            </>
          }
          <ReviewField label={t('ADDRESS')} value={values?.member?.address} />
          <ReviewField label={t('CITY')} value={`${values?.member?.city.name} (${values?.member?.postal_code}) ${values?.member?.state.name}`} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography className={classes.sectionTitle} variant="h6">{t('CONTACT')}</Typography>
          <ReviewField label={t('PHONE')} value={values?.member?.phone1} />
          <ReviewField label={t('EMAIL')} value={values?.member?.email} />
          <ReviewField label={t('LANGUAGE')} value={languages[values?.member?.language]} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography className={classes.sectionTitle} variant="h6">{t('SUMMARY_GROUP_PAYMENT')}</Typography>
          <ReviewField label={t('PAYMENT_METHOD')} value={t(values?.payment?.payment_method.toUpperCase())} />
          { values?.payment?.payment_method === 'iban' &&
            <ReviewField label={t('IBAN')} value={values?.payment?.iban} />
          }

        </Grid>
      </Grid>

      <TermsDialog
        title={t('GENERAL_TERMS')}
        open={open}
        onAccept={handleAccept}
        onClose={handleClose}
      >
        <GeneralTerms />
      </TermsDialog>

      <Box mt={3}>
        <FormControlLabel
          control={
            <Checkbox
              onClick={handleClick}
              checked={values.terms_accepted}
              color="primary"
            />
          }
          label={t('COMENTAR_AMB_JURIDIC')}
        />
      </Box>
    </>
  )
}

export default Review
