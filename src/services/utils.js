export const THOUSANDS_CONVERSION_FACTOR = 1000

export const CNAE_HOUSING = '9820'
export const PAYMENT_METHOD_PAYMENT_ORDER = 'remesa'
export const PAYMENT_METHOD_CREDIT_CARD = 'tpv'
export const USER_TYPE_PERSON = 'fisica'
export const USER_TYPE_COMPANY = 'juridica'

export const languages = {
  es_ES: 'Español',
  ca_ES: 'Català'
}

const sanitizeData = (data) => {
  Object.keys(data).forEach(
    (key) => (data[key] == null || data[key] === '') && delete data[key]
  )
  return data
}

const normalizeCommonModifyData = (params) => {
  const { modify, contact } = params

  const data = {
    tarifa: modify?.tariff,
    tensio: modify?.phases,
    attachments: [...modify?.attachments, ...modify?.power_attachments],
    potencia: modify?.changePower ? Math.round(modify?.power * THOUSANDS_CONVERSION_FACTOR) : undefined,
    potencia_p2: modify?.changePower && modify?.moreThan15Kw ? Math.round(modify?.power2 * THOUSANDS_CONVERSION_FACTOR) : undefined,
    potencia_p3: modify?.changePower && modify?.moreThan15Kw ? Math.round(modify?.power3 * THOUSANDS_CONVERSION_FACTOR) : undefined,
    discriminacio: modify?.fare,
    contact_name: contact?.contactName,
    contact_surname: contact?.contactSurname,
    contact_phone: contact?.phone
  }

  return data
}

export const normalizeModifyData = (params) => {
  const { token } = params

  const data = { ...normalizeCommonModifyData(params), token: token }
  return sanitizeData(data)
}

export const normalizeD1ConfirmationData = (values) => {
  let contractModification = null
  if (values?.modify) {
    contractModification = sanitizeData(normalizeCommonModifyData(values))
  }

  const data = {
    confirm: values?.validate,
    attachments: values?.d1Attachments,
    refuse_reason: values?.refuseReason,
    contract_modification: values?.modify ? contractModification : null
  }

  console.log('NORMALIZE D1 CONFIRMATION DATA', sanitizeData(data))
  return sanitizeData(data)
}

export const checkPhisicalVAT = (vat) => {
  if (vat === undefined) return undefined
  var firstchar = vat[0]
  return '0123456789KLMXYZ'.indexOf(firstchar) !== -1
}

export const normalizeHolderChange = (contract) => {
  const normalContract = JSON.parse(JSON.stringify(contract))

  if (normalContract?.supply_point?.verified !== undefined) {
    delete normalContract.supply_point.verified
  }

  if (normalContract?.supply_point?.supply_point_accepted !== undefined) {
    delete normalContract.supply_point.supply_point_accepted
  }

  if (normalContract?.supply_point?.status !== undefined) {
    delete normalContract.supply_point.status
  }

  if (normalContract?.holder?.language?.code !== undefined) {
    normalContract.holder.language = normalContract.holder.language.code
  }

  if (normalContract?.holder?.state?.id !== undefined) {
    normalContract.holder.state = parseInt(normalContract.holder.state.id)
  }

  if (normalContract?.holder?.city?.id !== undefined) {
    normalContract.holder.city = parseInt(normalContract.holder.city.id)
  }

  if (normalContract?.holder?.vatexists !== undefined) {
    delete normalContract.holder.vatexists
  }

  if (normalContract?.holder?.vatvalid !== undefined) {
    delete normalContract.holder.vatvalid
  }

  if (normalContract?.holder?.isphisical !== undefined) {
    if (normalContract?.holder?.isphisical === true) {
      delete normalContract.holder.proxynif
      delete normalContract.holder.proxyname
    } else {
      delete normalContract.holder.surname1
      delete normalContract.holder.surname2
    }
    delete normalContract.holder.isphisical
    delete normalContract.holder.proxynif_phisical
  }

  if (normalContract?.holder?.phone2 === '') {
    delete normalContract.holder.phone2
  }

  if (normalContract?.holder?.proxynif_valid !== undefined) {
    delete normalContract.holder.proxynif_valid
  }

  if (normalContract?.member?.become_member === undefined ||
    normalContract?.member?.become_member === '') {
    if (normalContract?.member === undefined) {
      normalContract.member = {}
    }
    normalContract.member.is_member = true
    normalContract.member.become_member = false
  } else {
    normalContract.member.is_member = false
  }

  if (normalContract?.legal_person_accepted !== undefined) {
    delete normalContract.legal_person_accepted
  }

  if (normalContract?.payment?.iban) {
    normalContract.payment.iban = normalContract.payment.iban.split(' ').join('')
  }

  if (normalContract?.payment?.iban_valid !== undefined) {
    delete normalContract.payment.iban_valid
  }

  if (normalContract?.especial_cases && normalContract?.especial_cases?.attachments) {
    const hasSpecialCases = Object.keys(normalContract.especial_cases)
      .map(prop => prop.indexOf('reason') === 0 && normalContract.especial_cases[prop] === true)
      .reduce((prev, current) => !prev ? current : prev)

    if (!hasSpecialCases) {
      delete normalContract.especial_cases.attachments
    } else {
      if (normalContract?.especial_cases?.attachments?.death) {
        normalContract.especial_cases.attachments.death = normalContract?.especial_cases?.attachments?.death[0]
      }

      if (normalContract?.especial_cases?.attachments?.medical) {
        normalContract.especial_cases.attachments.medical = normalContract?.especial_cases?.attachments?.medical[0]
      }

      if (normalContract?.especial_cases?.attachments?.resident) {
        normalContract.especial_cases.attachments.resident = normalContract?.especial_cases?.attachments?.resident[0]
      }
    }
  }
  return normalContract
}

