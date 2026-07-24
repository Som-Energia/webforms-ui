import { createContext, useState, useCallback, useMemo } from 'react'
import MatomoTracker from './MatomoTracker'

export const MatomoContext = createContext({
  trackEvent: () => {},
  pushTag: () => {}
})

export const MatomoProvider = ({ children }) => {
  const [MatomoInstance] = useState(new MatomoTracker())

  const trackEvent = useCallback(
    (params) => MatomoInstance?.trackEvent(params),
    [MatomoInstance]
  )

  const pushTag = useCallback(
    (params) => MatomoInstance?.pushTag(params),
    [MatomoInstance]
  )

  const contextValue = useMemo(
    () => ({ trackEvent, pushTag }),
    [trackEvent, pushTag]
  )
  return (
    <MatomoContext.Provider value={contextValue}>
      {children}
    </MatomoContext.Provider>
  )
}

export default MatomoContext
