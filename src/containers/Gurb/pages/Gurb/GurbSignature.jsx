import React, { useEffect, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Grid from '@mui/material/Grid'

import AlertBox from '../../../../components/AlertBox'
import { textHeader2 } from '../../gurbTheme'
import { createGurbSignature } from '../../../../services/apiGurb'

let signaturitHook = () => undefined

window.addEventListener('message', function (e) {
  signaturitHook(e)
})

const GurbSignature = (props) => {
  const {
    values,
    setFieldValue,
    validSignature,
    setValidSignature,
    submit,
    gurbCode,
    setRedsysData
  } = props
  const { t } = useTranslation()
  const [signaturitResponseUrl, setSignaturitResponseUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const { i18n } = useTranslation()

  signaturitHook = useCallback(
    (e) => {
      if (e?.data?.event === 'completed') {
        setValidSignature(true)
        console.log('Signaturit has been completed', e)
      }
    },
    [values, submit]
  )

  const getSignaturit = useCallback(() => {
    createGurbSignature({
      lang: `${i18n.language}_ES`,
      gurb_code: gurbCode,
      access_tariff: values?.tariff_name,
      beta: values?.gurb?.power,
      cups: values?.cups
    })
      .then((response) => {
        setRedsysData(response?.data?.redsys_data)
        setSignaturitResponseUrl(response?.data?.signaturit_url)
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [i18n, values, setFieldValue])

  useEffect(() => {
    getSignaturit()
  }, [])

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Typography sx={{ ...textHeader2 }}>{t('GURB_SIGNATURE')}</Typography>
      </Grid>
      <Grid item xs={12}>
        <AlertBox
          id="percent_value_error"
          description={t('GURB_SIGNATURE_INFO')}
          severity={'warning'}
          variant={'body2'}
        />
      </Grid>
      <Grid item xs={12} style={{ textAlign: 'center', width: '100%' }}>
        {loading ? (
          <CircularProgress color="secondary" />
        ) : validSignature ? (
          <>Molt bé!</>
        ) : (
          <iframe
            title="signaturit_iframe"
            id="iframe_signaturit"
            src={signaturitResponseUrl}
            style={{ height: '700px', width: '100%' }}
          />
        )}
      </Grid>
    </Grid>
  )
}

export default GurbSignature
