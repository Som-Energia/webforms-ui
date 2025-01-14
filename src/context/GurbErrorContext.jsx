import React, { useState, createContext } from 'react'

import AlertRequirement from '../containers/Gurb/components/AlertRequirement'
import FailureRequirement from '../containers/Gurb/components/FailureRequirement'
import SuccessRequirement from '../containers/Gurb/components/SuccessRequirement'

const GurbErrorContext = createContext()

export const GurbErrorContextProvider = ({ children }) => {
  const [error, setError] = useState(undefined)
  const [errorInfo, setErrorInfo] = useState({})

  const getStepResult = (errorInfo) => {
    switch (errorInfo.error_type) {
      case 'error':
        return (
          <FailureRequirement
            textHeader={errorInfo?.main_text}
            textBody={errorInfo?.seconday_text}
            textHelper={errorInfo?.link_text}
            textHelperAction={errorInfo?.clean_field}
          />
        )
      case 'alert':
        return (
          <AlertRequirement
            textHeader={errorInfo?.main_text}
            textBody={errorInfo?.seconday_text}
            textHelper={errorInfo?.link_text}
            textHelperAction={errorInfo?.clean_field}
          />
        )
      case 'success':
        return (
          <SuccessRequirement
            textHeader={errorInfo?.main_text}
            textBody={errorInfo?.seconday_text}
            textHelper={errorInfo?.link_text}
            textHelperAction={errorInfo?.clean_field}
          />
        )
      default:
        return
    }
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
