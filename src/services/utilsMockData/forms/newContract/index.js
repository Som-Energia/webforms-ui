// fixtures normalized
const contract_info_c1_20TD = () => {
  return {
    cnae: "9820",
    cups: 'ES0031405905577001DH0F',
    cups_cadastral_reference: undefined,
    cups_address: {
      street: 'Carrer Test',
      number: '19',
      postal_code: '17004',
      city_id: 5386,
      state_id: 20,
      block: undefined,
      door: undefined,
      floor: undefined,
      stair: undefined
    },
    powers: ['2', '2'],
    process: 'C1',
    is_indexed: false,
    tariff: '2.0TD'
  }
}

const alreadyMember = {
  entryValues: {
    cups: 'ES0031405905577001DH0F',
    has_member: 'member-on',
    member_is_holder: 'holder-member-yes',
    has_light: 'light-on',
    previous_holder: 'previous-holder-yes',
    voluntary_donation: false,
    cadastral_reference_valid: true,
    supply_point: {
      cnae: 9820,
      supply_point_accepted: true,
      is_housing: true,
      cnae_valid: true
    },
    supply_point_address: {
      street: 'Carrer Test',
      number: '19',
      postal_code: '17004',
      state: {
        id: 20,
        name: 'Girona'
      },
      city: {
        id: 5386,
        name: 'Girona'
      }
    },
    address: {
      street: '',
      number: '',
      floor: '',
      door: '',
      stairs: '',
      bloc: '',
      postal_code: ''
    },
    member: {
      number: '1234',
      nif: '123456785P',
      link_member: true
    },
    new_member: {
      nif: '',
      become_member: false,
      person_type: '',
      proxynif_valid: false,
      proxynif: '',
      proxyname: '',
      name: '',
      surname1: '',
      surname2: '',
      gender: '',
      email: '',
      email2: '',
      phone: '',
      phone_code: '+34',
      phone_valid: false,
      language: 'es_ES',
      how_meet_us: '',
      payment_method: 'iban',
      sepa_accepted: true,
      iban: 'ES12 3456 7891 2345 6789 1234',
      legal_person_accepted: false,
      iban_valid: true
    },
    contract: {
      tariff_mode: '',
      power_type: 'power-lower-15kw',
      power: {
        power1: '2',
        power2: '2'
      }
    },
    has_selfconsumption: 'selfconsumption-off',
    self_consumption: {
      cau_error: false,
      installation_type: '',
      technology: 'b11',
      installation_power: ''
    },
    privacy_policy_accepted: true,
    generic_conditions_accepted: true,
    statutes_accepted: true,
    comercial_info_accepted: false,
    is_client: true
  },
  normalizedData: {
    linked_member: 'already_member',
    linked_member_info: {
      code: '1234',
      vat: '123456785P'
    },
    contract_info: contract_info_c1_20TD(),
    donation: false,
    iban: 'ES12 3456 7891 2345 6789 1234',
    member_payment_type: 'remesa',
    general_contract_terms_accepted: true,
    privacy_conditions: true,
    statutes_accepted: true,
  }
}

const newContractCases = {
  // Member cases
  alreadyMember: alreadyMember,
}

export default newContractCases