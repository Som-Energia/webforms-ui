import { getMunicipisByPostalCode, getRates, getNewRates } from '../services/api'
import dayjs from 'dayjs'
import isoWeek from "dayjs/plugin/isoWeek";
import { stdnum } from 'stdnum';
import { electronicFormatIBAN, isValidIBAN } from 'ibantools'

export const THOUSANDS_CONVERSION_FACTOR = 1000

export const CNAE_HOUSING = '9820'
export const PAYMENT_METHOD_PAYMENT_ORDER = 'remesa'
export const PAYMENT_METHOD_CREDIT_CARD = 'tpv'
export const USER_TYPE_PERSON = 'fisica'
export const USER_TYPE_COMPANY = 'juridica'

export const NEW_MEMBER_CONTRIB_AMOUNT = 100

export const languages = {
  es_ES: 'Español',
  ca_ES: 'Català'
}

export const contributionParams = {
  generationMinAnnualUse:1,
  generationMinNumActions:1,
  generationMaxNumActions:49,
  minContribution: 100,
  maxContribution: 100000,
  contributionStep: 100,
  maxPercentOverAnnualUse: 100
}

const sanitizeData = (data) => {
  Object.keys(data).forEach(
    (key) =>
      (data[key] == null ||
        data[key] === '' ||
        (Array.isArray(data[key]) && !data[key].length)) &&
      delete data[key]
  )
  return data
}

const normalizeCommonModifyData = (params) => {
  const { modify, contact } = params

  const data = {
    phase: modify?.phases,
    attachments: [...(modify?.attachments??[]), ...(modify?.power_attachments??[])],
    power_p1: modify?.changePower
      ? Math.round(modify?.power * THOUSANDS_CONVERSION_FACTOR)
      : undefined,
    power_p2: modify?.changePower
      ? Math.round(modify?.power2 * THOUSANDS_CONVERSION_FACTOR)
      : undefined,
    power_p3:
      modify?.changePower && modify?.moreThan15Kw
        ? Math.round(modify?.power3 * THOUSANDS_CONVERSION_FACTOR)
        : undefined,
    power_p4:
      modify?.changePower && modify?.moreThan15Kw
        ? Math.round(modify?.power4 * THOUSANDS_CONVERSION_FACTOR)
        : undefined,
    power_p5:
      modify?.changePower && modify?.moreThan15Kw
        ? Math.round(modify?.power5 * THOUSANDS_CONVERSION_FACTOR)
        : undefined,
    power_p6:
      modify?.changePower && modify?.moreThan15Kw
        ? Math.round(modify?.power6 * THOUSANDS_CONVERSION_FACTOR)
        : undefined,
    tariff: modify?.changePower ? modify?.tariff : undefined,
    contact_name: contact?.contactName,
    contact_surname: contact?.contactSurname,
    contact_phone: contact?.phone
  }

  return data
}

