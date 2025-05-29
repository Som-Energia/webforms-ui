import React from 'react'
import { useTranslation } from 'react-i18next'

import Checkbox from '@mui/material/Checkbox'
import Divider from '@mui/material/Divider'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import FormHelperText from '@mui/material/FormHelperText'

import Header from '../../components/oficinavirtual/Header'
import TermsDialog from '../../components/TermsDialog'
import LegalText from '../../components/LegalText'

import IndexedReviewField from './IndexedReviewField'
import Box from '@mui/material/Box'

const customStyles ={
  root: {
    backgroundColor: 'white',
    padding: '24px'
  },
  withoutLabel: {
    mt: 1
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: 500,
    textTransform: 'uppercase',
    mt: 3,
    mb: 1.2,
    color:'#0B2E34'
  },
  divider: {
    mt: '12px',
    ml: 0,
    mr: '32px'
  },
  dividerBottom: {
    mt: '10px',
    mb: '10px',
    ml: 0,
    mr: '32px'
  },
  prices: {
    mb: '10px',
    display: 'flex',
    flexDirection: 'column',
    '& span': {
      pr: '16px'
    }
  }
}

const IndexedReviewData = (props) => {
  
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
    isIndexedPilotOngoing
  } = props
  const powers = JSON.parse(contractValues.powers)

  return (
    <>
      <Header>{t('REVIEW_TITLE')}</Header>
      <Grid container sx={customStyles.root}>
        <Grid item xs={12}>
          <Typography
            variant="subtitle1"
            dangerouslySetInnerHTML={{ __html: t('REVIEW_DESCRIPTION') }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography sx={customStyles.sectionTitle} variant="h6">
            {t('SUMMARY_GROUP_PROCESS')}
          </Typography>
          <IndexedReviewField value={t('PROCESS_TYPE_TARIFF_CHANGE')} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography sx={customStyles.sectionTitle} variant="h6">
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
          <Divider variant="middle" sx={customStyles.divider} />
          <Typography sx={customStyles.sectionTitle} variant="h6">
            {t('HOLDER')}
          </Typography>
          <IndexedReviewField label={'NIF'} value={contractValues?.owner_vat} />
          <IndexedReviewField
            label={t('NAME')}
            value={contractValues?.owner_name}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Divider variant="middle" sx={customStyles.divider} />

          <Typography sx={customStyles.sectionTitle} variant="h6">
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
          <Divider variant="middle" sx={customStyles.divider} />
          <Typography sx={customStyles.sectionTitle} variant="h6">
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
          <Divider variant="middle" sx={customStyles.divider} />

          <Typography sx={customStyles.sectionTitle} variant="h6">
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
            sx={customStyles.withoutLabel}
            dangerouslySetInnerHTML={{
              __html: t('HELPER_TEXT_MODIFY_DATA')
            }}
          />
        </Grid>
      </Grid>
      <Grid container sx={customStyles.root}>
        <TermsDialog
          title={t('GENERAL_TERMS')}
          open={open}
          onAccept={handleAccept}
          onClose={handleClose}>
          <LegalText
            documentName={
              isTariffIndexed
                ? 'general-contract-terms'
                : 'general-and-indexed-specific-terms'
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
                  __html: isTariffIndexed
                    ? t('PERIODS_ACCEPT_CONDITIONS')
                    : t('INDEXED_ACCEPT_CONDITIONS')
                }}
              />
            }
          />
          <Divider variant="middle" sx={customStyles.dividerBottom} />
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
                  __html: isTariffIndexed
                    ? t('PERIODS_ACCEPT_TERMS')
                    : t('INDEXED_ACCEPT_TERMS')
                }}
              />
            }
          />
          <Divider variant="middle" sx={customStyles.dividerBottom} />
        </Grid>
        {!isTariffIndexed && isIndexedPilotOngoing && (
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  id="change-tariff-indexada-legal-terms-check"
                  name="legal_terms_accepted"
                  onClick={() =>
                    handleIndexadaLegalTermsAccepted(
                      !indexadaLegalTermsAccepted
                    )
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
