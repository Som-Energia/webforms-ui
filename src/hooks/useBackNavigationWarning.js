import { useEffect, useRef } from 'react'

const useBackNavigationWarning = (enabled, message) => {
  const currentHistoryIndex = useRef()
  const allowNavigation = useRef(false)

  useEffect(() => {
    if (!enabled) {
      return
    }

    currentHistoryIndex.current = window.history.state?.idx

    const handlePopState = (event) => {
      if (allowNavigation.current) {
        return
      }

      const nextHistoryIndex = event.state?.idx
      const stepsBack = currentHistoryIndex.current - nextHistoryIndex

      if (!Number.isInteger(stepsBack) || stepsBack <= 0) {
        return
      }

      event.stopImmediatePropagation()
      window.history.go(stepsBack)

      if (window.confirm(message)) {
        allowNavigation.current = true
        window.setTimeout(() => window.history.go(-stepsBack), 0)
      }
    }

    window.addEventListener('popstate', handlePopState, true)
    return () => window.removeEventListener('popstate', handlePopState, true)
  }, [enabled, message])

  useEffect(() => {
    if (!enabled) {
      return
    }

    const handleBeforeUnload = (event) => {
      event.preventDefault()
      event.returnValue = ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [enabled])

}

export default useBackNavigationWarning
