import React, { createContext, useState, useCallback, useMemo } from 'react'
import MatomoTracker from './MatomoTracker'

export const MatomoContext = createContext({
  trackEvent: () => { }
})

export const MatomoProvider = ({ children }) => {

  const [MatomoInstance] = useState(new MatomoTracker())

  const trackEvent = useCallback(
    (params) => MatomoInstance?.trackEvent(params),
    [MatomoInstance]
  )
  const contextValue = useMemo(
    () => ({trackEvent}),
    [trackEvent]
  )
  return (
    <MatomoContext.Provider value={contextValue}>
      {children}
    </MatomoContext.Provider>
  )
}

export default MatomoContext
