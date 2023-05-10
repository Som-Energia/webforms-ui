import React, { useCallback, useContext, useState, useEffect } from 'react'
import GenerationContext from './Generation/context/GenerationContext'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import {generationChangeContractPriority} from '../services/api'
import GenerationDashboard from './Generation/GenerationDashboard'

import dayjs from 'dayjs'
import 'dayjs/locale/ca'
import 'dayjs/locale/es'

function Generation() {
  const { language } = useParams()
  const {i18n } = useTranslation()
  const [editing, setEditing] = useState(false)
  const { assignments, resetAssignments } =
    useContext(GenerationContext)

  const handleClick = useCallback((state) => {
    setEditing(state)
  }, [])

  const handleCancelButtonClick = useCallback(() => {
    setEditing(false)
    resetAssignments()
  }, [resetAssignments])

  const validateChanges = useCallback(async () => {
    const validation = () => new Promise((resolve, reject) => {
        const search = assignments.reduce((acc, assignment) => {
            acc[assignment.priority] = ++acc[assignment.priority] || 0;
            return acc;
        },{})
        const duplicities = assignments.filter((assignment) => {
            return search[assignment.priority]
        })
        duplicities.length > 0 ? reject("CACA") : resolve("OK") 
    })
    try{
        await validation()
        setEditing(false)
        let result = await generationChangeContractPriority()
        console.log("OK",result)
    }
    catch (error){
        console.log("ERROR",error)
    }
  },[assignments])

  useEffect(() => {
    language && i18n.changeLanguage(language)
    language ? dayjs.locale(language) : dayjs.locale('es')
  }, [language, i18n])


  return (
    <>
      <GenerationDashboard editing={editing} handleCancelButtonClick={handleCancelButtonClick} validateChanges={validateChanges} handleClick={handleClick}/>
    </>
  )
}

export default Generation
