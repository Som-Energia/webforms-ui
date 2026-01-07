import React, { useState, createContext } from 'react'

const GurbLoadingContext = createContext()

export const GurbLoadingContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(undefined)

  return (
    <GurbLoadingContext.Provider
      value={{
        loading: loading,
        setLoading: setLoading,
      }}>
      {children}
    </GurbLoadingContext.Provider>
  )
}

export default GurbLoadingContext