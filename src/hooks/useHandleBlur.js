import { useCallback } from 'react'

export const useHandleBlur = (setFieldTouched) => {
  return useCallback(
    (event) => {
      const { name, value } = event.target
      setFieldTouched(name, true)
    },
    [setFieldTouched]
  )
}