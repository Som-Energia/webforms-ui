export const random_cups = 'ES0031405905577001DH0F'
export const random_number = '12345'
export const random_nif = '12345678P'
export const random_iban = 'ES12 3456 7891 2345 6789 1234'

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
      id: "20",
      name: 'Girona'
    },
    city: {
      id: "5386",
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
  },
  empty: {
    street: '',
    number: '',
    floor: '',
    door: '',
    stairs: '',
    bloc: '',
    postal_code: ''
  }
}

export const selfconsumption = {
  entryValues: {
    cau: 'EU12341234435THISISACAU',
    cau_error: false,
    collective_installation: 'individual',
    installation_type: '01',
    technology: 'b11',
    aux_services: 'auxiliary-service-yes',
    installation_power: '5'
  },
  normalizedData: {
    cau: 'EU12341234435THISISACAU',
    collective_installation: false,
    installation_power: '5',
    installation_type: '01',
    aux_services: true,
    technology: 'b11'
    // attachments: [] // TODO: check this
  },
  empty: {
    cau_error: false,
    installation_type: '',
    technology: 'b11',
    installation_power: ''
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
      birthdate: new Date('1997-05-05T07:14:08.925Z'),
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
      is_juridic: false,
      email: 'luffy@example.coop',
      phone: '+34 612345678',
      lang: 'ca_ES',
      gender: 'male',
      birthdate: '1997-05-05'
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
      is_juridic: true,
      proxy_name: 'Luffy',
      proxy_vat: '12345678P',
      email: 'mugiwara@example.coop',
      phone: '+34 612345679',
      lang: 'es_ES',
      legal_person_accepted: true
    }
  },
  empty: {
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
    legal_person_accepted: false
  }
}

export const iban_values = {
  iban: random_iban,
  iban_valid: true,
  sepa_accepted: true
}

export const supply_point = {
  with_attachments: {
    entryValues: {
      cnae: 9820,
      supply_point_accepted: true,
      is_housing: true,
      cnae_valid: true,
      attachment: 'road_poneglyph.jpg'
    }
  },
  without_attachments: {
    entryValues: {
      cnae: 9820,
      supply_point_accepted: true,
      is_housing: true,
      cnae_valid: true,
    }
  }
}

export const supply_point_attachments = {
  new_contract: {
    entryValues: {
      filename: 'road poneglyph',
      process: 'A3'
    },
    normalizedData: [{
      filename: 'road poneglyph',
      category: 'new_contract'
    }]
  },
  invoice: {
    entryValues: {
      filename: 'road poneglyph',
      process: 'C1'
    },
    normalizedData: [{
      filename: 'road poneglyph',
      category: 'invoice'
    }]
  }
}
