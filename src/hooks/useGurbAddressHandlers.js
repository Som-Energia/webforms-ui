import { useCallback, useState, useContext } from 'react'
import * as Yup from 'yup'
import PopUpContext from '../context/PopUpContext'
import { getPlaceDetails, searchPlace } from '../services/googleApiClient'
import { checkGurbDistance } from '../services/apiGurb'
import GurbOutOfPerimeterError from '../containers/Gurb/GurbErrors'
import { addressValidations } from '../containers/Gurb/requirementsValidations'
import { buildGurbDialog } from '../containers/Gurb/utils/buildGurbDialog'

/** Resets geo-related fields */
const clearAddressGeoFields = (setFieldValue, addressFieldName) => {
  setFieldValue(`${addressFieldName}.inside_perimeter`, false)
  setFieldValue(`${addressFieldName}.lat`, undefined)
  setFieldValue(`${addressFieldName}.long`, undefined)
}

/** Resolve lat/long from full address */
const getLatLongWithFullAddress = async (
  setFieldValue,
  values,
  addressFieldName,
  sessionTokenRef,
  currentNumber
) => {
  try {
    const address = values[addressFieldName]
    const place = await getPlaceDetails(address.id, sessionTokenRef)
    const postalCodeComp = place.addressComponents.find((c) =>
      c.types.includes('postal_code')
    )
    const streetComp = place.addressComponents.find((c) =>
      c.types.includes('route')
    )
    const fullAddress = `${streetComp?.longText || ''} ${currentNumber || ''}, ${
      postalCodeComp?.longText || ''
    }`

    const suggestions = await searchPlace(fullAddress, sessionTokenRef)
    if (suggestions.length === 0) return

    const suggestedPlace = await getPlaceDetails(
      suggestions[0].id,
      sessionTokenRef
    )

    await setFieldValue(
      `${addressFieldName}.lat`,
      suggestedPlace.location.lat()
    )
    await setFieldValue(
      `${addressFieldName}.long`,
      suggestedPlace.location.lng()
    )
  } catch (error) {
    console.error('Error updating address values:', error)
  }
}

/** Checks if address is within the perimeter */
const handleCheckGurbDistance = async (
  gurbCode,
  lat,
  long,
  setFieldValue,
  addressFieldName
) => {
  const { data } = await checkGurbDistance(gurbCode, lat, long)

  if (data?.error) {
    console.error('Error checking distance to Gurb:', data.error)
    throw new Error(data.error)
  }

  if (!data) {
    throw new GurbOutOfPerimeterError(
      'The address is out of the allowed range for this GURB'
    )
  }

  setFieldValue(`${addressFieldName}.inside_perimeter`, true)
}

/**
 * Hook encapsulating all address-related handlers
 */
