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
import LegalText from 'components/LegalText'

import IndexedReviewField from './IndexedReviewField'
import { Box } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: 'white',
    padding: '24px'
  },
  withoutLabel: {
    marginTop: theme.spacing(1)
  },
  sectionTitle: {
    fontSize: '16px',
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
    handleIndexadaTermsAccepted,
    targetTariff,
    isTariff20,
    isTariffIndexed,
    isIndexedPilotOngoing,
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
            value={t('PROCESS_TYPE_TARIFF_CHANGE')}
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
          <IndexedReviewField label={t('FARE')} value={targetTariff} />
          <Box id="tarif_powers">
            {isTariff20 ? (
              <>
                <IndexedReviewField
                  label={t('PEAK')}
                  value={powers[0].power.replaceAll('"', '')}
                />
                <IndexedReviewField
                  label={t('VALLEY')}
                  value={powers[1].power.replaceAll('"', '')}
                />
              </>
            ) : (
              <>
                {powers.map((element) => {
                  return (
                    <IndexedReviewField
                      key={element.value}
                      label={element.value}
                      value={element.power.replaceAll('"', '')}
                    />
                  )
                })}
              </>
            )}
          </Box>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Divider variant="middle" className={classes.divider} />

          <Typography className={classes.sectionTitle} variant="h6">
            {t('SUMMARY_GROUP_PAYMENT')}
          </Typography>
          <IndexedReviewField label={t('IBAN')} value={contractValues?.iban} />
          <IndexedReviewField
            label={t('VOLUNTARY_CENT')}
            value={contractValues?.donation ? 'Sí' : 'No'}
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
          <LegalText
            language={contractValues?.language}
            documentName={
              isTariffIndexed ? "general-contract-terms" : "general-and-indexed-specific-terms"
            }
          />
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
            label={
              <Typography
                variant="body2"
                dangerouslySetInnerHTML={{
                  __html: t(isTariffIndexed
                    ? 'PERIODS_ACCEPT_CONDITIONS'
                    : 'INDEXED_ACCEPT_CONDITIONS'
                    )
                }}
              />
            }
          />
          <Divider variant="middle" className={classes.dividerBottom} />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                id="change-tariff-indexada-terms-check"
                name="particular_contract_terms_accepted"
                onClick={() =>
                  handleIndexadaTermsAccepted(!indexadaTermsAccepted)
                }
                checked={values.particular_contract_terms_accepted}
                color="primary"
              />
            }
            label={
              <Typography
                variant="body2"
                dangerouslySetInnerHTML={{
                  __html: t(isTariffIndexed
                    ? 'PERIODS_ACCEPT_TERMS'
                    : 'INDEXED_ACCEPT_TERMS'
                  )
                }}
              />
            }
          />
          <Divider variant="middle" className={classes.dividerBottom} />

        </Grid>
        { !isTariffIndexed && isIndexedPilotOngoing && (
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
              <Typography
                variant="body2"
                dangerouslySetInnerHTML={{
                  __html: t('INDEXED_ACCEPT_LEGAL_TERMS', {
                    inscription_conditions_url: t(
                      'TARIFF_INDEXADA_INSCRIPTION_CONDITIONS_URL'
                    )
                  })
                }}
              />
            }
          />
        </Grid>
        )}
      </Grid>
    </>
  )
}

export default IndexedReviewData
