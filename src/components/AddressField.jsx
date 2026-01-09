import { useEffect, useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import floorTypes from '../data/floor-types.json'
import SomAutocompleteFloorInput from './AutocompleteFloorInput/AutocompleteFloorInput'
import Grid from '@mui/material/Grid'
import LocationInput from './AddressAutocompletedField'
import { useHandleChange } from '../hooks/useHandleChange'

import { getPlaceDetails } from '../services/googleApiClient'
import { getMunicipisByPostalCode } from '../services/api'
import InputField from './InputField'
import StateCity from './StateCity'

const normalizePlace = (place) => ({
  id: place?.id?.toString() || '',
  name: place?.name || ''
})

const updateAddressValues = async (
  addressValue,
  numberValue,
  values,
  setValues,
  addressFieldName,
  sessionTokenRef
) => {
  try {
    const place = await getPlaceDetails(addressValue.id, sessionTokenRef)

    const postalCodeComponent = place.addressComponents.find((c) =>
      c.types.includes('postal_code')
    )
    const municipis = await getMunicipisByPostalCode(
      postalCodeComponent?.longText
    )

    const streetComponent = place.addressComponents.find((c) =>
      c.types.includes('route')
    )

    const cityRaw = municipis?.[0]?.[0]?.municipi || { id: '', name: '' }
    const stateRaw = municipis?.[0]?.[0]?.provincia || { id: '', name: '' }

    const city = normalizePlace(cityRaw)
    const state = normalizePlace(stateRaw)

    setValues({
      ...values,
      [addressFieldName]: {
        ...values[addressFieldName],
        id: addressValue.id,
        text: addressValue.text,
        number: numberValue,
        postal_code: postalCodeComponent?.longText || '',
        street: streetComponent?.longText || '',
        state,
        city
      }
    })
  } catch (error) {
    console.error('Error updating address values:', error)
  }
}

const AddressField = ({
  addressFieldName = 'address',
  addressLabel,
  values,
  errors,
  touched,
  setFieldValue,
  setFieldTouched,
  setValues
}) => {
  const { t } = useTranslation()
  const sessionTokenRef = useRef()

  const [numberValue, setNumberValue] = useState(
    values[addressFieldName]?.number || ''
  )
  const [postalCodeValue, setPostalCodeValue] = useState(
    values[addressFieldName]?.postal_code || ''
  )

  useEffect(() => {
    setPostalCodeValue(values[addressFieldName]?.postal_code || '')
  }, [values[addressFieldName]?.postal_code])

  const handleAddressChange = async (value) => {
    if (!value || !value.id) {
      // Is a text is written, and no suggestion selected, the text is saved as street
      setFieldValue(
        `${addressFieldName}.street`,
        value?.street || value?.text || ''
      )
      return
    }

    try {
      const place = await getPlaceDetails(value.id, sessionTokenRef)
      const streetComponent = place.addressComponents.find((c) =>
        c.types.includes('route')
      )
      const postalCodeComponent = place.addressComponents.find((c) =>
        c.types.includes('postal_code')
      )

      setFieldValue(
        `${addressFieldName}.street`,
        streetComponent?.longText || ''
      )
      setFieldValue(
        `${addressFieldName}.postal_code`,
        postalCodeComponent?.longText || ''
      )

      await updateAddressValues(
        value,
        numberValue,
        values,
        setValues,
        addressFieldName,
        sessionTokenRef
      )
    } catch (error) {
      console.error('Error fetching place details:', error)
      setFieldValue(
        `${addressFieldName}.street`,
        value.text || value.street || ''
      )
      setFieldValue(`${addressFieldName}.postal_code`, '')
    }
  }

  const handleChangePostalCode = async (event) => {
    const value = event.target.value
    setPostalCodeValue(value)
    setFieldValue(`${addressFieldName}.postal_code`, value)

    if (value.length >= 5) {
      try {
        const municipis = await getMunicipisByPostalCode(value)

        const cityRaw = municipis?.[0]?.[0]?.municipi || { id: '', name: '' }
        const stateRaw = municipis?.[0]?.[0]?.provincia || { id: '', name: '' }

        const city = normalizePlace(cityRaw)
        const state = normalizePlace(stateRaw)

        setFieldValue(`${addressFieldName}.city`, city)
        setFieldValue(`${addressFieldName}.state`, state)
      } catch (error) {
        console.error('Error getting municipis by postal code:', error)
        setFieldValue(`${addressFieldName}.city`, { id: '', name: '' })
        setFieldValue(`${addressFieldName}.state`, { id: '', name: '' })
      }
    } else {
      setFieldValue(`${addressFieldName}.city`, { id: '', name: '' })
      setFieldValue(`${addressFieldName}.state`, { id: '', name: '' })
    }
  }

  const handleChangeNumber = (event) => {
    const cleanedValue = event.target.value.replace(/[^0-9]/g, '')
    setNumberValue(cleanedValue)
    setFieldValue(`${addressFieldName}.number`, cleanedValue)
  }
  const handleChange = useHandleChange(setFieldValue)
  const handleChangeFloor = useHandleChange(setFieldValue)
  const floorOptions = (floorTypes || []).map((item) => ({
    code: item.code,
    translation: t(item.translationKey)
  }))

  const handleChangeStateAndCity = async (value) => {
    await setFieldValue(`${addressFieldName}.city`, value?.city)
    setFieldValue(`${addressFieldName}.state`, value?.state)
  }

  return (
    <Grid container spacing={2}>
      <Grid item sm={8} xs={12}>
        <LocationInput
          id={addressFieldName}
          textFieldName={addressLabel}
          value={values[addressFieldName]}
          onChange={handleAddressChange}
          onBlur={() => setFieldTouched(`${addressFieldName}.street`, true)}
          error={
            touched[addressFieldName]?.street &&
            errors[addressFieldName]?.street
              ? errors[addressFieldName].street
              : false
          }
          touched={touched[addressFieldName]?.street}
          sessionTokenRef={sessionTokenRef}
          required
        />
      </Grid>

      <Grid item sm={4} xs={12}>
        <InputField
          name={`${addressFieldName}.postal_code`}
          handleBlur={() =>
            setFieldTouched(`${addressFieldName}.postal_code`, true)
          }
          textFieldName={t('POSTAL_CODE')}
          handleChange={handleChangePostalCode}
          touched={touched[addressFieldName]?.postal_code}
          value={postalCodeValue}
          error={
            touched[addressFieldName]?.postal_code &&
            errors[addressFieldName]?.postal_code
              ? t(errors[addressFieldName].postal_code)
              : ''
          }
          required
        />
      </Grid>

      <Grid item container spacing={2}>
        <StateCity
          stateId="supply_point_state"
          stateName={`${addressFieldName}.state`}
          state={values[addressFieldName]?.state}
          cityId="supply_point_city"
          cityName={`${addressFieldName}.city`}
          city={values[addressFieldName]?.city}
          onChange={(value) => handleChangeStateAndCity(value)}
        />
      </Grid>

      <Grid item sm={2} xs={6}>
        <InputField
          name={`${addressFieldName}.number`}
          handleBlur={() => setFieldTouched(`${addressFieldName}.number`, true)}
          textFieldName={t('NUMBER')}
          textFieldHelper={t('HELPER_NUMBER_ADDRESS')}
          handleChange={handleChangeNumber}
          touched={touched[addressFieldName]?.number}
          value={numberValue}
          error={
            touched[addressFieldName]?.number &&
            errors[addressFieldName]?.number
              ? t(errors[addressFieldName].number)
              : ''
          }
          required
        />
      </Grid>

      <Grid item sm={2} xs={6}>
        <InputField
          name={`${addressFieldName}.bloc`}
          textFieldName={t('BLOCK')}
          handleChange={handleChange}
          touched={touched[addressFieldName]?.bloc}
          value={values[addressFieldName]?.bloc}
          error={errors[addressFieldName]?.bloc}
        />
      </Grid>

      <Grid item sm={2} xs={6}>
        <InputField
          name={`${addressFieldName}.stairs`}
          textFieldName={t('STAIRS')}
          handleChange={handleChange}
          touched={touched[addressFieldName]?.stairs}
          value={values[addressFieldName]?.stairs}
          error={errors[addressFieldName]?.stairs}
        />
      </Grid>

      <Grid item sm={4} xs={12}>
        <InputField
          textFieldName={t('FLOOR')}
          textFieldNameHelper={t('FLOOR_HELPER')}
          textFieldNameHelperInline>
          <SomAutocompleteFloorInput
            fieldName={`${addressFieldName}.floor`}
            options={floorOptions}
            value={values[addressFieldName]?.floor}
            error={errors[addressFieldName]?.floor}
            onChangeHandler={handleChangeFloor}></SomAutocompleteFloorInput>
        </InputField>
      </Grid>

      <Grid item sm={2} xs={6}>
        <InputField
          name={`${addressFieldName}.door`}
          textFieldName={t('DOOR')}
          handleChange={handleChange}
          touched={touched[addressFieldName]?.door}
          value={values[addressFieldName]?.door}
          error={errors[addressFieldName]?.door}
        />
      </Grid>
    </Grid>
  )
}

export default AddressField