export const useAddressHandlers = ({
  setFieldValue,
  setFieldError,
  setTouched,
  addressFieldName,
  values,
  t,
  sessionTokenRef,
  gurbCode,
}) => {
  const { setContent } = useContext(PopUpContext)
  const [loading, setLoading] = useState(false)

  /** Handle street field changes */
  const handleChangeStreet = useCallback(
    async (addressValue) => {
      clearAddressGeoFields(setFieldValue, addressFieldName)

      if (!addressValue || !addressValue.id) {
        await setFieldValue(
          `${addressFieldName}.street`,
          addressValue?.street || addressValue?.text || ''
        )
        return
      }

      try {
        await setFieldValue(`${addressFieldName}.id`, addressValue.id || '')
        const place = await getPlaceDetails(addressValue.id, sessionTokenRef)
        const streetComponent = place.addressComponents.find((c) =>
          c.types.includes('route')
        )
        const postalCodeComponent = place.addressComponents.find((c) =>
          c.types.includes('postal_code')
        )

        const newStreet = streetComponent?.longText || ''
        const newPostalCode = postalCodeComponent?.longText || ''

        await setFieldValue(`${addressFieldName}.street`, newStreet)
        await setFieldValue(`${addressFieldName}.postal_code`, newPostalCode)

        const freshAddress = {
          ...values[addressFieldName],
          id: addressValue.id,
          street: newStreet,
          postal_code: newPostalCode,
          number: values[addressFieldName]?.number,
        }

        await getLatLongWithFullAddress(
          setFieldValue,
          { [addressFieldName]: freshAddress },
          addressFieldName,
          sessionTokenRef,
          freshAddress.number
        )
      } catch (error) {
        console.error('Error fetching place details:', error)
        await setFieldValue(
          `${addressFieldName}.street`,
          addressValue.text || addressValue.street || ''
        )
        await setFieldValue(`${addressFieldName}.postal_code`, '')
      }
    },
    [setFieldValue, addressFieldName, values, sessionTokenRef]
  )

  /** Handle postal code changes */
  const handleChangePostalCode = useCallback(
    async (event) => {
      const value = event.target.value
      await setFieldValue(`${addressFieldName}.postal_code`, value)
      clearAddressGeoFields(setFieldValue, addressFieldName)

      await getLatLongWithFullAddress(
        setFieldValue,
        values,
        addressFieldName,
        sessionTokenRef,
        values[addressFieldName]?.number
      )
    },
    [setFieldValue, addressFieldName, values, sessionTokenRef]
  )

  /** Handle street number changes */
  const handleChangeNumber = useCallback(
    async (event) => {
      const cleanedNumber = event.target.value.replace(/[^0-9]/g, '')
      await setFieldValue(`${addressFieldName}.number`, cleanedNumber)
      clearAddressGeoFields(setFieldValue, addressFieldName)

      if (cleanedNumber) {
        await getLatLongWithFullAddress(
          setFieldValue,
          values,
          addressFieldName,
          sessionTokenRef,
          cleanedNumber
        )
      }
    },
    [setFieldValue, addressFieldName, values, sessionTokenRef]
  )

  /** Handle validation */
  const handleAddressValidation = useCallback(async () => {
    await setFieldValue(`${addressFieldName}.inside_perimeter`, false)
    const updates = { address: {} }
    try {
      await addressValidations.validate(values, { abortEarly: false })
      setLoading(true)
      await handleCheckGurbDistance(
        gurbCode,
        values[addressFieldName]?.lat,
        values[addressFieldName]?.long,
        setFieldValue,
        addressFieldName
      )
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        err.inner.forEach((e) => {
          if (!e.path) return
          setFieldError(e.path, e.message)
          const keyPattern = e.path.split('.')[1]
          updates.address[keyPattern] = true
        })
        setTouched(updates)
      }
      if (updates?.address?.lat || updates?.address?.long) {
        setContent(
          buildGurbDialog({
            severity: 'error',
            setContent: setContent,
            titleKey: t('GURB_ADDRESS_ERROR_UNEXPECTED'),
            text1Key: t('GURB_ADDRESS_ERROR_MISSING_LONGLAT_MAIN_TEXT'),
          })
        )
      } else if (err instanceof GurbOutOfPerimeterError) {
        setContent(
          buildGurbDialog({
            severity: 'error',
            setContent: setContent,
            titleKey: t('GURB_ADDRESS_ERROR_OUT_OF_PERIMETER_TITLE_TEXT'),
            text1Key: t('GURB_ADDRESS_ERROR_OUT_OF_PERIMETER_MAIN_TEXT'),
            text2Key: t('GURB_ADDRESS_ERROR_OUT_OF_PERIMETER_SECONDARY_TEXT'),
          })
        )
      } else {
        setContent(
          buildGurbDialog({
            severity: 'error',
            setContent: setContent,
            titleKey: t('GURB_ADDRESS_ERROR_UNEXPECTED'),
            text1Key: t('GURB_ADDRESS_ERROR_UNEXPECTED_MAIN_TEXT'),
          })
        )
      }
    } finally {
      setLoading(false)
    }
  }, [
    setFieldValue,
    gurbCode,
    values,
    addressFieldName,
    setFieldError,
    setTouched,
    t,
    setContent,
  ])

  return {
    loading,
    handleChangeStreet,
    handleChangePostalCode,
    handleChangeNumber,
    handleAddressValidation,
  }
}
