import React, { useEffect, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import CircularProgress from '@mui/material/CircularProgress'
import Grid from '@mui/material/Grid'

import AlertBox from '../../../../components/AlertBox'
import { createGurbSignature } from '../../../../services/apiGurb'
import Result from '../../../../containers/Result'
import TextRecomendation from '../../components/TextRecomendation'

import { participationAlertBoxTypography } from '../../gurbTheme'


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
      cups: values?.cups,
      vat: values?.owner?.nif
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
    <Grid container>
      <Grid item xs={12} sx={{ mb: 2 }}>
        <TextRecomendation title={t('GURB_SIGNATURE')} />
      </Grid>

      <Grid item xs={12}>
        <AlertBox
          typographySx={participationAlertBoxTypography}
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
          <Result
            mode="success"
            title={t('SIGNATURIT_COMPLETE_TITLE')}
            description={t('SIGNATURIT_COMPLETE_DESCRIPTION')}
          />
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
