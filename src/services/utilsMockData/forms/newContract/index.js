import { address, client, selfconsumption } from '../../common'

const random_cups = 'ES0031405905577001DH0F'
const random_number = '12345'
const random_nif = '12345678P'
const random_iban = 'ES12 3456 7891 2345 6789 1234'

// fixtures normalized
const contract_info_c1_20TD = {
  cnae: '9820',
  cups: random_cups,
  cups_address: address.normalizedData,
  is_indexed: false,
  powers: ['2', '2'],
  process: 'C1',
  tariff: '2.0TD'
}

const contract_info_a3_indexed = {
  cnae: '9820',
  cups: random_cups,
  cups_address: address.normalizedData,
  is_indexed: true,
  powers: ['2', '2'],
  process: 'A3',
  tariff: '2.0TD'
}

const contract_info_c2_30TD = {
  cnae: '9820',
  cups: random_cups,
  cups_address: address.normalizedData,
  is_indexed: false,
  powers: ['10', '12', '13', '14', '14', '16'],
  process: 'C2',
  tariff: '3.0TD'
}

// newContract member cases

const alreadyMember = {
  entryValues: {
    cups: random_cups,
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
    supply_point_address: address.entryValues,
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
      number: random_number,
      nif: random_nif,
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
      iban: random_iban,
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
      code: random_number,
      vat: random_nif
    },
    contract_info: contract_info_c1_20TD,
    donation: false,
    iban: random_iban,
    member_payment_type: 'remesa',
    sepa_accepted: true,
    general_contract_terms_accepted: true,
    privacy_conditions: true,
    statutes_accepted: true
  }
}

const sponsored = {
  entryValues: {
    cups: random_cups,
    has_member: 'member-on',
    member_is_holder: 'holder-member-no',
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
    supply_point_address: address.entryValues,
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
      number: random_number,
      nif: random_nif,
      link_member: true
    },
    new_member: client.physical.entryValues,
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
    linked_member: 'sponsored',
    linked_member_info: {
      code: random_number,
      vat: random_nif
    },
    contract_info: contract_info_c1_20TD,
    contract_owner: {
      ...client.physical.normalizedData,
      address: address.normalizedData
    },
    donation: false,
    iban: random_iban,
    member_payment_type: 'remesa',
    sepa_accepted: true,
    general_contract_terms_accepted: true,
    privacy_conditions: true,
    statutes_accepted: true
  }
}

