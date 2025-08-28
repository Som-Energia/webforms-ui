export const normalizeAddress = (address) => {
  return {
    state_id: parseInt(address.state.id),
    city_id: parseInt(address.city.id),
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
    is_juridic: client.person_type == 'physic-person' ? false : true,
    email: client.email,
    phone: `${client.phone_code} ${client.phone}`,
    lang: client.language
  }
  if (data.is_juridic) {
    data['proxy_name'] = client.proxyname
    data['proxy_vat'] = client.proxynif
    data['legal_person_accepted'] = client.legal_person_accepted
  } else {
    data['surname'] = `${client.surname1} ${client.surname2}`.trim()
  }
  if (client.gender) {
    data['gender'] = client.gender
  }
  if (client.birthdate) {
    data['birthdate'] = client.birthdate.toISOString().split('T')[0]
  }
  if (client.referral_source) {
    data['referral_source'] = client.referral_source
  }
  return data
}

export const normalizeSelfconsumption = (selfconsumption) => {
  let data = {
    cau: selfconsumption.cau,
    collective_installation:
      selfconsumption.collective_installation == 'collective' ? true : false,
    installation_power: (+selfconsumption.installation_power * 1000).toString(),
    installation_type: selfconsumption.installation_type,
    aux_services:
      selfconsumption.aux_services == 'auxiliary-service-yes' ? true : false,
    technology: selfconsumption.technology
  }
  return data
}

export const contractProcess = (has_light, same_holder) => {
  if (!has_light) {
    return 'A3'
  } else if (same_holder) {
    return 'C1'
  } else {
    return 'C2'
  }
}

export const normalizeAttachments = (supply_point_attachment, process) => {
  let data = {
    filename: supply_point_attachment,
    category: process == 'A3' ? "new_contract" : "invoice"
  }
  return data
}

export const newNormalizeContract = (data) => {
  const powers = []
  const powers_max = data.contract.power_type == 'power-lower-15kw' ? 2 : 6
  for (var i = 1; i <= powers_max; i++) {
    powers.push(data.contract.power[`power${i}`])
  }
  const process = contractProcess(
        data.has_light == 'light-on',
        data.previous_holder == 'previous-holder-yes'
      )
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
      powers: powers.map((power) => (+power * 1000).toString()),
      cups_address: normalizeAddress(data.supply_point_address),
      cnae: data.supply_point.cnae.toString(),
      process: process
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
      data.cadastral_reference.replace(/\s/g, '')
  }

  if (data.member_is_holder != 'holder-member-yes' && data.member.link_member) {
    finalContract['contract_owner'] = normalizeClient(data.new_member) // TODO: change where this is saved! (new_member warning)
    finalContract['contract_owner']['address'] = normalizeAddress(data.address)
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

  if (data.has_light === 'light-off'){
    finalContract['contract_info']['phase'] = data.contract.phase === 'mono' ? '230':'3x230/400'
  }

  if (data.comercial_info_accepted) {
    finalContract['comercial_info_accepted'] = data.comercial_info_accepted
  }

  if (data.supply_point.attachments && data.supply_point.attachments.length > 0) {
    // TODO: selfconsumption attachments must be inside attachment!!
    finalContract['attachments'] = []
    data.supply_point.attachments.forEach(attachment => {
      finalContract['attachments'].push(normalizeAttachments(
        attachment['filehash'], process
      ))
    })
  }
  return finalContract
}
