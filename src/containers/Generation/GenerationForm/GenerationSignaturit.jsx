import React, { useCallback, useEffect, useState } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { styled } from '@mui/system'
import { useTranslation } from 'react-i18next'
import { createGenerationkWhSignature } from '../../../services/api'
import logo from '../../../images/logo.svg'

let signaturitHook = () => undefined

window.addEventListener('message', function (e) {
  signaturitHook(e)
})

const customStyles = {
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '700px',
    flexDirection: 'column',
    gap: "5px"
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: "20px"
  }
}

const StyledImg = styled('img')({
  width: '70px',
  margin: 2
})


function GenerationSignaturit(props) {
  const [signaturitResponseUrl, setSignaturitResponseUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [completed, setCompleted] = useState(false)
  const { i18n } = useTranslation()
  const { submit, values, setFieldValue, title, limitAmount } = props
  const { t } = useTranslation()

  const getSignaturit = useCallback(() => {
    createGenerationkWhSignature({
      partner_number: values?.member?.partner_number,
      nif: values?.member?.vat,
      full_name:
        values?.member?.name +
        ' ' +
        values?.member?.surname1 +
        ' ' +
        values?.member?.surname2,
      address: values?.member?.address,
      postal_code: values?.member?.postal_code,
      state: values?.member?.state.name,
      city: values?.member?.city.name,
      language: i18n.language,
      number_of_actions: values?.number_of_actions,
      iban: values?.payment?.iban,
      email: values?.member?.email,
      limit_amount_actions: limitAmount
    })
      .then((response) => {
        setLoading(false)
        setFieldValue('signaturit', response?.data?.signaturit)
        setFieldValue('mandate_name', response?.data?.mandate_name)
        setSignaturitResponseUrl(response?.data?.signaturit?.url)
      })
      .catch((err) => {
        setLoading(false)
        console.log(err)
      })
  }, [i18n, values, setFieldValue])

  signaturitHook = useCallback(
    (e) => {
      if (e?.data?.event === 'completed') {
        submit(values)
        setCompleted(true)
      }
    },
    [values, submit]
  )

  useEffect(() => {
    getSignaturit()
  }, [])

  return (
    <Box sx={customStyles.root}>
      <Typography component="h1" variant="h3">
        {title}
      </Typography>

      {loading || completed ? (
        <Box sx={customStyles.loading}>
          <StyledImg alt="Som Energia" src={logo} />
          <CircularProgress color="secondary" />
          {completed ? (
            <>
              <Typography
                variant="body2"
                dangerouslySetInnerHTML={{
                  __html: t('GENERATION_FORM_IN_PROCESS')
                }}
              />
            </>
          ) : null}
        </Box>
      ) : (
        <iframe
          title="signaturit_iframe"
          id="iframe_signaturit"
          src={signaturitResponseUrl}
          style={{ height: '700px', width: '100%' }}
        />
      )}
    </Box>
  )
}

export default GenerationSignaturit
