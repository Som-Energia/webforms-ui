import React, { useCallback, useEffect, useState } from 'react'
import {createGenerationkWhSignature} from '../../../services/api'
import { useTranslation } from 'react-i18next'
function GenerationSignaturit(props) {
  const [signaturitResponse, setSignaturitResponse] = useState('')
  const {i18n} = useTranslation()
  const {submit, values} = props

  const getSignaturit = useCallback(() => {
    createGenerationkWhSignature({
      partner_number: values?.member?.number,
      nif: values?.member?.vat,
      full_name: values?.member?.name + " " +values?.member?.surname1+ " " + values?.member?.surname2,
      address: values?.member?.address,
      postal_code: values?.member?.postal_code,
      state: values?.member?.state.name,
      city: values?.member?.city.name,
      language: i18n.language,
      number_of_actions: values?.number_of_actions,
      amount: values?.payment?.amount,
      iban: values?.payment?.iban
    })
      .then((response) => {
        setSignaturitResponse(response.data)
      })
      .catch((err) => console.log(err))
  },[i18n,values])

  const signaturitDocResponse = useCallback((e) => {
    if (e.data.event === 'completed') {
      submit(values)
    }
  },[submit,values])

  useEffect(() => {
    window.addEventListener('message',signaturitDocResponse)
    getSignaturit()

    return () => window.removeEventListener("message", signaturitDocResponse);
  }, [getSignaturit,signaturitDocResponse])

  return (
    <div style={{height:"100vh"}}>
      <iframe
      id="iframe_signaturit"
        src={signaturitResponse.url}
        style={{position: "relative", height: "95%", width: "100%"}}
      />
    </div>
  )
}

export default GenerationSignaturit
