export const GURB_REQUIREMENTS_STEP = 'GURB_REQUIREMENTS_STEP'
export const GURB_NEW_MEMBER_STEP = 'GURB_NEW_MEMBER_STEP'
export const GURB_CONTRACT_STEP = 'GURB_CONTRACT_STEP'
export const GURB_FINAL_STEP = 'GURB_FINAL_STEP'
export const NEW_MEMBER_STEP = 'NEW_MEMBER_STEP'
export const NEW_CONTRACT_STEP = 'NEW_CONTRACT_STEP'


// GURB form steps
export const GURB_FORM_STEPS = [
  GURB_REQUIREMENTS_STEP,
  GURB_NEW_MEMBER_STEP,
  GURB_CONTRACT_STEP,
  GURB_FINAL_STEP
]

// Gurb Contract form steps
export const CONTRACT_FORM_STEPS = [
  GURB_NEW_MEMBER_STEP,
  GURB_CONTRACT_STEP,
]

// New Contract with Member form steps
export const CONTRACT_MEMBER_FORM_STEPS = [
  NEW_MEMBER_STEP,
  NEW_CONTRACT_STEP,
]

// Substeps
export const GURB_REQUIREMENTS_SUBSTEPS = {
  LIGHT_QUESTION: 0,
  SUPPLY_POINT: 1,
  SELFCONSUMPTION: 2,
  MEMBER_QUESTION: 3
}

export const GURB_CONTRACT_FORM_SUBSTEPS = {
  IDENTIFY_HOLDER: 3,
  HOLDER_INFO: 4,
  SUPPLY_ADDRESS: 5,
  SUPPLY_INFO: 6,
  POWER: 7,
  TARIFF: 8,
  DONATION: 9,
  IBAN: 10,
  SUMMARY: 11,
}

export const GURB_FORM_SUBSTEPS = {
  GURB_PARTICIPATION: 12,
  CONTRACT_SUMMARY: 13,
  PAYMENT: 14,
}

export const CONTRACT_FORM_SUBSTEPS = {
  IDENTIFY_HOLDER: 3,
  HOLDER_INFO: 4,
  SUPPLY_ADDRESS: 5,
  SUPPLY_INFO: 6,
  POWER: 7,
  TARIFF: 8,
  DONATION: 9,
  IBAN: 10,
  SUMMARY: 11,
}

export const NEW_MEMBER_FORM_SUBSTEPS = {
  IDENTIFY_MEMBER: 0,
  MEMBER_INFO: 1,
  PAYMENT_INFO: 2,
  SUMMARY: 3,
}

export const NEW_MEMBER_CONTRACT_FORM_SUBSTEPS = {
  IDENTIFY_MEMBER: 1,
  MEMBER_INFO: 2,
  SUPPLY_POINT: 3,
  SUPPLY_INFO: 4,
  POWER: 5,
  SELFCONSUMPTION: 6,
  SELFCONSUMPTION_INFO: 7,
  HOLDER_INFO: 8,
  DONATION: 9,
  PAYMENT_INFO: 10,
  SUMMARY: 11
}

export const NEW_LINK_MEMBER_CONTRACT_FORM_SUBSTEPS = {
  LINK_MEMBER: 1,
  SUPPLY_POINT: 2,
  SUPPLY_INFO: 3,
  POWER: 4,
  SELFCONSUMPTION: 5,
  SELFCONSUMPTION_INFO: 6,
  HOLDER_INFO: 7,
  MEMBER_INFO: 8,
  DONATION: 9,
  PAYMENT_INFO: 10,
  SUMMARY: 11
}

export const NEW_CONTRACT_FORM_SUBSTEPS = {
  IDENTIFY_HOLDER: 3,
  HOLDER_INFO: 4,
  SUPPLY_ADDRESS: 5,
  SUPPLY_INFO: 6,
  POWER: 7,
  TARIFF: 8,
  DONATION: 9,
  IBAN: 10,
  SUMMARY: 11,
}