const newMember = {
  entryValues: {
    cups: random_cups,
    has_member: 'member-off',
    has_light: 'light-on',
    previous_holder: 'previous-holder-yes',
    voluntary_donation: true,
    cadastral_reference_valid: true,
    supply_point: {
      cnae: 9820,
      supply_point_accepted: true,
      is_housing: true,
      cnae_valid: true
    },
    supply_point_address: address.entryValues,
    address: address.entryValues,
    member: {
      number: '',
      nif: ''
    },
    new_member: client.physical.entryValues,
    contract: {
      tariff_mode: 'periods',
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
    is_client: false
  },
  normalizedData: {
    linked_member: 'new_member',
    contract_info: contract_info_c1_20TD,
    contract_owner: {
      ...client.physical.normalizedData,
      address: address.normalizedData
    },
    new_member_info: {
      ...client.physical.normalizedData,
      address: address.normalizedData
    },
    donation: true,
    iban: random_iban,
    member_payment_type: 'remesa',
    sepa_accepted: true,
    general_contract_terms_accepted: true,
    privacy_conditions: true,
    statutes_accepted: true
  }
}

// newContract contract cases

const A3_indexed = {
  entryValues: {
    cups: random_cups,
    has_member: 'member-on',
    member_is_holder: 'holder-member-yes',
    has_light: 'light-off',
    previous_holder: 'previous-holder-yes',
    voluntary_donation: true,
    cadastral_reference_valid: true,
    supply_point: {
      cnae: 9820,
      supply_point_accepted: true,
      is_housing: true,
      cnae_valid: true
    },
    supply_point_address: address.entryValues,
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
      number: random_number,
      nif: random_nif,
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
      referral_source: '',
      payment_method: 'iban',
      sepa_accepted: true,
      iban: random_iban,
      legal_person_accepted: false,
      iban_valid: true
    },
    contract: {
      tariff_mode: 'indexed',
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
    is_client: false
  },
  normalizedData: {
    contract_info: contract_info_a3_indexed,
    donation: true,
    general_contract_terms_accepted: true,
    iban: random_iban,
    linked_member: 'already_member',
    linked_member_info: {
      code: random_number,
      vat: random_nif
    },
    member_payment_type: 'remesa',
    privacy_conditions: true,
    sepa_accepted: true,
    statutes_accepted: true
  }
}

const C2_30TD = {
  entryValues: {
    cups: random_cups,
    has_member: 'member-on',
    member_is_holder: 'holder-member-yes',
    has_light: 'light-on',
    previous_holder: 'previous-holder-no',
    voluntary_donation: true,
    cadastral_reference_valid: true,
    supply_point: {
      cnae: 9820,
      supply_point_accepted: true,
      is_housing: true,
      cnae_valid: true
    },
    supply_point_address: address.entryValues,
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
      number: random_number,
      nif: random_nif,
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
      referral_source: '',
      payment_method: 'iban',
      sepa_accepted: true,
      iban: random_iban,
      legal_person_accepted: false,
      iban_valid: true
    },
    contract: {
      tariff_mode: 'periods',
      power_type: 'power-higher-15kw',
      power: {
        power1: '10',
        power2: '12',
        power3: '13',
        power4: '14',
        power5: '14',
        power6: '16'
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
    is_client: false
  },
  normalizedData: {
    linked_member: 'already_member',
    contract_info: contract_info_c2_30TD,
    iban: random_iban,
    sepa_accepted: true,
    member_payment_type: 'remesa',
    donation: true,
    privacy_conditions: true,
    general_contract_terms_accepted: true,
    statutes_accepted: true,
    linked_member_info: {
      vat: random_nif,
      code: random_number
    }
  }
}

const withSelfconsumption = {
  entryValues: {
    cups: random_cups,
    has_member: 'member-on',
    member_is_holder: 'holder-member-yes',
    has_light: 'light-on',
    previous_holder: 'previous-holder-yes',
    voluntary_donation: true,
    cadastral_reference_valid: true,
    supply_point: {
      cnae: 9820,
      supply_point_accepted: true,
      is_housing: true,
      cnae_valid: true
    },
    supply_point_address: address.entryValues,
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
      number: random_number,
      nif: random_nif,
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
      referral_source: '',
      payment_method: 'iban',
      sepa_accepted: true,
      iban: random_iban,
      legal_person_accepted: false,
      iban_valid: true
    },
    contract: {
      tariff_mode: 'periods',
      power_type: 'power-lower-15kw',
      power: {
        power1: '2',
        power2: '2'
      }
    },
    has_selfconsumption: 'selfconsumption-on',
    self_consumption: selfconsumption.entryValues,
    privacy_policy_accepted: true,
    generic_conditions_accepted: true,
    statutes_accepted: true,
    comercial_info_accepted: false,
    is_client: false
  },
  normalizedData: {
    linked_member: 'already_member',
    contract_info: contract_info_c1_20TD,
    donation: true,
    member_payment_type: 'remesa',
    iban: random_iban,
    sepa_accepted: true,
    self_consumption: selfconsumption.normalizedData,
    linked_member_info: {
      vat: random_nif,
      code: random_number
    },
    privacy_conditions: true,
    general_contract_terms_accepted: true,
    statutes_accepted: true
  }
}

const cadastralReference = {
  entryValues: {
    cups: random_cups,
    has_member: 'member-on',
    member_is_holder: 'holder-member-yes',
    has_light: 'light-on',
    previous_holder: 'previous-holder-yes',
    voluntary_donation: true,
    cadastral_reference: '8277124 YR8968U 5098 BP',
    cadastral_reference_valid: true,
    supply_point: {
      cnae: 9820,
      supply_point_accepted: true,
      is_housing: true,
      cnae_valid: true
    },
    supply_point_address: address.entryValues,
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
      number: random_number,
      nif: random_nif,
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
      referral_source: '',
      payment_method: 'iban',
      sepa_accepted: true,
      iban: random_iban,
      legal_person_accepted: false,
      iban_valid: true
    },
    contract: {
      tariff_mode: 'periods',
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
    is_client: false
  },
  normalizedData: {
    linked_member: 'already_member',
    contract_info: {
      cups: random_cups,
      tariff: '2.0TD',
      is_indexed: false,
      powers: ['2', '2'],
      cups_address: address.normalizedData,
      cnae: '9820',
      process: 'C1',
      cups_cadastral_reference: '8277124 YR8968U 5098 BP'
    },
    iban: random_iban,
    sepa_accepted: true,
    member_payment_type: 'remesa',
    donation: true,
    privacy_conditions: true,
    general_contract_terms_accepted: true,
    statutes_accepted: true,
    linked_member_info: {
      vat: random_nif,
      code: random_number
    }
  }
}

const newContractCases = {
  // Member cases
  alreadyMember: alreadyMember,
  sponsored: sponsored,
  newMember: newMember,
  // Contract cases
  // C1_20TD: base case for member cases
  A3_indexed: A3_indexed,
  C2_30TD: C2_30TD,
  selfconsumption: withSelfconsumption,
  cadastraslReference: cadastralReference
}

export default newContractCases
