import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Checkbox from '@material-ui/core/Checkbox'
import Divider from '@material-ui/core/Divider'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import FormHelperText from '@material-ui/core/FormHelperText'

import StepHeader from '../../components/StepHeader'
import TermsDialog from '../../components/TermsDialog'

import { languages } from '../../services/utils'

// import generalTerms from '../../data/HolderChange/generalterms-es.html'
import GeneralTerms from '../../components/GeneralTerms'

const useStyles = makeStyles((theme) => ({
  withoutLabel: {
    marginTop: theme.spacing(1)
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 500,
    textTransform: 'uppercase',
    marginTop: theme.spacing(2),
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
  },
  divider: {
    marginTop: '12px',
    marginLeft: 0,
    marginRight: '32px'
  },
  dividerBottom: {
    marginTop: '24px',
    marginLeft: 0,
    marginRight: '32px'
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
      <StepHeader title={t('REVIEW_TITLE')} />
      <Typography variant="body1"
        dangerouslySetInnerHTML={{ __html: t('REVIEW_DESCRIPTION') }}
      />
      <Grid container>
        <Grid item xs={12} sm={6}>
          <Typography className={classes.sectionTitle} variant="h6">{t('SUMMARY_GROUP_PROCESS')}</Typography>
          <ReviewField label={t('PROCESS_TYPE')} value={t('PROCESS_TYPE_HOLDER_CHANGE')} />
          { values?.especial_cases?.reason_death &&
            <ReviewField label={t('SPECIAL_CASES_TITLE')} value={t('SPECIAL_CASES_DEATH')} />
          }
          {
            values?.especial_cases?.reason_merge &&
            <ReviewField label={t('SPECIAL_CASES_TITLE')} value={t('SPECIAL_CASES_MERGE')} />
          }
          {
            values?.especial_cases?.reason_electrodep &&
            <ReviewField label={t('SPECIAL_CASES_TITLE')} value={t('SPECIAL_CASES_ELECTRODEP')} />
          }
          <ReviewField label={t('RELATED_MEMBER')} value={ (`${values?.holder?.name} ${values?.holder?.surname1} ${values?.holder?.surname2}`) } />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography className={classes.sectionTitle} variant="h6">{t('SUPPLY')}</Typography>
          <ReviewField label={t('CUPS_LABEL')} value={values?.supply_point?.cups} />
          <ReviewField label={t('ADDRESS')} value={values?.supply_point?.address} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Divider variant="middle" className={classes.divider} />
          <Typography className={classes.sectionTitle} variant="h6">{t('HOLDER')}</Typography>
          <ReviewField label={'NIF'} value={values?.holder?.vat} />
          { values?.holder?.isphisical
            ? <>
              <ReviewField label={t('NAME')} value={`${values?.holder?.name} ${values?.holder?.surname1} ${values?.holder?.surname2}`} />
            </>
            : <>
              <ReviewField label={t('LEGAL_NAME')} value={values?.holder?.name} />
              <ReviewField label={t('PROXY')} value={`${values?.holder.proxyname}(${values?.holder?.proxynif})`} />
            </>
          }
          <ReviewField label={t('ADDRESS')} value={`${values?.holder?.address}, ${values?.holder?.number} ${values?.holder?.floor} ${values?.holder?.door}`} />
          <ReviewField label={t('CITY')} value={`${values?.holder?.city.name} (${values?.holder?.postal_code}) ${values?.holder?.state.name}`} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Divider variant="middle" className={classes.divider} />
          <Typography className={classes.sectionTitle} variant="h6">{t('CONTACT')}</Typography>
          <ReviewField label={t('PHONE')} value={values?.holder?.phone1} />
          <ReviewField label={t('EMAIL')} value={values?.holder?.email} />
          <ReviewField label={t('LANGUAGE')} value={languages[values?.holder?.language]} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Divider variant="middle" className={classes.divider} />
          <Typography className={classes.sectionTitle} variant="h6">{t('SUMMARY_GROUP_TECHNICAL')}</Typography>
          <ReviewField label={t('FARE')} value={t('FARE_SAME')} />
          <ReviewField label={t('POWER')} value={t('POWER_SAME')} />
          <FormHelperText className={classes.withoutLabel} dangerouslySetInnerHTML={{ __html: t('FARE_POWER_CHANGE_NOTE') }} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Divider variant="middle" className={classes.divider} />
          <Typography className={classes.sectionTitle} variant="h6">{t('SUMMARY_GROUP_PAYMENT')}</Typography>
          <ReviewField label={t('IBAN')} value={values?.payment?.iban} />
          <ReviewField label={t('VOLUNTARY_CENT')} value={values?.payment?.voluntary_cent ? t('YES') : t('NO')} />
        </Grid>
      </Grid>

      <Divider variant="middle" className={classes.dividerBottom} />

      <TermsDialog
        title={t('GENERAL_TERMS')}
        open={open}
        onAccept={handleAccept}
        onClose={handleClose}
      >
        <GeneralTerms />
      </TermsDialog>

      <Box mt={2}>
        <FormControlLabel
          control={
            <Checkbox
              onClick={handleClick}
              checked={values.terms_accepted}
              color="primary"
            />
          }
          label={t('ACCEPT_TERMS')}
        />
      </Box>
    </>
  )
}

export default Review
