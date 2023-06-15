import axios from 'axios'
import React from 'react'
import Loading from './Loading'


const TextLoader = props => {
  const {
    documentName,
    lang,
  } = props
  const [ text, setText ] = React.useState()
  React.useEffect(()=>{
    const url = `${process.env.PUBLIC_URL}/static/docs/${lang}/${documentName}.html`
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
  }, [documentName, lang])
  return text === undefined
    ? <Loading/>
    : <span dangerouslySetInnerHTML={{ __html: text }} />
}

export const Test = () => <TextLoader documentName='legal' lang='es' />
export default TextLoader
