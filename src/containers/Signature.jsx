import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Grid2 as Grid } from '@mui/material'

import Result from './Result'
import Loading from '../components/Loading'
import TextRecommendation from '../components/TextRecommendation/TextRecommendation'

import AlertBox from '../components/AlertBox/AlertBox'

const SignatureIframe = ({
  apiFunction,
  postData,
  textRecommendation,
  textInfo,
  errorDescription,
  onSignaturitCompleted = () => {},
  onCreateSignature = () => {}
}) => {
  const { t } = useTranslation()
  const [signaturitResponseURL, setSignaturitResponseURL] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [isValid, setValid] = useState(false)

  // Create callback when signaturit is success
  const signaturitHook = useCallback(
    (event) => {
      if (event?.data?.event !== 'completed') {
        return
      }

      onSignaturitCompleted()
      setValid(true)
    },
    [onSignaturitCompleted]
  )

  // Add iframe communication handler
  useEffect(() => {
    window.addEventListener('message', signaturitHook)
    // cleanup
    return () => window.removeEventListener('message', signaturitHook)
  }, [signaturitHook])

  useEffect(
    () => {
      if (!postData) {
        return
      }

      apiFunction(postData)
        .then(({ data }) => {
          setSignaturitResponseURL(data?.signaturit_url)
          onCreateSignature(data)
        })
        .catch((err) => {
          setError(true)
          console.log(err)
        })
        .finally(() => {
          setLoading(false)
        })
    },
    [
      /* empty prevents N re-renders calls */
    ]
  )

  return (
    <>
      {loading && (
        <Grid item size={12}>
          <Loading description="NEW_CONTRACT_SUBMIT_LOADING" />
        </Grid>
      )}

      {error && (
        <Result
          mode="failure"
          title={t('GENERIC_ERROR_TITLE')}
          description={errorDescription}
        />
      )}

      {!loading && !error && (
        <Grid container direction={'column'} gap={'1rem'}>
          <Grid item size={12}>
            <TextRecommendation title={textRecommendation} isHeader />
          </Grid>
          <Grid item size={12}>
            {textInfo && (
              <AlertBox
                textAlign="left"
                id="signature_info_alert"
                description={textInfo}
                severity={'warning'}
                variant={'body.md.regular'}
              />
            )}
          </Grid>

          <Grid item size={12} sx={{ textAlign: 'center', width: '100%' }}>
            {isValid ? (
              <Result
                mode="success"
                title={t('SIGNATURIT_COMPLETE_TITLE')}
                description={t('SIGNATURIT_COMPLETE_DESCRIPTION')}
              />
            ) : (
              <iframe
                title="signaturit_iframe"
                id="signature"
                src={signaturitResponseURL}
                style={{
                  height: '700px',
                  width: '100%',
                  border: '1px solid',
                  borderColor: 'secondary',
                  borderRadius: '5px'
                }}
              />
            )}
          </Grid>
        </Grid>
      )}
    </>
  )
}

export default SignatureIframe
