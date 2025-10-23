import React, { useEffect, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Typography from '@mui/material/Typography'
import { textHeader2 } from '../../gurbTheme'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

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
    <>
      <Typography sx={{ ...textHeader2, mb: 8 }}>
        {t('GURB_SIGNATURE')}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          width: '100%',
          marginBottom: '30px'
        }}>
        {loading ? (
          <>
            <CircularProgress color="secondary" />
          </>
        ) : (validSignature ? (<>Molt bé!</>) : (

          <iframe
            title="signaturit_iframe"
            id="iframe_signaturit"
            src={signaturitResponseUrl}
            style={{ height: '700px', width: '100%' }}
          />
        )
        )}
      </Box>
    </>
  )
}

export default GurbSignature
