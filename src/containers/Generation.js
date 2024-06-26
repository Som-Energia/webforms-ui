import React, { useCallback, useContext, useEffect, useState } from 'react'
import GenerationContext from './Generation/context/GenerationContext'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { generationChangeContractPriority } from '../services/api'
import GenerationDashboard from './Generation/GenerationDashboard/GenerationDashboard'

import dayjs from 'dayjs'
import 'dayjs/locale/ca'
import 'dayjs/locale/es'

function Generation(props) {
  const [validationConfirm, setValidationConfirm] = useState({finished:false,completed:false})
  const { language } = useParams()
  const { i18n } = useTranslation()
  const { assignments, resetAssignments, setEditingPriority } =
    useContext(GenerationContext)

  const handleCancelButtonClick = useCallback(() => {
    resetAssignments()
  }, [resetAssignments])

  const validateChanges = useCallback(async () => {
    setEditingPriority(false)
    try {
      const newAssignments = assignments.map((assignment) => assignment.id)
      await generationChangeContractPriority(newAssignments)
      setValidationConfirm({finished:true, completed:true})
    } catch (error) {
      console.error('ERROR', error)
      setValidationConfirm({finished:true, completed:false})
    }
  }, [assignments, setEditingPriority])

  useEffect(() => {
    language && i18n.changeLanguage(language)
    language ? dayjs.locale(language) : dayjs.locale('es')
  }, [language, i18n])

  return (
    <>
      <GenerationDashboard
        handleCancelButtonClick={handleCancelButtonClick}
        validateChanges={validateChanges}
        validationConfirm={validationConfirm}
        setValidationConfirm={setValidationConfirm}
      />
    </>
  )
}

export default Generation
