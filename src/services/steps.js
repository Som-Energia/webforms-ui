export const GURB_REQUIREMENTS_STEP = 'GURB_REQUIREMENTS_STEP'
export const GURB_NEW_MEMBER_STEP = 'GURB_NEW_MEMBER_STEP'
export const GURB_CONTRACT_STEP = 'GURB_CONTRACT_STEP'
export const GURB_FINAL_STEP = 'GURB_FINAL_STEP'

// GURB form steps
export const GURB_FORM_STEPS = [
  GURB_REQUIREMENTS_STEP,
  GURB_NEW_MEMBER_STEP,
  GURB_CONTRACT_STEP,
  GURB_FINAL_STEP
]

// New Contract form steps
export const CONTRACT_FORM_STEPS = [
  GURB_NEW_MEMBER_STEP,
  GURB_CONTRACT_STEP,
]

// Substeps
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
  MEMBER_INFO: 0,
  NEW_MEMBER: 1,
  APADRINATING: 2,
}
