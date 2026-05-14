export const buildInitialValues = (language, tariff) => ({
  cups: '',
  cups_valid: false,
  has_member: undefined,
  member_is_holder: undefined,
  has_light: undefined,
  previous_holder: undefined,
  voluntary_donation: undefined,
  cadastral_reference: undefined,
  cadastral_reference_valid: true,
  supply_point: {
    cnae: '',
    supply_point_accepted: false,
    is_housing: '',
    attachments: []
  },
  supply_point_address: {
    street: '',
    number: '',
    floor: '',
    door: '',
    stairs: '',
    bloc: '',
    postal_code: '',
    state: { id: '', name: '' },
    city: { id: '', name: '' }
  },
  address: {
    street: '',
    number: '',
    floor: '',
    door: '',
    stairs: '',
    bloc: '',
    postal_code: '',
    state: { id: '', name: '' },
    city: { id: '', name: '' }
  },
  member: {
    number: '',
    nif: ''
  },
  new_member: {
    nif: '',
    nif_valid: false,
    person_type: '',
    proxynif: '',
    proxyname: '',
    name: '',
    surname1: '',
    surname2: '',
    gender: '',
    birthdate: undefined,
    email: '',
    email2: '',
    phone: '',
    phone_code: '+34',
    phone_valid: false,
    language: `${language}_ES`,
    referral_source: '',
    payment_method: undefined,
    sepa_accepted: false,
    iban: undefined,
    legal_person_accepted: false
  },
  contract: {
    tariff_mode: tariff,
    power_type: '',
    power: {
      power1: '',
      power2: '',
      power3: '',
      power4: '',
      power5: '',
      power6: ''
    },
    phase: 'mono'
  },
  has_selfconsumption: undefined,
  self_consumption: {
    cau: '',
    cau_valid: false,
    collective_installation: undefined,
    installation_type: '',
    technology: 'b11',
    aux_services: undefined,
    installation_power: ''
  },
  privacy_policy_accepted: false,
  generic_conditions_accepted: false,
  statutes_accepted: false,
  comercial_info_accepted: false
})
