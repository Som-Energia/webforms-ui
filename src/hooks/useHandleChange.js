import { useCallback } from 'react'

export const useHandleChange = (setFieldValue) => {
  return useCallback(
    (event) => {
      const { name, value } = event.target
      setFieldValue(name, value)
    },
    [setFieldValue]
  )
}

export const useHandleChangeNif = (setFieldValue) => {
  return useCallback(
    (event) => {
      const { name, value } = event.target
      let cleanedValue = value.match(/[0-9A-Za-z]{0,9}/)
      cleanedValue = cleanedValue[0].toUpperCase()
      setFieldValue(name, cleanedValue)
    },
    [setFieldValue]
  )
}