export const normalizeContract = (contract) => {
  const finalContract = {}

  const holder = (contract.holder.vat === contract.member.vat &&
    contract.holder.isphisical === true) ? contract.member : contract.holder

  finalContract.member_number = contract?.member?.number
  finalContract.member_vat = contract?.member?.vat
  finalContract.cups = contract?.supply_point?.cups
  finalContract.tariff = contract?.contract?.rate
  finalContract.power = Math.round(contract?.contract?.power * THOUSANDS_CONVERSION_FACTOR)
  finalContract.power_p2 = Math.round(contract?.contract?.power2 * THOUSANDS_CONVERSION_FACTOR)
  finalContract.cups_address = `${contract?.supply_point?.address}, ${contract?.supply_point?.number} ${contract?.supply_point?.floor} ${contract?.supply_point?.door}`.trim()
  finalContract.city_id = contract?.supply_point?.city?.id
  finalContract.cups_state_id = contract?.supply_point?.state?.id
  finalContract.cnae = contract?.supply_point?.cnae
  finalContract.owner_person_type = contract?.holder?.isphisical ? 'phisical' : 'juridic'
  finalContract.owner_vat = holder?.vat
  finalContract.owner_name = holder?.name
  finalContract.owner_surname1 = `${holder?.surname1} ${holder?.surname2}`
  finalContract.owner_proxy_vat = !contract?.holder?.isphisical ? holder?.proxynif : undefined
  finalContract.owner_proxy_name = !contract?.holder?.isphisical ? holder?.proxyname : undefined
  finalContract.owner_address = holder?.address
  finalContract.owner_city_id = holder?.city?.id
  finalContract.owner_state_id = holder?.state?.id
  finalContract.owner_postal_code = holder?.postal_code
  finalContract.owner_email = holder?.email
  finalContract.owner_phone = holder?.phone1
  finalContract.owner_lang = holder?.language
  finalContract.owner_is_payer = true

  finalContract.payer_person_type = finalContract.owner_person_type
  finalContract.payer_name = finalContract.owner_name
  finalContract.payer_surname1 = finalContract.owner_surname1
  finalContract.payer_vat = finalContract.owner_vat
  finalContract.payer_address = finalContract.owner_address
  finalContract.payer_city_id = finalContract.owner_city_id
  finalContract.payer_state_id = finalContract.owner_state_id
  finalContract.payer_postal_code = finalContract.owner_postal_code
  finalContract.payer_email = finalContract.owner_email
  finalContract.payer_phone = finalContract.owner_phone
  finalContract.payer_lang = finalContract.owner_lang

  finalContract.payment_iban = contract?.payment?.iban
  finalContract.sepa_conditions = contract?.payment?.sepa_accepted
  finalContract.donation = contract?.payment?.voluntary_cent

  finalContract.process = !contract?.contract?.has_service
    ? contract?.holder?.previous_holder ? 'C1' : 'C2'
    : 'A3'

  finalContract.privacy_conditions = contract?.privacy_policy_accepted
  finalContract.contract_conditions = contract?.terms_accepted

  Object.keys(finalContract).forEach(key => finalContract[key] === undefined && delete finalContract[key])

  return finalContract
}

export const normalizeMember = (data) => {
  const finalMember = {}

  finalMember.tipuspersona = data.member.isphisical ? USER_TYPE_PERSON : USER_TYPE_COMPANY
  finalMember.nom = data.member.name
  finalMember.dni = data.member.vat
  finalMember.tel = data.member.phone1
  finalMember.tel2 = data.member.phone2 || ''
  finalMember.email = data.member.email
  finalMember.cp = data.member.postal_code
  finalMember.provincia = data.member.state.id
  finalMember.adreca = data.member.address
  finalMember.municipi = data.member.city.id
  finalMember.idioma = data.member.language

  finalMember.payment_method =
    data.payment.payment_method === 'iban' ? PAYMENT_METHOD_PAYMENT_ORDER : (
      data.payment.payment_method === 'credit_card' ? PAYMENT_METHOD_CREDIT_CARD
        : PAYMENT_METHOD_PAYMENT_ORDER
    )

  finalMember.payment_iban = data.payment.iban
  finalMember.urlok = data.urlok
  finalMember.urlko = data.urlko

  if (data.member.isphisical) {
    const cognoms = `${data.member.surname1} ${data.member.surname2}`
    finalMember.cognom = cognoms.trim()
  } else {
    finalMember.representant_nom = data.member.proxyname
    finalMember.representant_dni = data.member.proxynif
  }

  return finalMember
}

export const specialCaseType = (specialCases) => {
  if (specialCases.reason_death) return 'SPECIAL_CASES_DEATH'
  else if (specialCases.reason_merge) return 'SPECIAL_CASES_MERGE'
  else if (specialCases.reason_electrodep) return 'SPECIAL_CASES_ELECTRODEP'
  else return ''
}

export const calculateTariff = ({ changePower = true, power, moreThan15Kw, changeFare = true, fare }) => {
  return (moreThan15Kw) ? '3.0TD' : '2.0TD'
}
