import {
  normalizeAddress,
  normalizeClient,
  normalizeSelfconsumption,
  newNormalizeContract
} from './newNormalize'

import newContractCases from './utilsMockData/forms/newContract'

import { address, client, selfconsumption } from './utilsMockData/common'

describe('Check Address (normalize function)', () => {
  test('Normalize Address', () => {
    expect(normalizeAddress(address.entryValues)).toStrictEqual(
      address.normalizedData
    )
  })
})

describe('Check Selfconsumption (normalize function)', () => {
  test('Normalize Selfconsumption', () => {
    expect(normalizeSelfconsumption(selfconsumption.entryValues)).toStrictEqual(
      selfconsumption.normalizedData
    )
  })
})

describe('Check Client (normalize function)', () => {
  test('Normalize Client (phisical)', () => {
    expect(normalizeClient(client.physical.entryValues)).toStrictEqual(
      client.physical.normalizedData
    )
  })

  test('Normalize Client (juridical)', () => {
    expect(normalizeClient(client.juridic.entryValues)).toStrictEqual(
      client.juridic.normalizedData
    )
  })
})

describe('Check Contract new Form (normalize function)', () => {
  test('Normalize Contract data (alreadyMember)', () => {
    expect(
      newNormalizeContract(newContractCases.alreadyMember.entryValues)
    ).toStrictEqual(newContractCases.alreadyMember.normalizedData)
  })

  test('Normalize Contract data (sponsored)', () => {
    expect(
      newNormalizeContract(newContractCases.sponsored.entryValues)
    ).toStrictEqual(newContractCases.sponsored.normalizedData)
  })
})
