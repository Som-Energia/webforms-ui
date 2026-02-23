import React, { useCallback, useContext, useEffect, useState } from 'react'
import GenerationContext from './Generation/context/GenerationContext'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { generationChangeContractPriority } from '../services/api'
import GenerationDashboard from './Generation/GenerationDashboard/GenerationDashboard'
import { useSyncLanguage, useSyncDayjsLanguage } from '../hooks/useTranslateOptions'

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

  useSyncLanguage(language)

  useSyncDayjsLanguage(language)

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
