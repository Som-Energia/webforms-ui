import axios from 'axios'
import React from 'react'
import Loading from './Loading'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import Typography from '@mui/material/Typography'

const TextLoader = props => {
  const { i18n } = useTranslation()
  const {
    documentName,
    language = `${i18n.language}_ES`,
  } = props
  const [text, setText] = React.useState()

  React.useEffect(() => {
    //const url = `${import.meta.env.BASE_URL}static/docs/${language.slice(0, 2)}/${documentName}.html`
    const url = 'https://back.somenergia.coop/storage/app/media/DOCS/Condicions-Generals-contracte-subministrament-energia-electrica-SomEnergia.pdf'
    setText(undefined)
    axios({
      method: 'GET',
      url: url,
      responseType: "blob"
    }).then((response) => {
      const pdfUrl = URL.createObjectURL(response?.data);
      setText(pdfUrl)
    }).catch((error) => {
      console.log(`Error retrieving text ${url}`)
    })
  }, [documentName, language])

  return text === undefined
    ? <Loading />
    : <div variant="body1" sx={{ 'a': { textDecoration: 'none', color:'secondary.dark' } }}>
        {text && (
          <embed
            src={text}
            title="PDF"
            width="100%"
            height="100%"
            style={{ border: "none" }}
          />
        )}
      </div>
}

export const Test = () => {
  const { i18n } = useTranslation()
  const { language } = useParams()

  React.useEffect(() => {
    i18n.changeLanguage(language)
  }, [language, i18n])

  return <TextLoader
    documentName='general-and-indexed-specific-terms'
  />
}
export default TextLoader
