import { useState, createContext, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import OrdinalNumbers from 'utils/ordinalNumbers'
import { useParams } from 'react-router-dom'

const GenerationContext = createContext({
  assignments: [],
  investments: [],
  priorities: [],
  modifyContract: () => {}
})

export const GenerationContextProvider = ({ children, assignmentsJSON, investmentsJSON, propEditingPriority }) => {
  const { t } = useTranslation()
  const { language } = useParams()

  const ordinals = useMemo(() => {return new OrdinalNumbers(language)},[language])

  const pioritiesJSON = useMemo(() => {
    return assignmentsJSON.map((value, index) => {
      return index === 0
        ? { active: true, value: t('GENERATION_MAIN_PRIORITY'), index: index }
        : { active: true, value: ordinals.formatOrdinals(index+1), index: index }
    })
  }, [t, assignmentsJSON, ordinals])

  const assignmentsJSONSorted = useMemo(() => {
      const assignmentsSorted = assignmentsJSON.sort((a,b) => a.priority - b.priority )
      return assignmentsSorted.map((value, index) => {
        value.priority = index
        return value;
      })
  }, [assignmentsJSON])

  const [editingPriority, setEditingPriority] = useState(propEditingPriority)
  const [assignments, setAssignments] = useState(assignmentsJSONSorted)
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