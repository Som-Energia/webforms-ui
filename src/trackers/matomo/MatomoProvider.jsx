import React, { createContext } from 'react'
import MatomoTracker from './MatomoTracker'

const MatomoInstance = new MatomoTracker()

export const MatomoContext = createContext(MatomoInstance)

const MatomoProvider = ({ children }) => {
  return (
    <MatomoContext.Provider value={ MatomoInstance }>
      {children}
    </MatomoContext.Provider>
  )
}

export default MatomoProvider
