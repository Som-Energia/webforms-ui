import React from "react"
import { useTranslation } from "react-i18next"

import Loading from "../Loading"

const PDFLoader = (props) => {
  const { i18n } = useTranslation()
  const { folder, documentName, language = `${i18n.language}_ES` } = props

  const [url, setUrl] = React.useState(undefined)

  React.useEffect(() => {
    const pdfUrl = `${import.meta.env.VITE_BACKOFFICE_URL}/storage/app/media/DOCS/legal/${language.slice(0, 2)}/${folder}/${documentName}.pdf`
    setUrl(pdfUrl)
  }, [documentName, language])

  return url === undefined ? (
    <Loading />
  ) : (
    <object
      data-cy="generic_conditions_modal"
      data={url}
      title="PDF"
      type="application/pdf"
      width="100%"
      height="100%"
      style={{ border: "none" }}
    />
  )
}

export default PDFLoader
