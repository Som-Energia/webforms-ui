import React from "react"
import { useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"

import Typography from "@mui/material/Typography"

import axios from "axios"

import Loading from "./Loading"

const TextLoader = (props) => {
  const { i18n } = useTranslation()
  const { documentName, language = `${i18n.language}_ES` } = props
  const [text, setText] = React.useState()

  React.useEffect(() => {
    const url = `${import.meta.env.BASE_URL}static/docs/${language.slice(0, 2)}/${documentName}.html`
    setText(undefined)
    axios({
      method: "GET",
      url: url,
    })
      .then((response) => {
        setText(response?.data)
      })
      .catch(() => {
        console.log(`Error retrieving text ${url}`)
      })
  }, [documentName, language])

  return text === undefined ? (
    <Loading />
  ) : (
    <Typography
      component="div"
      variant="body1"
      sx={{ a: { textDecoration: "none", color: "secondary.dark" } }}
      dangerouslySetInnerHTML={{ __html: text }}
    />
  )
}

export const Test = () => {
  const { i18n } = useTranslation()
  const { language } = useParams()

  React.useEffect(() => {
    i18n.changeLanguage(language)
  }, [language, i18n])

  return <TextLoader documentName="general-and-indexed-specific-terms" />
}
export default TextLoader
