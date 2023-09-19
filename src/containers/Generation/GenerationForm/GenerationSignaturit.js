import React, { useCallback, useEffect, useState } from 'react'
import {
  createGenerationkWhSignature
} from '../../../services/api'
import { useTranslation } from 'react-i18next'

let signaturitHook = () => undefined

window.addEventListener('message', function(e){signaturitHook(e)})

function GenerationSignaturit(props) {
  const [signaturitResponseUrl, setSignaturitResponseUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const { i18n } = useTranslation()
  const { submit, values, setFieldValue } = props

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
      email: values?.member?.email
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
      }
    },
    [values, submit]
  )

  useEffect(() => {
    getSignaturit()
  }, [])

  return (
    <div style={{ height: '100vh' }}>
      {loading ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          Loading...
        </div>
      ) : (
        <iframe
          title="signaturit_iframe"
          id="iframe_signaturit"
          src={signaturitResponseUrl}
          style={{ position: 'relative', height: '95%', width: '100%' }}
        />
      )}
    </div>
  )
}

export default GenerationSignaturit
