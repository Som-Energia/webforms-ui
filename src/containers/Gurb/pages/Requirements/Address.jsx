import { useContext, useEffect, useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import TextRecomendation from '../../components/TextRecomendation'
import LocationInput from '../../components/AddressAutocompletedField'
import { checkGurbDistance } from '../../../../services/apiGurb'
import GurbErrorContext from '../../../../context/GurbErrorContext'
import InputField from '../../../../components/InputField'
import {
  getPlaceDetails,
  searchPlace
} from '../../../../services/googleApiClient'
import { getMunicipisByPostalCode } from '../../../../services/api'
import Grid from '@mui/material/Grid'

const Address = (props) => {
  const { t } = useTranslation()
  const { values, errors, touched, setFieldValue, setFieldTouched, setValues } =
    props
  const { setError, setErrorInfo } = useContext(GurbErrorContext)
  const [addressValue, setAddressValue] = useState(values.address.street)
  const [numberValue, setNumberValue] = useState(values.address.number)
  const sessionTokenRef = useRef()

  const updateAddressValues = async () => {
    try {
      const place = await getPlaceDetails(addressValue.id, sessionTokenRef)
      const postalCode = place.addressComponents.find((component) =>
        component.types.includes('postal_code')
      )
      const municipis = await getMunicipisByPostalCode(postalCode?.longText)
      const street = place.addressComponents.find((component) =>
        component.types.includes('route')
      )
      const fullAddress = place.formattedAddress.replace(
        /,/,
        ` ${numberValue},`
      )
      const suggestions = await searchPlace(fullAddress, sessionTokenRef)

      if (suggestions.length > 0) {
        const suggestedPlace = await getPlaceDetails(
          suggestions[0].id,
          sessionTokenRef
        )

        const updatedValues = {
          ...values,
          address: {
            ...values.address,
            number: numberValue,
            lat: suggestedPlace.location.lat(),
            long: suggestedPlace.location.lng(),
            postal_code: postalCode?.longText || '',
            street: street?.longText || '',
            state: municipis && municipis[0] ? municipis[0][0]?.provincia : {},
            city: municipis && municipis[0] ? municipis[0][0]?.municipi : {}
          }
        }

        setValues(updatedValues)
      } else {
        console.log('Address not found')
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (addressValue?.id && numberValue) {
      updateAddressValues()
    } else if (!addressValue || !numberValue) {
      initializeAddress()
    }
  }, [addressValue, numberValue])

  const handleCheckGurbDistance = async () => {
    // TODO: waiting to know where gurb id comes from
    const gurbId = 2
    await checkGurbDistance(gurbId, values.address.lat, values.address.long)
      .then(({ data }) => {
        // data is false when address is outside gurb's 2km limit
        if (data === false) {
          setError(true)
          setErrorInfo({
            main_text: t('GURB_ADDRESS_ERROR_MAIN_TEXT'),
            seconday_text: t('GURB_ADDRESS_ERROR_SECONDARY_TEXT'),
            link_text: t('GURB_ADDRESS_ERROR_LINK_TEXT'),
            error_type: 'error',
            clean_field: () => {
              initializeAddress()
            }
          })
        }
      })
      .catch((error) => {
        // TODO: handle errors
        console.log('ERROR:', error)
      })
  }

  useEffect(() => {
    if (values.address.lat !== undefined && values.address.long !== undefined) {
      handleCheckGurbDistance()
    }
  }, [values.address.lat, values.address.long])

  const initializeAddress = () => {
    setFieldValue('address', {
      street: '',
      number: '',
      lat: '',
      long: '',
      postal_code: '',
      state: { id: '', name: '' },
      city: { id: '', name: '' }
    })
  }

  const handleAddressChange = (value) => {
    setAddressValue(value)
  }

  const handleChangeNumber = (event) => {
    let cleanedValue = event.target.value.replace(/[^0-9]/g, '')
    setNumberValue(cleanedValue)
  }

  const handleChangeInteger = (event) => {
    let cleanedValue = event.target.value.replace(/[^0-9]/g, '')
    setFieldValue(event.target.name, cleanedValue)
  }

  const handleChange = (event) => {
    setFieldValue(event.target.name, event.target.value)
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextRecomendation
          title={t('GURB_ADDRESS_TITLE')}
          text={t('GURB_ADDRESS_TITLE_HELPER')}
        />
      </Grid>
      <Grid item xs={12}>
        <LocationInput
          required
          textFieldName={t('GURB_ADDRESS_FIELD')}
          textFieldHelper={t('GURB_ADDRESS_HELPER')}
          id="address-street"
          name="address.street"
          value={addressValue}
          onChange={handleAddressChange}
          sessionTokenRef={sessionTokenRef}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <InputField
          name={'address.number'}
          textFieldName={t('NUMBER')}
          handleChange={handleChangeNumber}
          touched={touched?.address?.number}
          value={numberValue}
          error={errors?.address?.number}
          required={true}
        />
      </Grid>
      <Grid item xs={6} sm={2}>
        <InputField
          name={'address.floor'}
          textFieldName={t('FLOOR')}
          handleChange={handleChangeInteger}
          touched={touched?.address?.floor}
          value={values?.address?.floor}
          error={errors?.address?.floor}
          required={false}
        />
      </Grid>
      <Grid item xs={6} sm={2}>
        <InputField
          name={'address.door'}
          textFieldName={t('DOOR')}
          handleChange={handleChangeInteger}
          touched={touched?.address?.door}
          value={values?.address?.door}
          error={errors?.address?.door}
          required={false}
        />
      </Grid>
      <Grid item xs={6} sm={2}>
        <InputField
          name={'address.stairs'}
          textFieldName={t('STAIRS')}
          handleChange={handleChange}
          touched={touched?.address?.stairs}
          value={values?.address?.stairs}
          error={errors?.address?.stairs}
          required={false}
        />
      </Grid>
      <Grid item xs={6} sm={2}>
        <InputField
          name={'address.bloc'}
          textFieldName={t('BLOCK')}
          handleChange={handleChange}
          touched={touched?.address?.bloc}
          value={values?.address?.bloc}
          error={errors?.address?.bloc}
          required={false}
        />
      </Grid>
    </Grid>
  )
}
export default Address
