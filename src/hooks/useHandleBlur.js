import { useCallback } from "react"

export const useHandleBlurEmail = (setFieldValue, setFieldTouched) => {
  return useCallback(
    (event) => {
      const { name, value } = event.target
      setFieldValue(name, value.toLowerCase(), true)
      setFieldTouched(name, true, false)
    },
    [setFieldValue, setFieldTouched],
  )
}

export const useHandleBlur = (setFieldTouched) => {
  return useCallback(
    (event) => {
      const { name } = event.target
      setFieldTouched(name, true)
    },
    [setFieldTouched],
  )
}

export const useHandleBlurValueIsNumberOrOption = (setFieldValue, options) => {
  return useCallback(
    (event) => {
      const { name, value } = event.target

      const finalValue = options.some((item) => item === value)
        ? value
        : value.replace(/[^0-9-]/g, "")

      setFieldValue(name, finalValue)
    },
    [setFieldValue, options],
  )
}
