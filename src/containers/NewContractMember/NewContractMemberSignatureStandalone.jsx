import { useContext, useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Grid2 as Grid } from '@mui/material'

import SignatureIframe from '../Signature'
import Result from '../Result'
import RedirectUrl from '../Gurb/components/RedirectUrl/RedirectUrl'
import Loading from '../../components/Loading'
import SubmitButton from '../../components/Buttons/SubmitButton'

import { activateLead, getContractSignature } from '../../services/api'
import { useSyncLanguage } from '../../hooks/useTranslateOptions'
import MatomoContext from '../../trackers/matomo/MatomoProvider'

const NewContractMemberSignatureStandalone = () => {
  const { t } = useTranslation()
  const { language, leadId } = useParams()
  const [searchParams] = useSearchParams()
  const cups = searchParams.get('cups')
  const gurbCode = searchParams.get('gurb-code')
  const { trackEvent } = useContext(MatomoContext)

  const [sending, setSending] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [error, setError] = useState(false)
  const [signatureCompleted, setSignatureCompleted] = useState(false)

  useSyncLanguage(language)

  useEffect(() => {
    trackEvent({
      category: 'NewContractMemberFunnel',
      action: 'paymentReturn',
      name: 'new-contract-member-payment-return-signature-standalone'
    })
  }, [trackEvent])

  const handleActivateLead = () => {
    if (!signatureCompleted) {
      return
    }

    if (!leadId) {
      setError(true)
      setCompleted(true)
      return
    }

    setSending(true)

    activateLead(leadId)
      .then(() => {
        setError(false)
      })
      .catch((err) => {
        setError(true)
        console.log(err)
      })
      .finally(() => {
        setCompleted(true)
        setSending(false)
      })
  }

  const handleSignatureCompleted = () => {
    trackEvent({
      category: 'NewContractMemberFunnel',
      action: 'signatureCompleted',
      name: 'new-contract-member-signature-completed-standalone'
    })
    setSignatureCompleted(true)
  }

  const handleCreateSignature = (data) => {
    if (!data?.signaturit_url) {
      return
    }

    trackEvent({
      category: 'NewContractMemberFunnel',
      action: 'signatureDocumentsViewed',
      name: 'new-contract-member-signature-documents-viewed-standalone'
    })
  }

  return (
    <Container
      data-cy="contract-signature-form"
      aria-label="contract-signature-form"
      maxWidth="md"
      disableGutters={true}
      sx={{
        padding: '2rem',
        backgroundColor: 'secondary.white',
        borderRadius: '10px'
      }}>
      {sending ? (
        <Loading description={t('NEW_CONTRACT_SUBMIT_LOADING')} />
      ) : completed ? (
        <Box sx={{ mt: 2 }}>
          {!error && gurbCode ? (
            <RedirectUrl
              title={t('GURB_REDIRECT_WHEN_CONTRACT_SUCCESS_TITLE')}
              description={t('GURB_REDIRECT_WHEN_CONTRACT_SUCCESS_DESCRIPTION')}
              url={t('GURB_REDIRECT_WHEN_CONTRACT_SUCCESS_BUTTON_URL', {
                gurbCode,
                language
              })}
              buttonText={t('GURB_REDIRECT_WHEN_CONTRACT_SUCCESS_BUTTON_TEXT')}
            />
          ) : (
            <Result
              mode={!error ? 'success' : 'failure'}
              title={
                !error
                  ? t('NEW_MEMBER_CONTRACT_SUCCESS_TITLE')
                  : t('NEW_MEMBER_CONTRACT_ERROR_TITLE')
              }>
              <Typography
                sx={{
                  color: 'secondary.extraDark',
                  textAlign: 'center'
                }}
                dangerouslySetInnerHTML={{
                  __html: !error
                    ? t('NEW_CONTRACT_SUCCESS_DESC')
                    : t('NEW_MEMBER_CONTRACT_ERROR_DESC')
                }}
              />
            </Result>
          )}
        </Box>
      ) : (
        <>
          <SignatureIframe
            apiFunction={getContractSignature}
            postData={{ leadId, cups }}
            textRecommendation={t('SIGNATURE')}
            textInfo={t('SIGNATURE_INFO')}
            onCreateSignature={handleCreateSignature}
            onSignaturitCompleted={handleSignatureCompleted}
          />
          <Grid
            container
            direction="row-reverse"
            rowSpacing={2}
            sx={{
              marginTop: '2rem',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
            <Grid item size={{ sm: 3, xs: 12 }}>
              <SubmitButton
                disabled={!signatureCompleted}
                onClick={() => handleActivateLead()}>
                {t('FINISH')}
              </SubmitButton>
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  )
}

export default NewContractMemberSignatureStandalone
