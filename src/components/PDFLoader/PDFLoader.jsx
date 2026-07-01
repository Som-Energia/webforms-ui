import axios from 'axios'
import React from 'react'
import Loading from '../Loading'
import { useTranslation } from 'react-i18next'

const PDFLoader = (props) => {
  const { i18n } = useTranslation()
  const {
    folder,
    documentName,
    language = `${i18n.language}_ES`,
  } = props

  const [url, setUrl] = React.useState(undefined)

  React.useEffect(() => {
    const pdfUrl = `${import.meta.env.VITE_BACKOFFICE_URL}/storage/app/media/DOCS/legal/${language.slice(0,2)}/${folder}/${documentName}.pdf`
    setUrl(pdfUrl)
  }, [documentName, language])

  return url === undefined
    ? <Loading />
    : <object
        data={url}
        title="PDF"
        type="application/pdf"
        width="100%"
        height="100%"
        style={{ border: "none" }}
      />

}

export default PDFLoader
