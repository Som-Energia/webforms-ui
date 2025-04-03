import { useState, createContext, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import OrdinalNumbers from '../../../utils/ordinalNumbers'
import { useParams } from 'react-router-dom'
import { getAssignmentContracts, getNoAssignmentContracts } from '../../../services/api'

const GenerationContext = createContext({
  assignments: [],
  investments: [],
  contractNoAssignments: [],
  outsideAssignments: [],
  modifyContract: () => { }
})

export const GenerationContextProvider = ({testMode=false, children, assignmentsJSON, investmentsJSON, outsideAssignmentsJSON, propEditingPriority, contractNoAssignmentsJSON=[] }) => {
  const { t } = useTranslation()
  const { language } = useParams()

  const ordinals = useMemo(() => { return new OrdinalNumbers(language) }, [language])

  const assignmentsJSONSorted = useMemo(() => {
    const tmpAssignments = JSON.parse(JSON.stringify(assignmentsJSON))
    const assignmentsSorted = tmpAssignments.sort((a, b) => a.priority - b.priority)
    return assignmentsSorted.map((value, index) => {
      value.priority = index
      return value;
    })
  }, [assignmentsJSON])

  const outsideAssignmentsJSONSorted = useMemo(() => {
    return JSON.parse(JSON.stringify(outsideAssignmentsJSON))
  }, [outsideAssignmentsJSON])

  const [editingPriority, setEditingPriority] = useState(propEditingPriority)
  const [assignments, setAssignments] = useState(assignmentsJSONSorted)
  const [outsideAssignments, setOutsideAssignments] = useState(outsideAssignmentsJSONSorted)
  const [contractNoAssignments, setContractNoAssignments] = useState(contractNoAssignmentsJSON)
  const [investments] = useState(investmentsJSON)

  const getAssingments = async () => {
    try {
      let result = await getAssignmentContracts()
      setAssignments(result?.data)
    }
    catch (e) {
      console.log("No s'han pogut trobar les assignacions")
    }
  }


  const has_duplicate_priority_values = useCallback(() => {
    let res =
      new Set(assignmentsJSON.map((item) => item['priority'])).size !==
      assignmentsJSON.length
    return res
  }, [assignmentsJSON])

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

      newAssignments.sort((a, b) => a.priority - b.priority)
      setAssignments(newAssignments)
    },
    [assignments]
  )

  const getPriority = useCallback((index) => {
    
    const priorities = assignments.map((value, index) => {
      return index === 0
        ? { active: true, value: t('GENERATION_MAIN_PRIORITY'), index: index }
        : { active: true, value: ordinals.formatOrdinals(index + 1), index: index }
    })
    let found = false;
    let count = 0;
    while (!found && count < priorities.length) {
      if (priorities[count].index === index) {
        found = true
      } else {
        count++;
      }
    }
    return priorities[count]
  }, [assignments])

  const getContractsToAssign = async () => {
    try {
      if(!testMode){
        const noContractAssignments = await getNoAssignmentContracts()
        setContractNoAssignments(noContractAssignments?.data)
      }
    }
    catch (e) {
      console.log(e)
    }
  }

  const resetAssignments = useCallback(() => {
    setEditingPriority(false)
    setAssignments(assignmentsJSONSorted)
  }, [assignmentsJSONSorted])

  const contextValue = useMemo(
    () => ({
      assignments,
      investments,
      outsideAssignments,
      editingPriority,
      setEditingPriority,
      getPriority,
      changeAssigmentPriority,
      resetAssignments,
      has_duplicate_priority_values,
      getAssingments,
      getContractsToAssign,
      contractNoAssignments
    }),
    [
      assignments,
      outsideAssignments,
      getPriority,
      editingPriority,
      setEditingPriority,
      investments,
      changeAssigmentPriority,
      resetAssignments,
      has_duplicate_priority_values,
      getAssingments,
      getContractsToAssign,
      contractNoAssignments
    ]
  )

  return (
    <GenerationContext.Provider value={contextValue}>
      {children}
    </GenerationContext.Provider>
  )
}

export default GenerationContext