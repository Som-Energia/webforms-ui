import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@mui/material/Grid'
import floorTypes from '../data/floor-types.json'
import { useHandleChange } from '../hooks/useHandleChange'
import AddressAutocompletedField from './AddressAutocompletedField'
import SomAutocompleteFloorInput from './AutocompleteFloorInput/AutocompleteFloorInput'

import streetTypes from '../data/street-types.json'
import { getMunicipisByPostalCode } from '../services/api'
import InputField from './InputField/InputField'
import { getPlaceDetails } from '../services/googleApiClient'
import { AddressUtils } from '../utils/adress.utils'
import { ArrayUtils } from '../utils/array.utils'
import { StringUtils } from '../utils/string.utils'
import StateCity from './StateCity'

const updateAddressValues = async (
  addressValue,
  numberValue,
  values,
  setValues,
  addressFieldName,
  sessionTokenRef,
) => {
  try {
    const place = await getPlaceDetails(addressValue.id, sessionTokenRef)

    const { postal_code: postalCode, route: streetName } =
      AddressUtils.parsePlace(place, ['postal_code', 'route'])

    const municipalities = await getMunicipisByPostalCode(postalCode)
    const cityRaw = municipalities?.[0]?.[0]?.municipi
    const stateRaw = municipalities?.[0]?.[0]?.provincia
    const city = AddressUtils.sanitizePlace(cityRaw)
    const state = AddressUtils.sanitizePlace(stateRaw)

    const [streetPartial] = streetName.split(' ') || []
    const cadastralItem = streetTypes.find((item) =>
      ArrayUtils.hasStringValue(item.values, streetPartial)
    )

    const cadastralStreetCode = cadastralItem?.code || 'CL' // Street is code by default
    const cadastralStreet = StringUtils.normalize(streetName)
    const { segments } = AddressUtils.segmentStreet(cadastralStreet)

    setValues({
      ...values,
      [addressFieldName]: {
        ...values[addressFieldName],
        id: addressValue.id,
        text: addressValue.text,
        number: numberValue,
        postal_code: postalCode || '',
        street: streetName || '',
        state,
        cadas_tv: cadastralStreetCode,
        cadas_street: segments?.length ? segments : [cadastralStreet],
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
      const {
        route: streetName,
        postal_code: postalCode,
        street_number: streetNumber
      } = AddressUtils.parsePlace(place, [
        'route',
        'postal_code',
        'street_numer'
      ])

      setFieldValue(`${addressFieldName}.street`, streetName || '')
      setFieldValue(`${addressFieldName}.postal_code`, postalCode || '')
      setNumberValue(streetNumber || numberValue || '')
      setFieldValue(
        `${addressFieldName}.number`,
        streetNumber || numberValue || ''
      )

      await updateAddressValues(
        value,
        streetNumber || numberValue,
        values,
        setValues,
        addressFieldName,
        sessionTokenRef,
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
        const municipalities = await getMunicipisByPostalCode(value)
        const cityRaw = municipalities?.[0]?.[0]?.municipi
        const stateRaw = municipalities?.[0]?.[0]?.provincia

        const city = AddressUtils.sanitizePlace(cityRaw)
        const state = AddressUtils.sanitizePlace(stateRaw)

        setFieldValue(`${addressFieldName}.city`, city)
        setFieldValue(`${addressFieldName}.state`, state)
      } catch (error) {
        console.error('Error getting municipalities by postal code:', error)
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
        <AddressAutocompletedField
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
          textFieldHelper={t('FLOOR_HELPER')}>
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
