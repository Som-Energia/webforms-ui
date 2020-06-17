const THOUSANDS_CONVERSION_FACTOR = 1000

export const languages = {
  es: 'Español',
  ca: 'Català'
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
  const normalContract = Object.assign({}, contract)

  if (normalContract?.supply_point?.verified) {
    delete normalContract.supply_point.verified
  }
  if (normalContract?.supply_point?.status) {
    delete normalContract.supply_point.status
  }
  if (normalContract?.holder?.language?.code) {
    normalContract.holder.language = normalContract.holder.language.code
  }
  if (normalContract?.holder?.state?.id) {
    normalContract.holder.state = normalContract.holder.state.id
  }
  if (normalContract?.holder?.city?.id) {
    normalContract.holder.city = normalContract.holder.city.id
  }
  if (normalContract?.holder?.vatexists) {
    delete normalContract.holder.vatexists
  }
  if (normalContract?.holder?.vatvalid) {
    delete normalContract.holder.vatvalid
  }
  if (normalContract?.holder?.phone2 === '') {
    delete normalContract.holder.phone2
  }
  if (normalContract?.holder?.proxynif_valid) {
    delete normalContract.holder.proxynif_valid
  }
  if (normalContract?.member.become_member === undefined) {
    normalContract.member.is_member = true
    normalContract.member.become_member = false
  }
  if (normalContract.payment.iban) {
    normalContract.payment.iban = normalContract.payment.iban.split(' ').join('')
  }
  return normalContract
}

export const specialCaseType = (specialCases) => {
  if (specialCases.reason_death) return 'SPECIAL_CASES_DEATH'
  else if (specialCases.reason_merge) return 'SPECIAL_CASES_MERGE'
  else if (specialCases.reason_electrodep) return 'SPECIAL_CASES_ELECTRODEP'
  else return ''
}