export const normalizeModifyData = (params) => {
  const data = { ...normalizeCommonModifyData(params) }
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

  normalContract.holder.address =
    `${normalContract.holder?.address}, ${normalContract.holder?.number} ${normalContract.holder?.floor} ${normalContract.holder?.door}`.trim()

  normalContract.holder?.number !== undefined &&
    delete normalContract.holder?.number

  normalContract.holder?.floor !== undefined &&
    delete normalContract.holder?.floor

  normalContract.holder?.door !== undefined &&
    delete normalContract.holder?.door

  if (normalContract?.holder?.phone2 === '') {
    delete normalContract.holder.phone2
  }

  if (normalContract?.holder?.proxynif_valid !== undefined) {
    delete normalContract.holder.proxynif_valid
  }

  // delete member fields
  if ('name' in normalContract?.member) {
    delete normalContract?.member?.name
    delete normalContract?.member?.address
    delete normalContract?.member?.postal_code
    delete normalContract?.member?.state
    delete normalContract?.member?.city
    delete normalContract?.member?.surname1
    delete normalContract?.member?.email
    delete normalContract?.member?.phone1
    delete normalContract?.member?.phone2
    delete normalContract?.member?.language
    delete normalContract?.member?.checked
    delete normalContract?.member?.full_name
  }

  if (normalContract?.holder?.ismember) {
    normalContract.member.become_member = false
    normalContract.member.link_member = false
  }
  else if (isHomeOwnerCommunityNif(normalContract?.holder?.vat)) {
    normalContract.member.become_member = false
    normalContract.member.link_member = true
  }
  'ismember' in normalContract?.holder && delete normalContract.holder.ismember

  if (!normalContract?.member?.link_member) {
    'vat' in normalContract?.member && delete normalContract.member.vat
    'number' in normalContract?.member && delete normalContract.member.number
  }

  if (normalContract?.member?.checked !== undefined) {
    delete normalContract?.member?.checked
  }

  if (normalContract?.legal_person_accepted !== undefined) {
    delete normalContract.legal_person_accepted
  }

  if (normalContract?.payment?.iban) {
    normalContract.payment.iban = normalContract.payment.iban
      .split(' ')
      .join('')
  }

  if (normalContract?.payment?.iban_valid !== undefined) {
    delete normalContract.payment.iban_valid
  }

  if (
    normalContract?.especial_cases &&
    normalContract?.especial_cases?.attachments
  ) {
    delete normalContract.especial_cases.reason_default
    const hasSpecialCases = Object.keys(normalContract.especial_cases)
      .map(
        (prop) =>
          prop.indexOf('reason') === 0 &&
          normalContract.especial_cases[prop] === true
      )
      .reduce((prev, current) => (!prev ? current : prev))

    if (!hasSpecialCases) {
      delete normalContract.especial_cases.attachments
    } else {
      if (normalContract?.especial_cases?.attachments?.death) {
        normalContract.especial_cases.attachments.death =
          normalContract?.especial_cases?.attachments?.death[0]
      }

      if (normalContract?.especial_cases?.attachments?.medical) {
        normalContract.especial_cases.attachments.medical =
          normalContract?.especial_cases?.attachments?.medical[0]
      }

      if (normalContract?.especial_cases?.attachments?.resident) {
        normalContract.especial_cases.attachments.resident =
          normalContract?.especial_cases?.attachments?.resident[0]
      }

      if (normalContract?.especial_cases?.attachments?.merge) {
        normalContract.especial_cases.attachments.merge =
          normalContract?.especial_cases?.attachments?.merge[0]
      }
    }
  }
  return normalContract
}

