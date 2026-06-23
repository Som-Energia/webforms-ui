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
  const [text, setText] = React.useState()

  React.useEffect(() => {
    const url = `${import.meta.env.VITE_BACKOFFICE_URL}/storage/app/media/DOCS/legal/${language.slice(0,2)}/${folder}/${documentName}.pdf`
    setText(undefined)
    axios({
      method: 'GET',
      url: url,
      responseType: "blob"
    }).then((response) => {
      const pdfUrl = URL.createObjectURL(response?.data);
      setText(pdfUrl)
    }).catch(() => {
      console.log(`Error retrieving text ${url}`)
    })
  }, [documentName, language])

  return text === undefined
    ? <Loading />
    : <object
      data={text}
      title="PDF"
      type="application/pdf"
      width="100%"
      height="100%"
      style={{ border: "none" }}
    />

}

export default PDFLoader
