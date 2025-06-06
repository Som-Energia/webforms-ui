export const address = {
  entryValues: {
    street: 'Calle Test',
    number: '13',
    floor: '2',
    door: '',
    stairs: '',
    bloc: '',
    postal_code: '17004',
    state: {
      id: 20,
      name: 'Girona'
    },
    city: {
      id: 5386,
      name: 'Girona'
    },
    lat: '1234',
    long: '1234'
  },
  normalizedData: {
    state_id: 20,
    city_id: 5386,
    postal_code: '17004',
    street: 'Calle Test',
    number: '13',
    floor: '2',
    stair: '',
    door: '',
    block: ''
  }
}

export const selfconsumption = {
  entryValues: {
    cau: 'EU12341234435THISISACAU',
    cau_error: false,
    collective_installation: 'yes',
    installation_type: 'individual',
    technology: 'b11',
    aux_services: 'something',
    installation_power: '5'
  },
  normalizedData: {
    cau: 'EU12341234435THISISACAU',
    collective_installation: 'yes',
    installation_power: '5',
    installation_type: 'individual',
    aux_services: 'something',
    technology: 'b11',
    attachments: '' // TODO: check this
  }
}

export const client = {
  physical: {
    entryValues: {
      nif: '12345678P',
      become_member: false,
      person_type: 'physic-person',
      proxynif_valid: false,
      proxynif: '',
      proxyname: '',
      name: 'Luffy',
      surname1: 'D',
      surname2: 'Monkey',
      gender: 'male',
      birthdate: '1997-05-05',
      email: 'luffy@example.coop',
      email2: 'luffy@example.coop',
      phone: '612345678',
      phone_code: '+34',
      phone_valid: true,
      language: 'ca_ES',
      referral_source: '',
      payment_method: 'iban',
      iban: 'ES12 3456 7891 2345 6789 1234',
      sepa_accepted: true,
      legal_person_accepted: false
    },
    normalizedData: {
      vat: '12345678P',
      name: 'Luffy',
      surname: 'D Monkey',
      is_juridic: 'physic-person',
      proxy_name: '',
      proxy_vat: '',
      email: 'luffy@example.coop',
      phone: '+34612345678',
      lang: 'ca_ES',
      gender: 'male',
      birthdate: '1997-05-05',
      referral_source: ''
    }
  },
  juridic: {
    entryValues: {
      nif: 'U12345678',
      become_member: false,
      person_type: 'legal-person',
      proxynif_valid: true,
      proxynif: '12345678P',
      proxyname: 'Luffy',
      name: 'Mugiwara SL',
      surname1: '',
      surname2: '',
      gender: '',
      birthdate: '',
      email: 'mugiwara@example.coop',
      email2: 'mugiwara@example.coop',
      phone: '612345679',
      phone_code: '+34',
      phone_valid: true,
      language: 'es_ES',
      referral_source: '',
      payment_method: 'iban',
      iban: 'ES12 3456 7891 2345 6789 1234',
      sepa_accepted: true,
      legal_person_accepted: true
    },
    normalizedData: {
      vat: 'U12345678',
      name: 'Mugiwara SL',
      surname: '',
      is_juridic: 'legal-person',
      proxy_name: 'Luffy',
      proxy_vat: '12345678P',
      email: 'mugiwara@example.coop',
      phone: '+34612345679',
      lang: 'es_ES',
      gender: '',
      birthdate: '',
      referral_source: '',
      legal_person_accepted: true
    }
  }
}
