import React, { useCallback, useContext, useEffect } from 'react'
import GenerationContext from './Generation/context/GenerationContext'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { generationChangeContractPriority } from '../services/api'
import GenerationDashboard from './Generation/GenerationDashboard'

import dayjs from 'dayjs'
import 'dayjs/locale/ca'
import 'dayjs/locale/es'

function Generation(props) {
  const { language } = useParams()
  const { i18n } = useTranslation()
  const {token} = props
  const { assignments, resetAssignments, setEditingPriority } = useContext(GenerationContext)

  const handleCancelButtonClick = useCallback(() => {
    resetAssignments()
  }, [resetAssignments])

  const validateChanges = useCallback(async () => {
    setEditingPriority(false)
    try {
      const newAssignments = assignments.map(assignment => assignment.id)
      let result = await generationChangeContractPriority(newAssignments, token)
      console.log('OK', result)
    } catch (error) {
      console.log('ERROR', error)
    }
  }, [assignments, token, setEditingPriority])

  useEffect(() => {
    language && i18n.changeLanguage(language)
    language ? dayjs.locale(language) : dayjs.locale('es')
  }, [language, i18n])

  return (
    <>
      <GenerationDashboard
        handleCancelButtonClick={handleCancelButtonClick}
        validateChanges={validateChanges}
      />
    </>
  )
}

export default Generation
