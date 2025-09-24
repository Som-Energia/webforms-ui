import { useRef, useState, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from "react-router-dom";

import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import MapIcon from '@mui/icons-material/Map'
import VerifiedIcon from '@mui/icons-material/Verified'

import * as Yup from 'yup'

import {
  useHandleChange,
  useHandleChangeInteger
} from '../../../../hooks/useHandleChange'

import { addressValidations } from '../../../../containers/Gurb/requirementsValidations'
import InputField from '../../../../components/InputField'
import StateCity from '../../../../components/StateCity'
import SimpleGurbDialog from '../../../../components/SimpleGurbDialog'
import LocationInput from '../../../../containers/Gurb/components/AddressAutocompletedFieldGurb'
import { searchPlace, getPlaceDetails } from '../../../../services/googleApiClient'
import { getMunicipisByPostalCode } from '../../../../services/api'
import { checkGurbDistance } from '../../../../services/apiGurb'

import PopUpContext from '../../../../context/PopUpContext'

const normalizePlace = (place) => ({
  id: place?.id?.toString() || '',
  name: place?.name || ''
})

// Handle Gurb distance
const handleCheckGurbDistance = async (gurbCode, lat, long, setFieldValue, addressFieldName) => {
  if (!lat || !long) {
    console.error('Lat and Long are required to check Gurb distance')
    throw new Error('Lat and Long are required to check Gurb distance')
  }
  const { data } = await checkGurbDistance(gurbCode, lat, long)
  if (!data) {
    throw new GurbOutOfPerimeterError('The address is out of the allowed range for this GURB')
  } else {
    setFieldValue(`${addressFieldName}.inside_perimeter`, true)
  }
}

const getLatLongWithFullAddress = async (
  setFieldValue,
  values,
  addressFieldName,
  sessionTokenRef,
  currentNumber
) => {
  try {
    const address = values[addressFieldName]

    // Guard: need id, street, postal_code, state, city, and number
    if (
      !address?.id ||
      !address?.street ||
      !address?.postal_code ||
      !currentNumber ||
      !address?.state ||
      !address?.city
    ) {
      return
    }

    // 1. Get place details using the persistent ID
    const place = await getPlaceDetails(address.id, sessionTokenRef)

    const postalCodeComp = place.addressComponents.find((c) =>
      c.types.includes('postal_code')
    )
    const streetComp = place.addressComponents.find((c) =>
      c.types.includes('route')
    )

    // 2. Build full address string
    const fullAddress = `${streetComp?.longText || ''} ${address.number}, ${postalCodeComp?.longText || ''}`

    // 3. Search for that address
    const suggestions = await searchPlace(fullAddress, sessionTokenRef)
    if (suggestions.length === 0) return

    // 4. Get suggested place details
    const suggestedPlace = await getPlaceDetails(suggestions[0].id, sessionTokenRef)

    // 5. Update Formik with lat/long
    await setFieldValue(`${addressFieldName}.lat`, suggestedPlace.location.lat())
    await setFieldValue(`${addressFieldName}.long`, suggestedPlace.location.lng())

  } catch (error) {
    console.error('Error updating address values:', error)
  }
}

class GurbOutOfPerimeterError extends Error {
  constructor(message) {
    super(message);
    this.name = "GurbOutOfPerimeterError";
  }
}

const AddressField = ({
  addressFieldName = 'address',
  values,
  errors,
  setFieldError,
  touched,
  setFieldValue,
  setFieldTouched,
  setTouched
}) => {
  const { t } = useTranslation()
  const sessionTokenRef = useRef()
  const [loading, setLoading] = useState(false)
  const { gurbCode } = useParams()
  const { setContent } = useContext(PopUpContext)

  const handleChangeStreet = async (addressValue) => {
    if (!addressValue || !addressValue.id) {
      setFieldValue(
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

      await setFieldValue(
        `${addressFieldName}.street`,
        streetComponent?.longText || ''
      )
      await setFieldValue(
        `${addressFieldName}.postal_code`,
        postalCodeComponent?.longText || ''
      )

      await UpdateStateCityByPostalCode(postalCodeComponent?.longText || '')
      await getLatLongWithFullAddress(setFieldValue, values, addressFieldName, sessionTokenRef, values[addressFieldName]?.number)

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
    await getLatLongWithFullAddress(setFieldValue, values, addressFieldName, sessionTokenRef, values[addressFieldName]?.number)
  }

  const handleChangeNumber = async (event) => {
    const cleanedNumber = event.target.value.replace(/[^0-9]/g, '')
    await setFieldValue(`${addressFieldName}.number`, cleanedNumber)
    if (cleanedNumber) {
      getLatLongWithFullAddress(
        setFieldValue,
        values,
        addressFieldName,
        sessionTokenRef,
        cleanedNumber
      )
    } else {
      await setFieldValue(`${addressFieldName}.lat`, undefined)
      await setFieldValue(`${addressFieldName}.long`, undefined)
    }
  }

  const handleChange = useHandleChange(setFieldValue)

  const handleChangeInteger = useHandleChangeInteger(setFieldValue)

  const handleChangeStateAndCity = async (value) => {
    await setFieldValue(`${addressFieldName}.city`, value?.city)
    await setFieldValue(`${addressFieldName}.state`, value?.state)

    await getLatLongWithFullAddress(setFieldValue, values, addressFieldName, sessionTokenRef, values[addressFieldName]?.number)
  }

  const handleClick = async () => {

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
    }
    catch (err) {
      // Handle Yup validation errors
      if (err instanceof Yup.ValidationError) {
        const updates = { address: {} }
        await err.inner.forEach(async (e) => {
          if (e.path) {
            await setFieldError(e.path, e.message)
            let keyPattern = e.path.split('.')[1]
            updates.address[keyPattern] = true
          }
        })
        await setTouched(updates)
      }

      // Handle Gurb out of perimeter error
      else if (err instanceof GurbOutOfPerimeterError) {
        setFieldValue(`${addressFieldName}.inside_perimeter`, false)
        setContent(
          <SimpleGurbDialog title={<Typography dangerouslySetInnerHTML={{ __html: t('GURB_ERROR_ADDRESS_OUT_OF_PERIMETER') }} />}
            closeFunction={async () => {
              setContent(undefined)
            }}
          />
        )
      }

      // Handle other errors
      else {
        console.error('Error validating perimeter address:', err)
        setContent(
          <SimpleGurbDialog text={<Typography dangerouslySetInnerHTML={{ __html: t('GURB_ERROR_CHECKING_DISTANCE') }} />}
            closeFunction={async () => {
              setContent(undefined)
            }}
          />
        )
      }

    } finally {
      setLoading(false)
    }
  }

  return (
    <Grid container spacing={2}>
      <Grid item sm={8} xs={12}>
        <LocationInput
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
          name={'postal_code'}
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
          name={'number'}
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
          name={'floor'}
          textFieldName={t('FLOOR')}
          handleChange={handleChangeInteger}
          touched={touched[addressFieldName]?.floor}
          value={values[addressFieldName]?.floor}
          error={errors[addressFieldName]?.floor}
        />
      </Grid>

      <Grid item sm={2} xs={6}>
        <InputField
          name={'door'}
          textFieldName={t('DOOR')}
          handleChange={handleChange}
          touched={touched[addressFieldName]?.door}
          value={values[addressFieldName]?.door}
          error={errors[addressFieldName]?.door}
        />
      </Grid>

      <Grid item sm={2} xs={6}>
        <InputField
          name={'stairs'}
          textFieldName={t('STAIRS')}
          handleChange={handleChange}
          touched={touched[addressFieldName]?.stairs}
          value={values[addressFieldName]?.stairs}
          error={errors[addressFieldName]?.stairs}
        />
      </Grid>

      <Grid item sm={2} xs={6}>
        <InputField
          name={'bloc'}
          textFieldName={t('BLOCK')}
          handleChange={handleChange}
          touched={touched[addressFieldName]?.bloc}
          value={values[addressFieldName]?.bloc}
          error={errors[addressFieldName]?.bloc}
        />
      </Grid>
      <Grid item xs={12}>
        <Button
          endIcon={
            loading
              ? <CircularProgress size='20px' />
              : values.address.inside_perimeter
                ? <VerifiedIcon sx={{ fontSize: 20 }} />
                : <MapIcon sx={{ fontSize: 20 }} />
          }
          disabled={loading} onClick={handleClick}
          data-cy={'validate-address'}
        >
          VALIDAR
        </Button>
      </Grid>

    </Grid>
  )
}

export default AddressField
