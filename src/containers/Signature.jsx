import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import CircularProgress from '@mui/material/CircularProgress'
import { Grid2 as Grid } from '@mui/material'

import Result from './Result'
import TextRecommendation from '../components/TextRecommendation/TextRecommendation'

import AlertBox from '../components/AlertBox/AlertBox'

const SignatureIframe = ({
  apiFunction,
  postData,
  textRecommendation,
  textInfo,
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
      console.log('Signaturit has been completed', event)
    },
    [onSignaturitCompleted]
  )

  // Add iframe communication handler
  useEffect(() => {
    window.addEventListener('message', signaturitHook)
    // cleanup
    return () => window.removeEventListener('message', signaturitHook)
  }, [signaturitHook])

  useEffect(() => {
    apiFunction(postData)
      .then(({ data }) => {
        setSignaturitResponseURL(data?.lead?.signaturit_url)
        onCreateSignature(data)
      })
      .catch((err) => {
        setError(true)
        console.log(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [postData])

  return (
    <>
      {loading && (
        <Grid item size={12} sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress color="secondary" />
        </Grid>
      )}

      {error && (
        <Result
          mode="failure"
          title={t('GENERIC_ERROR_TITLE')}
          description={t('GENERIC_ERROR_DESCRIPTION')}
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
