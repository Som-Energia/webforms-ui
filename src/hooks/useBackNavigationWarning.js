import { useEffect, useRef, useState } from 'react'

const useBackNavigationWarning = (enabled) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const currentHistoryIndex = useRef()
  const pendingSteps = useRef(0)
  const allowNavigation = useRef(false)

  useEffect(() => {
    if (!enabled) {
      setIsDialogOpen(false)
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
      pendingSteps.current = stepsBack
      window.history.go(stepsBack)
      setIsDialogOpen(true)
    }

    window.addEventListener('popstate', handlePopState, true)
    return () => window.removeEventListener('popstate', handlePopState, true)
  }, [enabled])

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

  const confirmNavigation = () => {
    allowNavigation.current = true
    setIsDialogOpen(false)
    window.history.go(-pendingSteps.current)
  }

  return {
    isDialogOpen,
    cancelNavigation: () => setIsDialogOpen(false),
    confirmNavigation
  }
}

export default useBackNavigationWarning
