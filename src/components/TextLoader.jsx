import axios from 'axios'
import React from 'react'
import Loading from './Loading'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

const TextLoader = props => {
  const { i18n } = useTranslation()
  const {
    documentName,
    language =`${i18n.language}_ES`,
  } = props
  const [ text, setText ] = React.useState()

  React.useEffect(()=>{
    const url = `${process.env.PUBLIC_URL}/static/docs/${language.slice(0,2)}/${documentName}.html`
    setText(undefined)
    axios({
      method: 'GET',
      url: url,
      //headers: {Authorization: data.token},
    }).then((response) => {
      setText(response?.data)
    }).catch((error) => {
      console.log(`Error retrieving text ${url}`)
    })
  }, [documentName, language])

  return text === undefined
    ? <Loading/>
    : <span dangerouslySetInnerHTML={{ __html: text }} />
}

export const Test = () => {
  const { i18n } = useTranslation()
  const {language} = useParams()

  React.useEffect(() => {
    i18n.changeLanguage(language)
  }, [language, i18n])

  return <TextLoader
    documentName='general-and-indexed-specific-terms'
  />
}
export default TextLoader
