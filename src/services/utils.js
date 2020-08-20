const THOUSANDS_CONVERSION_FACTOR = 1000

export const CNAE_HOUSING = '9820'

export const languages = {
  es_ES: 'Español',
  ca_ES: 'Català'
}

export const normalizeModifyData = (params) => {
  const { modify, contact, token } = params

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
    contact_phone: contact?.phone,
    token: token
  }

  Object.keys(data).forEach(
    (key) => (data[key] == null || data[key] === '') && delete data[key]
  )

  return data
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

  if (normalContract?.payment?.iban) {
    normalContract.payment.iban = normalContract.payment.iban.split(' ').join('')
  }

  if (normalContract?.payment?.iban_valid !== undefined) {
    delete normalContract?.payment?.iban_valid
  }

  return normalContract
}


export const normalizeContract = (contract) => {

  const finalContract = {}
  const normalContract = JSON.parse(JSON.stringify(contract))
  const holder = normalContract.holder.vat === normalContract.member.vat ? normalContract.member : normalContract.holder

  if (normalContract?.holder?.previous_holder) {
    finalContract.canvi_titular = '0'
  }
  else {
    finalContract.canvi_titular = '1'
  }

  finalContract.cnae = normalContract?.supply_point?.cnae

  finalContract.compte_adreca = ''
  finalContract.compte_cognom = ''
  finalContract.compte_cp = ''
  finalContract.compte_dni = ''
  finalContract.compte_email = ''
  finalContract.compte_lang = ''
  finalContract.compte_municipi = ''
  finalContract.compte_nom = ''
  finalContract.compte_provincia = ''
  finalContract.compte_representant_dni = ''
  finalContract.compte_representant_nom = ''
  finalContract.compte_tel = ''
  finalContract.compte_tel2 = ''
  finalContract.compte_tipus_persona = '0'

  finalContract.condicions = normalContract?.payment?.sepa_accepted
  finalContract.condicions_privacitat = normalContract?.privacy_policy_accepted
  finalContract.condicions_titular = normalContract?.terms_accepted
  finalContract.consum = ''
  
  finalContract.cups = normalContract?.supply_point?.cups
  finalContract.cups_adreca = normalContract?.supply_point?.address
  finalContract.cups_municipi = normalContract?.supply_point?.city?.id
  finalContract.cups_provincia = normalContract?.supply_point?.state?.id
  
  finalContract.dni = holder?.vat
  finalContract.donatiu = normalContract?.payment?.voluntary_cent
  finalContract.escull_pagador = 'titular'
  finalContract.id_soci = normalContract?.member?.number
  finalContract.payment_iban = normalContract?.payment?.iban
  finalContract.potencia = normalContract?.contract?.power
  finalContract.potencia_p2 = normalContract?.contract?.power2
  finalContract.potencia_p3 = normalContract?.contract?.power3
  
  if (!normalContract?.supply_point?.has_service) {
    finalContract.proces = 'A3'
  }
  else if(normalContract?.holder?.previous_holder) {
    finalContract.proces = 'C1'
  }
  else {
    finalContract.proces = 'C2'
  }

  finalContract.referencia = ''
  finalContract.representant_dni = holder?.proxynif
  finalContract.representant_nom = holder?.proxyname

  finalContract.soci_titular = normalContract.holder.vat === normalContract.member.vat ? '1' : '0'

  finalContract.tarifa = normalContract?.contract?.rate
  finalContract.tipus_persona = normalContract?.holder?.isphisical ? '0' : '1'
  finalContract.titular_adreca = holder?.address
  finalContract.titular_cognom = `${holder?.surname1} ${holder?.surname2}`
  finalContract.titular_cp = holder?.postal_code
  finalContract.titular_dni = holder?.vat
  finalContract.titular_email = holder?.email
  finalContract.titular_lang = holder?.language
  finalContract.titular_municipi = holder?.city?.id
  finalContract.titular_nom = holder?.name
  finalContract.titular_provincia = holder?.state?.id
  finalContract.titular_tel = holder?.phone1
  finalContract.titular_tel2 = holder?.phone2

  return finalContract
}

export const specialCaseType = (specialCases) => {
  if (specialCases.reason_death) return 'SPECIAL_CASES_DEATH'
  else if (specialCases.reason_merge) return 'SPECIAL_CASES_MERGE'
  else if (specialCases.reason_electrodep) return 'SPECIAL_CASES_ELECTRODEP'
  else return ''
}
