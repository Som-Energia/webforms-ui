import React, { useState, createContext } from 'react'

const SummaryContext = createContext()

export const SummaryContextProvider = ({ children }) => {
  const [summaryField, setSummaryField] = useState(undefined)

  return (
    <SummaryContext.Provider
      value={{
        summaryField: summaryField,
        setSummaryField: setSummaryField,
      }}>
      {children}
    </SummaryContext.Provider>
  )
}

export default SummaryContext
