import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import TextRecomendation from '../../components/TextRecomendation'
import LocationInput from '../../components/AddressAutocompletedField'
import { setMunicipisWithPostalCode } from '../../../../services/utils'
import { checkGurbDistance } from '../../../../services/apiGurb'
import GurbErrorContext from '../../../../context/GurbErrorContext'
import Box from '@mui/material/Box'
import InputField from '../../components/InputField'


const Address = (props) => {
  const { t } = useTranslation()
  const { values, errors, touched, setFieldValue, setFieldTouched } = props
  const { setError, setErrorInfo } = useContext(GurbErrorContext)
  const [addressValue, setAddressValue] = useState('')

  useEffect(() => {
    const postalCode = values.address.postal_code
    if (postalCode?.length > 4) {
      setMunicipisWithPostalCode(postalCode, setFieldValue, 'address', values)
    }
  }, [values.address.postal_code])

  const handleCheckGurbDistance = async () => {
    // TODO: waiting to know where gurb id comes from
    const gurbId = 3
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

  const handleAddressChange = (value) => {
    setAddressValue(value)
  }

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

  const handleLocationSelected = (selection) => {
    if (selection === null) {
      initializeAddress()
    } else {
      const address = Object.assign(
        {},
        ...selection.address_components.map((x) => ({
          [x.types[0]]: x.long_name
        }))
      )
      setFieldValue('address', {
        street: address?.route,
        number: address?.street_number || '',
        lat: selection?.geometry?.location?.lat(),
        long: selection?.geometry?.location?.lng(),
        postal_code: address?.postal_code
      })
    }
  }

  const handleChangeInteger = (event) => {
    let cleanedValue = event.target.value.replace(/[^0-9]/g, '')
    setFieldValue(event.target.name, cleanedValue)
  }

  const handleChange = (event) => {
    setFieldValue(event.target.name, event.target.value)
  }

  return (
    <>
      <TextRecomendation
        title={t('GURB_ADDRESS_TITLE')}
        text={t('GURB_ADDRESS_TITLE_HELPER')}
      />
      <LocationInput
        textFieldLabel={t('GURB_ADDRESS_LABEL')}
        textFieldName={t('GURB_ADDRESS_FIELD')}
        textFieldHelper={t('GURB_ADDRESS_HELPER')}
        id="address-street"
        name="address.street"
        value={addressValue}
        onChange={handleAddressChange}
        onLocationSelected={handleLocationSelected}
      />
      <Box sx={{ display: 'flex', gap: '2rem' }}>
        <Box>
          <InputField
            name={'address.number'}
            textFieldName={t('NUMBER')}
            handleChange={handleChangeInteger}
            touched={touched?.address?.number}
            value={values?.address?.number}
            error={errors?.address?.number}
            required={true}
          />
        </Box>
        <Box>
          <InputField
            name={'address.floor'}
            textFieldName={t('FLOOR')}
            handleChange={handleChangeInteger}
            touched={touched?.address?.floor}
            value={values?.address?.floor}
            error={errors?.address?.floor}
            required={false}
          />
        </Box>
        <Box>
          <InputField
            name={'address.door'}
            textFieldName={t('DOOR')}
            handleChange={handleChangeInteger}
            touched={touched?.address?.door}
            value={values?.address?.door}
            error={errors?.address?.door}
            required={false}
          />
        </Box>
        <Box>
          <InputField
            name={'address.stairs'}
            textFieldName={t('STAIRS')}
            handleChange={handleChange}
            touched={touched?.address?.stairs}
            value={values?.address?.stairs}
            error={errors?.address?.stairs}
            required={false}
          />
        </Box>
        <Box>
          <InputField
            name={'address.bloc'}
            textFieldName={t('BLOCK')}
            handleChange={handleChange}
            touched={touched?.address?.bloc}
            value={values?.address?.bloc}
            error={errors?.address?.bloc}
            required={false}
          />
        </Box>
      </Box>
    </>
  )
}
export default Address
