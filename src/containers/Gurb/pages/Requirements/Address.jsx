import { useEffect, useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@mui/material/Grid'
import LocationInput from '../../../../containers/Gurb/components/AddressAutocompletedFieldGurb'
import {
  useHandleChange,
  useHandleChangeInteger
} from '../../../../hooks/useHandleChange'

import { getPlaceDetails } from '../../../../services/googleApiClient'
import { getMunicipisByPostalCode } from '../../../../services/api'
import InputField from '../../../../components/InputField'
import StateCity from '../../../../components/StateCity'
import { searchPlace } from '../../../../services/googleApiClient'
import { checkGurbDistance } from '../../../../services/apiGurb'

const normalizePlace = (place) => ({
  id: place?.id?.toString() || '',
  name: place?.name || ''
})

// Handle Gurb distance
const handleCheckGurbDistance = async (lat, long) => {
  if (!lat || !long) return
  const gurbId = 2
  try {
    const { data } = await checkGurbDistance(gurbId, lat, long)
    console.log({ data })
    if (!data) {
      console.log('pop up must to be open')
    }
  } catch (error) {
    console.error('Error checking Gurb distance:', error)
  }
}

const getLatLongWithFullAddress = async (
  setValues,
  values,
  addressID,
  addressFieldName,
  sessionTokenRef
) => {

  try {
    if (
      values[addressFieldName]?.street &&
      values[addressFieldName]?.postal_code &&
      values[addressFieldName]?.number &&
      values[addressFieldName]?.state &&
      values[addressFieldName]?.city
    ) {
      const place = await getPlaceDetails(addressID, sessionTokenRef)

      const postalCodeComp = place.addressComponents.find((c) =>
        c.types.includes('postal_code')
      )

      const streetComp = place.addressComponents.find((c) =>
        c.types.includes('route')
      )

      const fullAddress = `${streetComp?.longText || ''} ${values[addressFieldName].number}, ${postalCodeComp?.longText || ''}`
      const suggestions = await searchPlace(fullAddress, sessionTokenRef)

      if (suggestions.length > 0) {
        const suggestedPlace = await getPlaceDetails(suggestions[0].id, sessionTokenRef)
        await setValues(({
          ...values,
          [addressFieldName]: {
            ...values[addressFieldName],
            lat: suggestedPlace.location.lat(),
            long: suggestedPlace.location.lng()
          }
        }))

        await handleCheckGurbDistance(suggestedPlace.location.lat(), suggestedPlace.location.lng())
      }
    }
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
  const [addressID, setAddressID] = useState('')

  const handleChangeStreet = async (addressValue) => {
    if (!addressValue || !addressValue.id) {
      setFieldValue(
        `${addressFieldName}.street`,
        addressValue?.street || addressValue?.text || ''
      )
      return
    }

    try {
      setAddressID(addressValue.id)
      const place = await getPlaceDetails(addressValue.id, sessionTokenRef)
      const streetComponent = place.addressComponents.find((c) =>
        c.types.includes('route')
      )
      const postalCodeComponent = place.addressComponents.find((c) =>
        c.types.includes('postal_code')
      )

      await setFieldValue(
        `${addressFieldName}.street`,
        streetComponent?.longText || ''
      )
      await setFieldValue(
        `${addressFieldName}.postal_code`,
        postalCodeComponent?.longText || ''
      )

      await UpdateStateCityByPostalCode(postalCodeComponent?.longText || '')
      getLatLongWithFullAddress(setValues, values, addressID, addressFieldName, sessionTokenRef)

    } catch (error) {
      console.error('Error fetching place details:', error)
      setFieldValue(
        `${addressFieldName}.street`,
        addressValue.text || addressValue.street || ''
      )
      setFieldValue(`${addressFieldName}.postal_code`, '')
    }
  }

  const UpdateStateCityByPostalCode = async (postalCodeValue) => {
    try {
      if (postalCodeValue.length >= 5) {
        const municipis = await getMunicipisByPostalCode(postalCodeValue)

        const cityRaw = municipis?.[0]?.[0]?.municipi || { id: '', name: '' }
        const stateRaw = municipis?.[0]?.[0]?.provincia || { id: '', name: '' }

        const city = normalizePlace(cityRaw)
        const state = normalizePlace(stateRaw)

        await setFieldValue(`${addressFieldName}.city`, city)
        await setFieldValue(`${addressFieldName}.state`, state)
      }
      else {
        await setFieldValue(`${addressFieldName}.city`, { id: '', name: '' })
        await setFieldValue(`${addressFieldName}.state`, { id: '', name: '' })
      }
    }
    catch (error) {
      console.error('Error getting municipis by postal code:', error)
      await setFieldValue(`${addressFieldName}.city`, { id: '', name: '' })
      await setFieldValue(`${addressFieldName}.state`, { id: '', name: '' })
    }
  }

  const handleChangePostalCode = async (event) => {
    const value = event.target.value
    await setFieldValue(`${addressFieldName}.postal_code`, value)
    await UpdateStateCityByPostalCode(value)
    getLatLongWithFullAddress(setValues, values, addressID, addressFieldName, sessionTokenRef)
  }

  const handleChangeNumber = async (event) => {
    const cleanedNumber = event.target.value.replace(/[^0-9]/g, '')
    await setFieldValue(`${addressFieldName}.number`, cleanedNumber)
    if (cleanedNumber) {
      await getLatLongWithFullAddress(setValues, values, addressID, addressFieldName, sessionTokenRef)
    } else if (!cleanedNumber) {
      await setFieldValue(`${addressFieldName}.lat`, undefined)
      setFieldValue(`${addressFieldName}.long`, undefined)
    }
  }

  const handleChange = useHandleChange(setFieldValue)

  const handleChangeInteger = useHandleChangeInteger(setFieldValue)

  const handleChangeStateAndCity = async (value) => {
    await setFieldValue(`${addressFieldName}.city`, value?.city)
    await setFieldValue(`${addressFieldName}.state`, value?.state)
    await getLatLongWithFullAddress(setValues, values, addressID, addressFieldName, sessionTokenRef)
  }

  return (
    <Grid container spacing={2}>
      <Grid item sm={8} xs={12}>
        <LocationInput
          id={addressFieldName}
          textFieldName={t('ADDRESS')}
          value={values[addressFieldName]?.street}
          onChange={handleChangeStreet}
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
          value={values[addressFieldName].postal_code}
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

      <Grid item sm={4} xs={12}>
        <InputField
          name={`${addressFieldName}.number`}
          handleBlur={() => setFieldTouched(`${addressFieldName}.number`, true)}
          textFieldName={t('NUMBER')}
          textFieldHelper={t('HELPER_NUMBER_ADDRESS')}
          handleChange={handleChangeNumber}
          touched={touched[addressFieldName]?.number}
          value={values[addressFieldName]?.number}
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
          name={`${addressFieldName}.floor`}
          textFieldName={t('FLOOR')}
          handleChange={handleChangeInteger}
          touched={touched[addressFieldName]?.floor}
          value={values[addressFieldName]?.floor}
          error={errors[addressFieldName]?.floor}
        />
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
    </Grid>
  )
}

export default AddressField
