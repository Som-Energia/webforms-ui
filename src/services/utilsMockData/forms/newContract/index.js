import {
  address,
  client,
  iban_values,
  random_cups,
  random_iban,
  random_nif,
  random_number,
  selfconsumption,
  supply_point
} from '../../common'

// fixtures normalized
const contract_info_c1_20TD = {
  cnae: '9820',
  cups: random_cups,
  cups_address: address.normalizedData,
  is_indexed: false,
  powers: ['2000', '2000'],
  process: 'C1',
  tariff: '2.0TD'
}

const contract_info_a3_indexed = {
  cnae: '9820',
  cups: random_cups,
  cups_address: address.normalizedData,
  is_indexed: true,
  powers: ['2100', '2500'],
  process: 'A3',
  tariff: '2.0TD'
}

const contract_info_c2_30TD = {
  cnae: '9820',
  cups: random_cups,
  cups_address: address.normalizedData,
  is_indexed: false,
  powers: ['10000', '12000', '13000', '14000', '14000', '16000'],
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
    supply_point: supply_point.without_attachments.entryValues,
    supply_point_address: address.entryValues,
    address: address.empty,
    member: {
      number: random_number,
      nif: random_nif,
      link_member: true
    },
    new_member: {
      ...client.empty,
      ...iban_values,
      payment_method: 'iban'
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
    self_consumption: selfconsumption.empty,
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
    address: address.entryValues,
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
    self_consumption: selfconsumption.empty,
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
    supply_point: supply_point.without_attachments.entryValues,
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
    self_consumption: selfconsumption.empty,
    privacy_policy_accepted: true,
    generic_conditions_accepted: true,
    statutes_accepted: true,
    comercial_info_accepted: false,
    is_client: false
  },
  normalizedData: {
    linked_member: 'new_member',
    contract_info: contract_info_c1_20TD,
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
    supply_point: supply_point.without_attachments.entryValues,
    supply_point_address: address.entryValues,
    address: address.empty,
    member: {
      number: random_number,
      nif: random_nif,
      link_member: true
    },
    new_member: {
      ...client.empty,
      ...iban_values,
      payment_method: 'iban'
    },
    contract: {
      tariff_mode: 'indexed',
      power_type: 'power-lower-15kw',
      power: {
        power1: '2.1',
        power2: '2.5'
      }
    },
    has_selfconsumption: 'selfconsumption-off',
    self_consumption: selfconsumption.empty,
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
    supply_point: supply_point.without_attachments.entryValues,
    supply_point_address: address.entryValues,
    address: address.empty,
    member: {
      number: random_number,
      nif: random_nif,
      link_member: true
    },
    new_member: {
      ...client.empty,
      ...iban_values,
      payment_method: 'iban'
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
    self_consumption: selfconsumption.empty,
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
    supply_point: supply_point.with_attachments.entryValues,
    supply_point_address: address.entryValues,
    address: address.empty,
    member: {
      number: random_number,
      nif: random_nif,
      link_member: true
    },
    new_member: {
      ...client.empty,
      ...iban_values,
      payment_method: 'iban'
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
    statutes_accepted: true,
    attachments: [{filename: 'road_poneglyph.jpg', category: 'invoice'}]
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
    supply_point: supply_point.without_attachments.entryValues,
    supply_point_address: address.entryValues,
    address: address.empty,
    member: {
      number: random_number,
      nif: random_nif,
      link_member: true
    },
    new_member: {
      ...client.empty,
      ...iban_values,
      payment_method: 'iban'
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
    self_consumption: selfconsumption.empty,
    privacy_policy_accepted: true,
    generic_conditions_accepted: true,
    statutes_accepted: true,
    comercial_info_accepted: false,
    is_client: false
  },
  normalizedData: {
    linked_member: 'already_member',
    contract_info: {
      ...contract_info_c1_20TD,
      cups_cadastral_reference: '8277124YR8968U5098BP'
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

const paymentTPV = {
  entryValues: {
    cups: random_cups,
    has_member: 'member-on',
    member_is_holder: 'holder-member-yes',
    has_light: 'light-on',
    previous_holder: 'previous-holder-yes',
    voluntary_donation: false,
    cadastral_reference_valid: true,
    supply_point: supply_point.without_attachments.entryValues,
    supply_point_address: address.entryValues,
    address: address.empty,
    member: {
      number: random_number,
      nif: random_nif,
      link_member: true
    },
    new_member: {
      ...client.empty,
      ...iban_values,
      payment_method: 'credit_card'
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
    self_consumption: selfconsumption.empty,
    privacy_policy_accepted: true,
    generic_conditions_accepted: true,
    statutes_accepted: true,
    comercial_info_accepted: false,
    is_client: false
  },
  normalizedData: {
    linked_member: 'already_member',
    contract_info: contract_info_c1_20TD,
    member_payment_type: 'tpv',
    donation: false,
    iban: random_iban,
    sepa_accepted: true,
    linked_member_info: {
      vat: random_nif,
      code: random_number
    },
    privacy_conditions: true,
    general_contract_terms_accepted: true,
    statutes_accepted: true
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
  cadastraslReference: cadastralReference,
  // Payment cases
  // paymentIBAN: base cases for all previous cases
  paymentTPV: paymentTPV
}

export default newContractCases
