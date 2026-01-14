import { useState, createContext } from 'react'

import AlertRequirement from '../containers/Gurb/components/AlertRequirement/AlertRequirement'

const GurbErrorContext = createContext()

export const GurbErrorContextProvider = ({ children }) => {
  const [error, setError] = useState(undefined)
  const [errorInfo, setErrorInfo] = useState({})

  const getStepResult = (errorInfo) => {
    return (
      <>
        {errorInfo?.error_type && (
          <AlertRequirement
            severity={errorInfo.error_type}
            textHeader={errorInfo?.main_text}
            textBody={errorInfo?.seconday_text}
            textHelper={errorInfo?.link_text}
            textHelperAction={errorInfo?.clean_field}
          />
        )}
      </>
    )
  }

  return (
    <GurbErrorContext.Provider
      value={{
        setError: setError,
        setErrorInfo: setErrorInfo,
        getStepResult: getStepResult,
        error: error,
        errorInfo: errorInfo
      }}>
      {children}
    </GurbErrorContext.Provider>
  )
}

export default GurbErrorContext
