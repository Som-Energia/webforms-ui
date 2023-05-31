import { getRates } from '../services/api'
import dayjs from 'dayjs'

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
  minContribution: 100,
  maxContribution: 100000,
  contributionStep: 100
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
    attachments: [...modify?.attachments, ...modify?.power_attachments],
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
  finalContract.is_indexed = contract?.isIndexed
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
  if (contract?.isIndexed) {
    finalContract.indexed_specific_terms_accepted = contract?.terms_accepted
  }
  finalContract.particular_contract_terms_accepted = contract?.particular_contract_terms_accepted

  if (contract?.self_consumption?.have_installation) {
    finalContract.self_consumption = {}
    finalContract.self_consumption.cau = contract?.self_consumption?.cau
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
  if (rates[rate] === undefined) return true
  for (let i = 1; i <= rates[rate]?.num_power_periods; i++) {
    const attr = i === 1 ? 'power' : `power${i}`
    const inLimit = limit.match('min')
      ? values[attr] >= rates[rate][limit]?.power
      : values[attr] <= rates[rate][limit]?.power
    inLimit && valids++
    values[attr] === undefined && valids++
  }

  if (valids >= rates[rate][limit]?.num_periods_apply) {
    return true
  }

  const lessThan =
    rates[rate]?.num_power_periods > rates[rate][limit]?.num_periods_apply
      ? 'SOME_PERIOD_MORE_THAN'
      : 'POWER_NO_LESS_THAN'

  return createError({
    message: t(limit.match('min') ? lessThan : 'POWER_NO_MORE_THAN', {
      value: rates[rate][limit]?.power
    })
  })
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

export const normalizeContribution = (data) => {
  const contribution = {}
  contribution.socinumber = data?.member?.number
  contribution.dni = data?.member?.vat
  contribution.accountbankiban = data?.payment?.iban
  contribution.amount = parseInt(data?.payment?.amount)
  contribution.acceptaccountowner = data?.payment?.sepa_accepted ? 1 : 0

  return contribution
}

export const getNextNBussinesDays = (day, n, marketHolidays) => {
  var isoWeek = require('dayjs/plugin/isoWeek')
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

export const checkIsTariffIndexed = (tariff) => {
  return tariff.toLowerCase().match(/ndex/)
}
