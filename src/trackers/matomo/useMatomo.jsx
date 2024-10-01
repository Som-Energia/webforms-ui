import { useContext, useCallback } from 'react'
import { MatomoContext } from './MatomoProvider'

const useMatomo = () => {
  const instance = useContext(MatomoContext)
  const trackEvent = useCallback(
    (params) => instance?.trackEvent(params),
    [instance]
  )

  return {
    trackEvent: trackEvent,
  }
}

export default useMatomo