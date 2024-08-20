import { normalizeHolderChange } from './utils'

describe('Normalize holderChange function for all member options', () => {
  const baseCase = {
    // holder is member
    holder: {
      vat: '12345678P',
      vatvalid: true,
      isphisical: true,
      proxynif_valid: false,
      proxynif_phisical: true,
      state: {
        id: 20,
        name: 'Girona'
      },
      city: {
        id: 5386,
        name: 'Girona'
      },
      proxynif: '',
      proxyname: '',
      name: 'Alice',
      address: 'Wonderland',
      number: '4/1',
      floor: '',
      door: '',
      postal_code: '17004',
      surname1: 'Liddell',
      surname2: '',
      email: 'alice@wonderland.in',
      email2: 'alice@wonderland.in',
      phone1: '666666666',
      phone2: '',
      language: 'ca_ES',
      ismember: true // overwritten in tests
    },
    supply_point: {
      cups: 'ES00I00AM00A00CUPS0F',
      status: 'active',
      address: 'Wonderland nº 4/1',
      verified: true,
      supply_point_accepted: true,
      tariff_type: 'atr'
    },
    member: {},
    payment: {
      iban: 'ES00 000I 00AM 00AN IBAN 1234',
      sepa_accepted: true,
      voluntary_cent: false,
      iban_valid: true
    },
    especial_cases: {
      reason_default: true,
      reason_death: false,
      reason_merge: false,
      reason_electrodep: false,
      attachments: {}
    },
    privacy_policy_accepted: true,
    terms_accepted: true,
    legal_person_accepted: false
  }

  const noMemberInfo = {
    become_member: '',
    link_member: '',
    invite_token: false,
    checked: false
  }

  const becomeMember = {
    // wants to become member
    become_member: true,
    link_member: '',
    invite_token: false,
    checked: false
  }

  const linkMember = {
    become_member: false,
    invite_token: false,
    // wants to link a member
    link_member: true,
    checked: true,
    number: 'S000YES',
    vat: 'ES1234444V'
  }

  test('when the holder is already a member', () => {
    baseCase.holder.ismember = true
    baseCase.member = noMemberInfo
    expect(normalizeHolderChange(baseCase)).toStrictEqual({
      especial_cases: {
        reason_death: false,
        reason_electrodep: false,
        reason_merge: false
      },
      holder: {
        address: 'Wonderland, 4/1',
        city: 5386,
        email: 'alice@wonderland.in',
        email2: 'alice@wonderland.in',
        language: 'ca_ES',
        name: 'Alice',
        phone1: '666666666',
        postal_code: '17004',
        state: 20,
        surname1: 'Liddell',
        surname2: '',
        vat: '12345678P'
        // should we add the ismember?
      },
      member: {
        become_member: false,
        invite_token: false,
        link_member: false
      },
      payment: {
        iban: 'ES00000I00AM00ANIBAN1234',
        sepa_accepted: true,
        voluntary_cent: false
      },
      privacy_policy_accepted: true,
      supply_point: {
        address: 'Wonderland nº 4/1',
        cups: 'ES00I00AM00A00CUPS0F',
        tariff_type: 'atr'
      },
      terms_accepted: true
    })
  })

  test('when the holder wants to become member', () => {
    baseCase.holder.ismember = false
    baseCase.member = becomeMember
    expect(normalizeHolderChange(baseCase)).toStrictEqual({
      especial_cases: {
        reason_death: false,
        reason_electrodep: false,
        reason_merge: false
      },
      holder: {
        address: 'Wonderland, 4/1',
        city: 5386,
        email: 'alice@wonderland.in',
        email2: 'alice@wonderland.in',
        language: 'ca_ES',
        name: 'Alice',
        phone1: '666666666',
        postal_code: '17004',
        state: 20,
        surname1: 'Liddell',
        surname2: '',
        vat: '12345678P'
        // should we add the ismember?
      },
      member: {
        become_member: true,
        invite_token: false,
        link_member: '' // TODO: what?
      },
      payment: {
        iban: 'ES00000I00AM00ANIBAN1234',
        sepa_accepted: true,
        voluntary_cent: false
      },
      privacy_policy_accepted: true,
      supply_point: {
        address: 'Wonderland nº 4/1',
        cups: 'ES00I00AM00A00CUPS0F',
        tariff_type: 'atr'
      },
      terms_accepted: true
    })
  })

  test('when the holder wants to link a member', () => {
    baseCase.holder.ismember = false
    baseCase.member = linkMember
    expect(normalizeHolderChange(baseCase)).toStrictEqual({
      especial_cases: {
        reason_death: false,
        reason_electrodep: false,
        reason_merge: false
      },
      holder: {
        address: 'Wonderland, 4/1',
        city: 5386,
        email: 'alice@wonderland.in',
        email2: 'alice@wonderland.in',
        language: 'ca_ES',
        name: 'Alice',
        phone1: '666666666',
        postal_code: '17004',
        state: 20,
        surname1: 'Liddell',
        surname2: '',
        vat: '12345678P'
        // should we add the ismember?
      },
      member: {
        become_member: false,
        invite_token: false,
        link_member: true,
        number: 'S000YES',
        vat: 'ES1234444V'
      },
      payment: {
        iban: 'ES00000I00AM00ANIBAN1234',
        sepa_accepted: true,
        voluntary_cent: false
      },
      privacy_policy_accepted: true,
      supply_point: {
        address: 'Wonderland nº 4/1',
        cups: 'ES00I00AM00A00CUPS0F',
        tariff_type: 'atr'
      },
      terms_accepted: true
    })
  })

  test('when the holder says "nah!"', () => {
    baseCase.holder.ismember = false
    baseCase.member = noMemberInfo
    expect(normalizeHolderChange(baseCase)).toStrictEqual({
      especial_cases: {
        reason_death: false,
        reason_electrodep: false,
        reason_merge: false
      },
      holder: {
        address: 'Wonderland, 4/1',
        city: 5386,
        email: 'alice@wonderland.in',
        email2: 'alice@wonderland.in',
        language: 'ca_ES',
        name: 'Alice',
        phone1: '666666666',
        postal_code: '17004',
        state: 20,
        surname1: 'Liddell',
        surname2: '',
        vat: '12345678P'
        // should we add the ismember?
      },
      member: {
        become_member: '',
        invite_token: false,
        link_member: ''
      },
      payment: {
        iban: 'ES00000I00AM00ANIBAN1234',
        sepa_accepted: true,
        voluntary_cent: false
      },
      privacy_policy_accepted: true,
      supply_point: {
        address: 'Wonderland nº 4/1',
        cups: 'ES00I00AM00A00CUPS0F',
        tariff_type: 'atr'
      },
      terms_accepted: true
    })
  })
})
