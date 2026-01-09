import { useCallback } from 'react'

export const useHandleBlur = (setFieldTouched) => {
  return useCallback(
    (event) => {
      const { name } = event.target
      setFieldTouched(name, true)
    },
    [setFieldTouched]
  )
}

export const useHandleBlurValueIsNumberOrOption = (setFieldValue, options) => {
  return useCallback(
    (event) => {
      const { name, value } = event.target

      const finalValue = options.some((item) => item === value)
        ? value
        : value.replace(/[^0-9-]/g, '')

      setFieldValue(name, finalValue)
    },
    [setFieldValue, options]
  )
}


