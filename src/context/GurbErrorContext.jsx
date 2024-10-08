import React, { useState, createContext } from 'react'

const GurbErrorContext = createContext()

export const GurbErrorContextProvider = ({ children }) => {
  const [error, setError] = useState(undefined)
  const [errorInfo, setErrorInfo] = useState({})

  return (
    <GurbErrorContext.Provider
      value={{
        setError: setError,
        setErrorInfo: setErrorInfo,
        error: error,
        errorInfo: errorInfo
      }}>
      <React.Fragment>{error}</React.Fragment>
      {children}
    </GurbErrorContext.Provider>
  )
}

export default GurbErrorContext
