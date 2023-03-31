import React from 'react'
import { useTranslation } from 'react-i18next'

import { makeStyles } from '@material-ui/core/styles'
import Checkbox from '@material-ui/core/Checkbox'
import Divider from '@material-ui/core/Divider'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import FormHelperText from '@material-ui/core/FormHelperText'

import Header from 'components/oficinavirtual/Header'
import TermsDialog from 'components/TermsDialog'
import GeneralTerms from 'components/GeneralTerms'

import IndexedReviewField from './IndexedReviewField'

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: 'white',
    padding: '24px'
  },
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
  divider: {
    marginTop: '12px',
    marginLeft: 0,
    marginRight: '32px'
  },
  dividerBottom: {
    marginTop: '10px',
    marginBottom: '10px',
    marginLeft: 0,
    marginRight: '32px'
  },
  prices: {
    marginBottom: '10px',
    display: 'flex',
    flexDirection: 'column',
    '& span': {
      paddingRight: '16px'
    }
  }
}))

const IndexedReviewData = (props) => {
  const classes = useStyles()
  const { t } = useTranslation()

  let {
    contractValues,
    values,
    open,
    indexadaTermsAccepted,
    handleIndexadaLegalTermsAccepted,
    indexadaLegalTermsAccepted,
    handleClick,
    handleAccept,
    handleClose,
    handleIndexadaTermsAccepted
  } = props
  const powers = JSON.parse(contractValues.powers)

  return (
    <>
      <Header>{t('REVIEW_TITLE')}</Header>
      <Grid container className={classes.root}>
        <Grid item xs={12}>
          <Typography
            variant="body1"
            dangerouslySetInnerHTML={{ __html: t('REVIEW_DESCRIPTION') }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography className={classes.sectionTitle} variant="h6">
            {t('SUMMARY_GROUP_PROCESS')}
          </Typography>
          <IndexedReviewField
            value={t('Modificació de tarifa comercialitzadora')}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography className={classes.sectionTitle} variant="h6">
            {t('SUPPLY')}
          </Typography>
          <IndexedReviewField
            label={t('CUPS_LABEL')}
            value={contractValues?.cups}
          />
          <IndexedReviewField
            label={t('ADDRESS')}
            value={contractValues?.address}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Divider variant="middle" className={classes.divider} />
          <Typography className={classes.sectionTitle} variant="h6">
            {t('HOLDER')}
          </Typography>
          <IndexedReviewField label={'NIF'} value={contractValues?.owner_vat} />
          <IndexedReviewField
            label={t('NAME')}
            value={contractValues?.owner_name}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Divider variant="middle" className={classes.divider} />

          <Typography className={classes.sectionTitle} variant="h6">
            {t('CONTACT')}
          </Typography>

          <>
            <IndexedReviewField
              label={t('PHONE')}
              value={contractValues?.owner_phone}
            />
            <IndexedReviewField
              label={t('EMAIL')}
              value={contractValues?.owner_email}
            />
            <IndexedReviewField
              label={t('LANGUAGE')}
              value={contractValues?.language}
            />
          </>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Divider variant="middle" className={classes.divider} />
          <Typography className={classes.sectionTitle} variant="h6">
            {t('SUMMARY_GROUP_TECHNICAL')}
          </Typography>
          <IndexedReviewField
            label={t('FARE')}
            value={contractValues?.tariff}
          />
          <IndexedReviewField label={t('PUNTA')} value={powers[0].power} />
          <IndexedReviewField label={t('VALLE')} value={powers[1].power} />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Divider variant="middle" className={classes.divider} />

          <Typography className={classes.sectionTitle} variant="h6">
            {t('SUMMARY_GROUP_PAYMENT')}
          </Typography>
          <IndexedReviewField label={t('IBAN')} value={contractValues?.iban} />
          <IndexedReviewField
            label={t('VOLUNTARY_CENT')}
            value={contractValues?.donation}
          />
        </Grid>

        <Grid item xs={12}>
          <FormHelperText
            className={classes.withoutLabel}
            dangerouslySetInnerHTML={{
              __html: t('HELPER_TEXT_MODIFY_DATA')
            }}
          />
        </Grid>
      </Grid>
      <Grid container className={classes.root}>
        <TermsDialog
          title={t('GENERAL_TERMS')}
          open={open}
          onAccept={handleAccept}
          onClose={handleClose}>
          <GeneralTerms />
        </TermsDialog>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                name="terms_accepted"
                id="change-tarif-terms-check"
                onClick={handleClick}
                checked={values.terms_accepted}
                color="primary"
              />
            }
            label={t('INDEXADA_ACCEPT_CONDITIONS')}
          />
          <Divider variant="middle" className={classes.dividerBottom} />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                id="change-tariff-indexada-terms-check"
                name="indexed_terms_accepted"
                onClick={() =>
                  handleIndexadaTermsAccepted(!indexadaTermsAccepted)
                }
                checked={values.indexed_terms_accepted}
                color="primary"
              />
            }
            label={t('INDEXADA_ACCEPT_TERMS')}
          />
          <Divider variant="middle" className={classes.dividerBottom} />
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                id="change-tariff-indexada-legal-terms-check"
                name="legal_terms_accepted"
                onClick={() =>
                  handleIndexadaLegalTermsAccepted(!indexadaLegalTermsAccepted)
                }
                checked={values.indexed_legal_terms_accepted}
                color="primary"
              />
            }
            label={
              <span
                dangerouslySetInnerHTML={{
                  __html: t('INDEXADA_ACCEPT_LEGAL_TERMS')
                }}
              />
            }
          />
        </Grid>
      </Grid>
    </>
  )
}

export default IndexedReviewData