export const normalizeContract = (contract) => {
  const finalContract = {}

  const holder = contract.holder

  finalContract.member_number = contract?.member?.number
  finalContract.member_vat = contract?.member?.vat
  finalContract.cups = contract?.supply_point?.cups
  finalContract.is_indexed = contract?.contract?.isIndexed
  finalContract.tariff = contract?.contract?.rate

  const rates = getRates()
  const rate = rates?.[finalContract.tariff]

  if (rate?.num_power_periods) {
    for (let period = 1; period <= rate?.num_power_periods; period++) {
      const periodAttr = `power_p${period}`
      const periodKey = `power${period > 1 ? period : ''}`
      finalContract[periodAttr] = Math.round(
        contract?.contract?.[periodKey] * THOUSANDS_CONVERSION_FACTOR
      ).toString()
    }
  }

  finalContract.cups_address =
    `${contract?.supply_point?.address}, ${contract?.supply_point?.number} ${contract?.supply_point?.floor} ${contract?.supply_point?.door}`.trim()
  finalContract.cups_postal_code = contract?.supply_point?.postal_code
  finalContract.cups_city_id = contract?.supply_point?.city?.id
    ? parseInt(contract?.supply_point?.city?.id)
    : 0
  finalContract.cups_state_id = contract?.supply_point?.state?.id
    ? parseInt(contract?.supply_point?.state?.id)
    : 0
  finalContract.cups_cadastral_reference = contract?.supply_point?.cadastral_reference
    ? contract.supply_point.cadastral_reference.replace(/ /g, '')
    : '';
  finalContract.cnae = contract?.supply_point?.cnae
  finalContract.supply_point_accepted =
    contract?.supply_point?.supply_point_accepted

  finalContract.owner_is_member =
    holder?.vat === contract?.member?.vat && holder?.isphisical

  if (!finalContract.owner_is_member) {
    finalContract.contract_owner = {}
    finalContract.contract_owner.is_juridic = !contract?.holder?.isphisical
    finalContract.contract_owner.vat = holder?.vat
    finalContract.contract_owner.name = holder?.name
    finalContract.contract_owner.surname =
      `${holder?.surname1} ${holder?.surname2}`.trim()
    finalContract.contract_owner.proxy_vat = !contract?.holder?.isphisical
      ? holder?.proxynif
      : undefined
    finalContract.contract_owner.proxy_name = !contract?.holder?.isphisical
      ? holder?.proxyname
      : undefined

    finalContract.contract_owner.address =
      contract.holder.vat === contract.member.vat &&
      contract.holder.isphisical === true
        ? contract.member.address
        : `${contract.holder?.address}, ${contract.holder?.number} ${contract.holder?.floor} ${contract.holder?.door}`.trim()

    finalContract.contract_owner.city_id = holder?.city?.id
      ? parseInt(holder?.city?.id)
      : 0

    finalContract.contract_owner.state_id = holder?.state?.id
      ? parseInt(holder?.state?.id)
      : 0

    finalContract.contract_owner.postal_code = holder?.postal_code
    finalContract.contract_owner.email = holder?.email
    finalContract.contract_owner.phone = holder?.phone1
    finalContract.contract_owner.phone2 = holder?.phone2
    finalContract.contract_owner.lang = holder?.language
    finalContract.contract_owner.privacy_conditions =
      contract?.privacy_policy_accepted

    finalContract.contract_owner = sanitizeData(finalContract.contract_owner)
  }

  finalContract.owner_is_payer = true

  if (!finalContract.owner_is_payer) {
    finalContract.contract_payer = {}
  }

  finalContract.payment_iban = contract?.payment?.iban
  finalContract.sepa_conditions = contract?.payment?.sepa_accepted
  finalContract.donation = contract?.payment?.voluntary_cent

  finalContract.process = contract?.contract?.has_service
    ? contract?.holder?.previous_holder
      ? 'C1'
      : 'C2'
    : 'A3'


  finalContract.attachments = contract?.supply_point?.attachments
  finalContract.general_contract_terms_accepted = contract?.terms_accepted
  if (contract?.contract?.isIndexed) {
    finalContract.indexed_specific_terms_accepted = contract?.terms_accepted
  }
  finalContract.particular_contract_terms_accepted = contract?.particular_contract_terms_accepted

  if (contract?.self_consumption?.have_installation) {
    finalContract.self_consumption = {}
    finalContract.self_consumption.cau = contract?.self_consumption?.cau.replace(/ /g, '')
    finalContract.self_consumption.collective_installation =
      contract?.self_consumption?.collective_installation

    finalContract.self_consumption.installation_power = Math.round(
      contract?.self_consumption?.installation_power *
        THOUSANDS_CONVERSION_FACTOR
    ).toString()

    finalContract.self_consumption.installation_type =
      contract?.self_consumption?.installation_type
    finalContract.self_consumption.technology =
      contract?.self_consumption?.technology
    finalContract.self_consumption.aux_services =
      contract?.self_consumption?.aux_services
    finalContract.self_consumption.attachments =
      contract?.self_consumption?.attachments

    finalContract.self_consumption = sanitizeData(
      finalContract.self_consumption
    )
  }

  return sanitizeData(finalContract)
}

export const newNormalizeMember = (data) => {
  const finalMember = {};

  finalMember.tipuspersona = data.new_member.person_type === 'physic-person'
    ? USER_TYPE_PERSON
    : USER_TYPE_COMPANY

  finalMember.nom = data.new_member.name
  finalMember.dni = data.new_member.nif
  finalMember.tel = data.new_member.phone
  finalMember.email = data.new_member.email
  finalMember.cp = data.address.postal_code
  finalMember.provincia = data.address.state.id
  finalMember.adreca = `${data.address.street}, ${data.address.number} ${data.address.bloc} ${data.address.floor} ${data.address.door}`.trim()
  finalMember.municipi = data.address.city.id
  finalMember.idioma = data.new_member.language

  finalMember.payment_method =
    data.new_member.payment_method === 'iban'
      ? PAYMENT_METHOD_PAYMENT_ORDER
      : PAYMENT_METHOD_CREDIT_CARD

  finalMember.payment_iban = data.new_member.iban;

  finalMember.urlok = data.urlok
  finalMember.urlko = data.urlko

  if (data.new_member.person_type === 'physic-person') {
    finalMember.cognom = `${data.new_member.surname1} ${data.new_member.surname2}`.trim()
    finalMember.birthdate =
      data.new_member.birthdate
        ? data.new_member.birthdate.toISOString().split('T')[0]
        : ""
    finalMember.gender = data.new_member.gender
  } else {
    finalMember.representant_nom = data.new_member.proxyname
    finalMember.representant_dni = data.new_member.proxynif
  }

  finalMember.referral_source = data.new_member.referral_source
  finalMember.privacy_policy_accepted = data.privacy_policy_accepted
  finalMember.statutes_accepted = data.statutes_accepted
  finalMember.comercial_info_accepted = data.comercial_info_accepted

  return finalMember
}

