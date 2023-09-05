import React, { useCallback, useEffect, useState } from 'react'
import {createGenerationkWhSignature} from '../../../services/api'

function GenerationSignaturit(props) {
  const [signaturitURL, setSignaturitURL] = useState()


  const getSignaturit = useCallback(() => {
    createGenerationkWhSignature()
      .then((response) => {
        setSignaturitURL(response.data.url)
      })
      .catch((err) => console.log(err))
  },[])

  useEffect(() => {
    getSignaturit()
  }, [getSignaturit])


  console.log("SIGNATURIT_URL",signaturitURL)

  return (
    <div>
      <iframe
      id="iframe_signaturit"
        src={signaturitURL}
        style={{position: "absolute",top: 0, left: 0, height: "920px", width: "1900px"}}
      />
      {window.addEventListener('message', function (e) {
        // e.data.event       = EVENT_TYPE
        // e.data.documentId  = DOCUMENT_ID
        // e.data.signatureId = SIGNATURE_ID
        if (e.data.event === 'completed') {
          console.log(e.data)
        }
      })}
    </div>
  )
}

export default GenerationSignaturit
