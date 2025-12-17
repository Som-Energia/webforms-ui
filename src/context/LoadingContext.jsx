import React, { useState, createContext } from 'react'

const LoadingContext = createContext()

export const LoadingContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(undefined)

  return (
    <LoadingContext.Provider
      value={{
        loading: loading,
        setLoading: setLoading,
      }}>
      {children}
    </LoadingContext.Provider>
  )
}

export default LoadingContext