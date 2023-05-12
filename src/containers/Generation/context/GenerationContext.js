import { useState, createContext, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

const GenerationContext = createContext({
  assignments: [],
  investments: [],
  priorities: [],
  modifyContract: () => {}
})

export const GenerationContextProvider = ({ children, assignmentsJSON, investmentsJSON }) => {
  const { t } = useTranslation()



  const pioritiesJSON = useMemo(() => {
    return assignmentsJSON.map((value, index) => {
      return index === 0
        ? { active: true, value: t('MAIN_PRIORITY'), index: index }
        : { active: true, value: t('SECONDARY') + index, index: index }
    })
  }, [t, assignmentsJSON])

  const [assignments, setAssignments] = useState(assignmentsJSON)
  const [investments] = useState(investmentsJSON)
  const [priorities] = useState(pioritiesJSON)

  const modifyPriorityContract = useCallback(
    (id, priority) => {
      let newAssignments = JSON.parse(JSON.stringify(assignments))
      newAssignments.forEach((assignment) => {
        if (assignment.contract === id) {
          assignment.priority = priority
        }
      })
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
    setAssignments(assignmentsJSON)
  }, [assignmentsJSON])

  const contextValue = useMemo(
    () => ({
      assignments,
      investments,
      priorities,
      getPriority,
      modifyPriorityContract,
      resetAssignments
    }),
    [
      assignments,
      priorities,
      getPriority,
      investments,
      modifyPriorityContract,
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
