import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useParams } from 'react-router-dom'
import { distribution_agreement } from '../../services/api'
import ModDistAgreementData from './ModDistAgreementData'

const ModDistAgreement = (props) => {
  const { i18n } = useTranslation()
  const { state } = useLocation()
  const { language } = useParams()

  const templateProps = JSON.parse(props.d1)
  const [type9Attachment, setType9Attachment] = useState([])
  const [type12Attachment, setType12Attachment] = useState([])
  const [error, setError] = useState('')
  const [completed, setCompleted] = useState(false)
  const [isSendingData, setSendingData] = useState(false)
  const [isDialogOpen, setDialogOpen] = useState(false)

  const [data] = useState(state?.d1CaseData || templateProps)

  const handleSubmit = async () => {
    setSendingData(true)
    await distribution_agreement(
      {
        ...data,
        rich_attachments: [...type9Attachment, ...type12Attachment]
      },
      data.token
    )
      .then(() => {
        setCompleted(true)
        setSendingData(false)
      })
      .catch(() => {
        setSendingData(false)
        setError('UPDATE_DIST_AGREEMENT_ERROR')
      })
  }

  const updateAttachment = (values, type) => {
    type === '09'
      ? setType9Attachment(values.map((el) => ({ type: type, data: el })))
      : setType12Attachment(values.map((el) => ({ type: type, data: el })))
  }

  useEffect(() => {
    i18n.changeLanguage(language)
  }, [language, i18n])


  const handleSubmitButton = () => {
    if ([...type9Attachment, ...type12Attachment].length < 2) {
      setDialogOpen(true)
    } else {
      handleSubmit()
    }
  }

  return (
    <ModDistAgreementData
      isDialogOpen={isDialogOpen}
      setDialogOpen={setDialogOpen}
      type9Attachment={type9Attachment}
      type12Attachment={type12Attachment}
      error={error}
      isSendingData={isSendingData}
      completed={completed}
      data={data}
      updateAttachment={updateAttachment}
      handleSubmitButton={handleSubmitButton}
      handleSubmit={handleSubmit}
    />
  )
}

export default React.memo(ModDistAgreement)
