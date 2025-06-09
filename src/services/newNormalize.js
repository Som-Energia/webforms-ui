export const normalizeAddress = (address) => {
  return {
    state_id: address.state.id,
    city_id: address.city.id,
    postal_code: address.postal_code,
    street: address.street,
    number: address.number,
    floor: address.floor,
    stair: address.stairs,
    door: address.door,
    block: address.bloc
  }
}

export const normalizeClient = (client) => {
  let data = {
    vat: client.nif,
    name: client.name,
    surname: `${client.surname1} ${client.surname2}`.trim(),
    is_juridic: client.person_type,
    proxy_name: client.proxyname,
    proxy_vat: client.proxynif,
    email: client.email,
    phone: `${client.phone_code}${client.phone}`,
    lang: client.language,
    gender: client.gender,
    birthdate: client.birthdate,
    referral_source: client.referral_source
  }
  if (client.person_type == 'legal-person') {
    data['legal_person_accepted'] = client.legal_person_accepted
  }
  return data
}

export const normalizeSelfconsumption = (selfconsumption) => {
  let data = {
    cau: selfconsumption.cau,
    collective_installation:
      selfconsumption.collective_installation == 'collective' ? true : false,
    installation_power: selfconsumption.installation_power,
    installation_type: selfconsumption.installation_type,
    aux_services:
      selfconsumption.aux_services == 'auxiliary-service-yes' ? true : false,
    technology: selfconsumption.technology,
    attachments: [] // TODO: check this !!!!
  }
  return data
}

// TODO: test this and move to utils
const contractProcess = (has_light, same_holder) => {
  if (!has_light) {
    return 'A3'
  } else if (same_holder) {
    return 'C1'
  } else {
    return 'C2'
  }
}

// TODO: test this
export const newNormalizeContract = (data) => {
  const finalContract = {
    linked_member: data.member.link_member
      ? data.member_is_holder == 'holder-member-yes'
        ? 'already_member'
        : 'sponsored'
      : 'new_member',
    contract_info: {
      cups: data.cups,
      tariff:
        data.contract.power_type == 'power-lower-15kw' ? '2.0TD' : '3.0TD',
      is_indexed: data.contract.tariff_mode == 'indexed',
      powers: Object.values(data.contract.power),
      cups_address: normalizeAddress(data.supply_point_address),
      cnae: data.supply_point.cnae.toString(),
      process: contractProcess(
        data.has_light == 'light-on',
        data.previous_holder == 'previous-holder-yes'
      )
    },
    iban: data.new_member.iban, // TODO: new_member warning!
    sepa_accepted: data.new_member.sepa_accepted, // TODO: new_member warning!
    member_payment_type:
      data.new_member.payment_method == 'credit_card' ? 'tpv' : 'remesa', // TODO: new_member warning!
    donation: data.voluntary_donation,
    privacy_conditions: data.privacy_policy_accepted,
    general_contract_terms_accepted: data.generic_conditions_accepted,
    statutes_accepted: data.statutes_accepted
  }

  if (data.has_selfconsumption == 'selfconsumption-on') {
    finalContract['self_consumption'] = normalizeSelfconsumption(
      data.self_consumption
    )
  }

  if (data.cadastral_reference) {
    finalContract['contract_info']['cups_cadastral_reference'] =
      data.cadastral_reference
  }

  if (data.member_is_holder != 'holder-member-yes') {
    finalContract['contract_owner'] = normalizeClient(data.new_member) // TODO: change where this is saved! (new_member warning)
    finalContract['contract_owner']['address'] = normalizeAddress(
      data.supply_point_address
    )
  }

  if (data.member.link_member) {
    finalContract['linked_member_info'] = {
      vat: data.member.nif,
      code: data.member.number
    }
  } else {
    finalContract['new_member_info'] = normalizeClient(data.new_member)
    finalContract['new_member_info']['address'] = normalizeAddress(data.address)
  }

  if (data.comercial_info_accepted) {
    finalContract['comercial_info_accepted'] = data.comercial_info_accepted
  }

  // TODO: check attachments!!!!

  return finalContract
}
