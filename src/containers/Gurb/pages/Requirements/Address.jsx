// import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import TextRecomendation from '../../components/TextRecomendation'
import InputField from '../../components/InputField'
// import LocationInput from '../../../../components/AddressAutocompletedField'

// import { getMunicipisByPostalCode } from '../../../../services/api'

const Address = (props) => {
  const { t } = useTranslation()
  const { values, errors, touched, setFieldValue, setFieldTouched } = props
  // const [addressValue, setAddressValue] = useState(undefined)

  const handleInputAddress = (event) => {
    setFieldValue('address.street', event.target.value)
  }

  const handleInputAddressBlur = () => {
    setFieldTouched('address.street', true)
  }

  // useEffect(() => {
  //   const setMunicipisWithPostalCode = async (postalCode) => {
  //     const municipis = await getMunicipisByPostalCode(postalCode)
  //     if (municipis?.length > 0) {
  //       setFieldValue('address.state', municipis[0][0]?.provincia)
  //       setFieldValue('address.city', municipis[0][0]?.municipi)
  //     }
  //   }

  //   const postalCode = values.address.postal_code
  //   if (postalCode?.length > 4 && values?.supply_point?.city?.id === '') {
  //     setMunicipisWithPostalCode(postalCode)
  //   }
  // }, [values.address.postal_code])

  // const handleAddressChange = (value) => {
  //   setAddressValue(value)
  // }

  // const handleLocationSelected = (selection) => {
  //   if (selection === null) {
  //     setFieldValue('address.address', '')
  //     setFieldValue('address.postal_code', '')
  //     setFieldValue('address.number', '')
  //     setFieldValue('address.lat', '')
  //     setFieldValue('address.long', '')
  //     setFieldValue('address.state', { id: '', name: '' })
  //     setFieldValue('address.city', { id: '', name: '' })
  //   } else {
  //     const address = Object.assign(
  //       {},
  //       ...selection.address_components.map((x) => ({
  //         [x.types[0]]: x.long_name
  //       }))
  //     )
  //     setFieldValue('address', {
  //       street: address?.route,
  //       number: address?.street_number,
  //       lat: selection?.geometry?.location?.lat(),
  //       lng: selection?.geometry?.location?.lng(),
  //       postal_code: address?.postal_code
  //       // state: undefined,
  //       // city: undefined
  //     })
  //     setFieldValue('supply_point.address', address?.route)
  //     setFieldValue('supply_point.postal_code', address?.postal_code)
  //     setFieldValue('supply_point.number', address?.street_number || '')
  //     if (address?.street_number) {
  //       setFieldValue('supply_point.lat', selection?.geometry?.location?.lat())
  //       setFieldValue('supply_point.long', selection?.geometry?.location?.lng())
  //     }
  //   }
  // }

  return (
    <>
      <TextRecomendation
        title={t('GURB_ADDRESS_TITLE')}
        text={t('GURB_ADDRESS_TITLE_HELPER')}
      />
      &nbsp;
      {/* <LocationInput
        id="address-street"
        name="address.street"
        value={addressValue}
        onChange={handleAddressChange}
        onLocationSelected={handleLocationSelected}
      /> */}
      <InputField
        textFieldLabel={t('GURB_ADDRESS_LABEL')}
        textFieldName={t('GURB_ADDRESS_FIELD')}
        textFieldHelper={t('GURB_ADDRESS_HELPER')}
        iconHelper={false}
        handleChange={handleInputAddress}
        handleBlur={handleInputAddressBlur}
        touched={touched?.address?.street}
        value={values.address.street}
        error={errors?.address?.street}
      />
    </>
  )
}
export default Address