export const normalizeMember = (data) => {
  const finalMember = {}

  finalMember.tipuspersona = data.member.isphisical
    ? USER_TYPE_PERSON
    : USER_TYPE_COMPANY
  finalMember.nom = data.member.name
  finalMember.dni = data.member.vat
  finalMember.tel = data.member.phone1
  finalMember.tel2 = data.member.phone2 || ''
  finalMember.email = data.member.email
  finalMember.cp = data.member.postal_code
  finalMember.provincia = data.member.state.id
  finalMember.adreca =
    `${data.member?.address}, ${data.member?.number} ${data.member?.floor} ${data.member?.door}`.trim()
  finalMember.municipi = data.member.city.id
  finalMember.idioma = data.member.language

  finalMember.payment_method =
    data.payment.payment_method === 'iban'
      ? PAYMENT_METHOD_PAYMENT_ORDER
      : data.payment.payment_method === 'credit_card'
      ? PAYMENT_METHOD_CREDIT_CARD
      : PAYMENT_METHOD_PAYMENT_ORDER

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

export const calculateTariff = ({ moreThan15Kw }) => {
  return moreThan15Kw ? '3.0TD' : '2.0TD'
}

export const testPowerForPeriods = (
  rates,
  values,
  limit = 'min_power',
  createError,
  t
) => {
  const rate = values?.rate || values?.tariff
  let valids = 0
  let inLimit = false

  if (rates[rate] === undefined) return true

  for (let i = 1; i <= rates[rate]?.num_power_periods; i++) {
    const attr = i === 1 ? 'power' : `power${i}`

    if (limit.match('min')) {
     inLimit = values[attr] >= rates[rate][limit]?.power
    } else {
      inLimit = rate == '2.0TD'
        ? values[attr] <= rates[rate][limit]?.power
        : true
    }

    inLimit && valids++
    values[attr] === undefined && valids++
  }

  if (valids >= rates[rate][limit]?.num_periods_apply) {
    return true
  }

  const value = rates[rate][limit]?.power
  const message = !limit.match('min')
    ? ('POWER_NO_MORE_THAN', { value })
    : rates[rate]?.num_power_periods > rates[rate][limit]?.num_periods_apply
    ? t('SOME_PERIOD_MORE_THAN', { value })
    : t('POWER_NO_LESS_THAN', { value })

  return createError({ message })
}

export const newTestPowerForPeriods = (
  rate,
  values,
  limit = 'min_power',
  createError
) => {
  let valids = 0
  let inLimit = false

  const newRates = getNewRates()

  if (newRates[rate] === undefined) return true

  for (let i = 1; i <= newRates[rate]?.num_power_periods; i++) {
    const attr = `power${i}`

    if (limit.match('min')) {
     inLimit = values[attr] >= newRates[rate][limit]?.power
    } else {
      inLimit = rate == 'power-lower-15kw'
        ? values[attr] <= newRates[rate][limit]?.power
        : true
    }

    inLimit && valids++
    values[attr] === undefined && valids++
  }

  if (valids >= newRates[rate][limit]?.num_periods_apply) {
    return true
  }

  const value = newRates[rate][limit]?.power
  const message = !limit.match('min')
    ? `POWER_NO_MORE_THAN${value}`
    : newRates[rate]?.num_power_periods > newRates[rate][limit]?.num_periods_apply
    ? `SOME_PERIOD_MORE_THAN${value}`
    : `POWER_NO_LESS_THAN${value}`

  return createError({ message })
}

export const templateData = {
  token: 'no-token',
  installed_power: '3.5',
  cil: 'ES13984U932824DF',
  installation_type: 'Red interior',
  subsection: 'Con excedentes y mecanismo de compensación simplificado',
  cau: 'ES1334985UDSFW984U932824DF',
  collective: false,
  generator_technology:
    '[B11] - Instalaciones que únicamente utilicen la radiación solar como energía primaria mediante la tecnología fotovoltaica',
  ssaa: 'true',
  register_section: 'Con excedentes',
  to_validate: true,
  case_id: '',
}

export const normalizeContribution = (data, signaturitData) => {
  const contribution = {}
  contribution.socinumber = data?.member?.number
  contribution.dni = data?.member?.vat
  contribution.accountbankiban = data?.payment?.iban
  contribution.amount = parseInt(data?.payment?.amount)
  if(signaturitData){
    contribution.socinumber = data?.member?.partner_number
    contribution.signaturit = data?.signaturit
    contribution.mandate_name = data?.mandate_name
    contribution.acceptaccountowner = "1"
  }
  else{
    contribution.acceptaccountowner = data?.payment?.sepa_accepted ? 1 : 0  
  }
  return contribution
}

export const getNextNBussinesDays = (day, n, marketHolidays) => {
  dayjs.extend(isoWeek)
  const today = dayjs(day)
  var result = []
  for (var i=1; result.length<n; i++) {
    var consideredDay = today.add(i, 'day')
    const weekday = consideredDay.isoWeekday()
    if (weekday === 6) continue // saturday
    if (weekday === 7) continue // sunday
    const iso = consideredDay.format('YYYY-MM-DD')
    if (marketHolidays.includes(iso)) continue

    result.push(iso)
  }
  return result
}

export const checkIsTariff20 = (tariff) => {
  const regex = new RegExp(/^[\w\s]*(2\.0)\w*/g)
  return regex.test(tariff)
}
export const checkIsTariff30 = (tariff) => {
  const regex = new RegExp(/^[\w\s]*(3\.0)\w*/g)
  return regex.test(tariff)
}
export const checkIsTariffIndexed = (tariff) => {
  return tariff.toLowerCase().match(/ndex/)
}

export const isHomeOwnerCommunityNif = (nif) => {
  return /^H/.test(nif)
}

export const checkCAUWhileTyping = (value, t, matchingCups) => {
  function error(message) {
    return {value, valid: false, error: message}
  }
  value = value.replaceAll(' ', '').toUpperCase()

  // When empty fail but do not show message yet
  if (!value)
    return error()

  if (value.slice(0,2) !== "ES".slice(0, value.length))
    return error(t('CAU_INVALID_PREFIX'))

  const numbers = value.slice(2,18)
  if (!/^\d{0,16}$/.test(numbers))
    return error(t('CAU_INVALID_AFTER_ES_SHOULD_BE_NUMBERS'))

  const redundancyDigits = value.slice(18,20)
  if (!/^[A-Z]{0,2}$/.test(redundancyDigits))
    return error(t('CAU_INVALID_REDUNDANCY_CONTROL_SHOULD_BE_LETTERS'))

  const cupsWithoutBorder = value.slice(0, 20)
  if (matchingCups && matchingCups.slice(0, cupsWithoutBorder.length) !== cupsWithoutBorder)
    return error(t('CAU_NOT_MATCHING_CUPS'))


  const borderPoint = value.slice(20, 22)
  if (borderPoint && !/^\d[A-Za-z]{0,1}$/.test(borderPoint))
    return error(t('CAU_INVALID_BORDER_POINT'))

  const installation = value.slice(22, 26)
  if (installation && !/^\A\d{0,3}$/.test(installation))
    return error(t('CAU_INVALID_INSTALLATION'))

  if (value.length !== 26)
    return error(t("CAU_INVALID_LENGTH"))

  return {value, valid: true}
}

export const isMatchingCUPSandCAU = (cau, cups) => {
  const cau_substring = cau.slice(0, 20)
  return cups.slice(0, cau_substring.length) === cau_substring
}

export const prettyCAU = (value) => {
  if (!value) return value
  value = value.replace(/[^0-9A-Za-z]/g, '') // TODO: Do not cut chars after not matching one
  value = value.slice(0, 26)
  value = value.toUpperCase()
  return value
}

export const setMunicipisWithPostalCode = async (
  postalCode,
  setFieldValue,
  fieldName,
  values
) => {
  const municipis = await getMunicipisByPostalCode(postalCode)
  if (municipis?.length > 0) {
    setFieldValue(fieldName, {
      ...values[fieldName],
      state: municipis[0][0]?.provincia,
      city: municipis[0][0]?.municipi
    })
  }
}

export const checkVatFormat = (nif) => {
  return stdnum.ES.nif.validate(nif)
}

export const checkIbanFormat = (iban) => {
  const formattedIban = electronicFormatIBAN(iban)
  return isValidIBAN(formattedIban)
}