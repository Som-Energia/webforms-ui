import { useState, createContext, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

const GenerationContext = createContext({
  assignments: [],
  investments: [],
  priorities: [],
  modifyContract: () => {}
})

export const GenerationContextProvider = ({ children, assignmentsJSON, investmentsJSON, propEditingPriority }) => {
  const { t } = useTranslation()

  const pioritiesJSON = useMemo(() => {
    return assignmentsJSON.map((value, index) => {
      return index === 0
        ? { active: true, value: t('GENERATION_MAIN_PRIORITY'), index: index }
        : { active: true, value: t('GENERATION_SECONDARY') + " " + index, index: index }
    })
  }, [t, assignmentsJSON])


  const [editingPriority, setEditingPriority] = useState(propEditingPriority)
  const [assignments, setAssignments] = useState(assignmentsJSON.sort((a,b) => a.priority - b.priority ))
  const [investments] = useState(investmentsJSON)
  const [priorities] = useState(pioritiesJSON)

  const changeAssigmentPriority = useCallback(
    (origin, dest) => {
      const originPriority = origin.priority
      const destPriority = dest.priority

      let newAssignments = JSON.parse(JSON.stringify(assignments))
      newAssignments.forEach((assignment) => {
        if (assignment.contract === origin.contract) {
          assignment.priority = destPriority
        }
        if (assignment.contract === dest.contract) {
          assignment.priority = originPriority
        }
      })
      
      newAssignments.sort((a,b) => a.priority - b.priority )
      setAssignments(newAssignments)
    },
    [assignments]
  )

  const getPriority = useCallback((index) => {
    let found = false;
    let count = 0;
    while(!found && count<priorities.length){
      if(priorities[count].index === index){
        found = true
      }else{
        count ++;
      }
    }
    return priorities[count]
  },[priorities])

  const resetAssignments = useCallback(() => {
    setEditingPriority(false)
    setAssignments(assignmentsJSON)
  }, [assignmentsJSON])

  const contextValue = useMemo(
    () => ({
      assignments,
      investments,
      priorities,
      editingPriority,
      setEditingPriority,
      getPriority,
      changeAssigmentPriority,
      resetAssignments
    }),
    [
      assignments,
      priorities,
      getPriority,
      editingPriority,
      setEditingPriority,
      investments,
      changeAssigmentPriority,
      resetAssignments
    ]
  )

  return (
    <GenerationContext.Provider value={contextValue}>
      {children}
    </GenerationContext.Provider>
  )
}

export default GenerationContext