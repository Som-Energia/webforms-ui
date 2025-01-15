import * as Yup from 'yup'

export const holderIdentificationValidations = Yup.object().shape({
  holder: Yup.object().shape({
    nif: Yup.string()
      .length(9, 'ERROR_FIELD_LENGTH')
      .required('ERROR_REQUIRED_FIELD'),
    has_holder: Yup.string()
      .required('REQUIRED_FIELD')
      .oneOf(['holder-same', 'holder-different'])
  })
})

export const holderPersonalDataValidations = Yup.object().shape({
  holder: Yup.object().shape({
    name: Yup.string().required('ERROR_REQUIRED_FIELD'),
    surname1: Yup.string().required('ERROR_REQUIRED_FIELD'),
    surname2: Yup.string().required('ERROR_REQUIRED_FIELD'),
    email: Yup.string().required('ERROR_REQUIRED_FIELD').email('NO_EMAIL'),
    email2: Yup.string()
      .required('ERROR_REQUIRED_FIELD')
      .test('repeatEmail', 'NO_REPEATED_EMAIL', function () {
        return this.parent.email === this.parent.email2
      }), // To Do: is there a better way?
    phone1: Yup.string().length(9, 'NO_PHONE').required('ERROR_REQUIRED_FIELD'),
    phone2: Yup.string().length(9, 'NO_PHONE')
  })
})

export const holderTaxAddressValidations = Yup.object().shape({
  tax_address: Yup.object().shape({
    has_different_address: Yup.string()
      .required('REQUIRED_FIELD')
      .oneOf([
        'supplypoint-tax-address-same',
        'supplypoint-tax-address-different'
      ]),
    street: Yup.string().when('has_different_address', {
      is: 'supplypoint-tax-address-different',
      then: Yup.string().required('NO_ADDRESS')
    }),
    number: Yup.string().when('has_different_address', {
      is: 'supplypoint-tax-address-different',
      then: Yup.string().required('NO_ADDRESS_NUMBER')
    }),
    postal_code: Yup.string().when('has_different_address', {
      is: 'supplypoint-tax-address-different',
      then: Yup.string().required('NO_ADDRESS_POSTAL_CODE')
    }),
    city: Yup.object()
      .shape({
        id: Yup.number(),
        name: Yup.string()
      })
      .when('has_different_address', {
        is: 'supplypoint-tax-address-different',
        then: Yup.object()
          .shape({
            id: Yup.number().required('NO_ADDRESS_CITY_ID'),
            name: Yup.string().required('NO_ADDRESS_CITY_NAME')
          })
          .required('NO_ADDRESS_CITY')
      }),
    state: Yup.object()
      .shape({
        id: Yup.number(),
        name: Yup.string()
      })
      .when('has_different_address', {
        is: 'supplypoint-tax-address-different',
        then: Yup.object()
          .shape({
            id: Yup.number().required('NO_ADDRESS_STATE_ID'),
            name: Yup.string().required('NO_ADDRESS_STATE_NAME')
          })
          .required('NO_ADDRESS_STATE')
      })
  })
})

export const powerValidations = Yup.object().shape({
  contract: Yup.object().shape({
    power_type: Yup.string()
      .required('REQUIRED_FIELD')
      .oneOf(['power-lower-15kw', 'power-higher-15kw'])
  })
})

export const supplyPointDataValidations = Yup.object().shape({
  cadastral_reference: Yup.string().length(23, 'ERROR_FIELD_LENGTH'),
  cadastral_reference_valid: Yup.bool()
    .required('CADASTRAL_REFERENCE_ERROR')
    .oneOf([true], 'CADASTRAL_REFERENCE_ERROR'),
  supply_point: Yup.object().shape({
    supply_point_accepted: Yup.bool()
      .required('UNACCEPTED_FAIR_TITLE')
      .oneOf([true], 'UNACCEPTED_FAIR_TITLE')
  })
})

export const holderVoluntaryDonationValidations = Yup.object().shape({
  holder: Yup.object().shape({
    voluntary_donation: Yup.string()
      .required('REQUIRED_FIELD')
      .oneOf(['voluntary-donation-on', 'voluntary-donation-off'])
  })
})

export const holderIbanValidations = Yup.object().shape({
  holder: Yup.object().shape({
    iban: Yup.string()
      .length(29, 'ERROR_FIELD_LENGTH')
      .required('REQUIRED_FIELD'),
    iban_valid: Yup.bool().required('IBAN_ERROR').oneOf([true], 'IBAN_ERROR'),
    direct_debit_accepted: Yup.bool()
      .required('UNACCEPTED_DIRECT_DEBIT')
      .oneOf([true], 'UNACCEPTED_DIRECT_DEBIT')
  })
})
