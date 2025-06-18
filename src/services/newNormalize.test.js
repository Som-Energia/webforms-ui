import {
  normalizeAddress,
  normalizeClient,
  normalizeSelfconsumption,
  newNormalizeContract,
  normalizeAttachments,
} from './newNormalize'

import newContractCases from './utilsMockData/forms/newContract'

import { address, client, selfconsumption, supply_point_attachments } from './utilsMockData/common'

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

describe('Check Attachments (normalize function)', () => {
  test('Normalize Attachments (new_contract)', () => {
    expect(normalizeAttachments(
      supply_point_attachments.new_contract.entryValues.filename,
      supply_point_attachments.new_contract.entryValues.process
    )).toStrictEqual(
      supply_point_attachments.new_contract.normalizedData
    )
  })

  test('Normalize Attachments (invoice)', () => {
    expect(normalizeAttachments(
      supply_point_attachments.invoice.entryValues.filename,
      supply_point_attachments.invoice.entryValues.process
    )).toStrictEqual(
      supply_point_attachments.invoice.normalizedData
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

  test('Normalize Contract data (newMember)', () => {
    expect(
      newNormalizeContract(newContractCases.newMember.entryValues)
    ).toStrictEqual(newContractCases.newMember.normalizedData)
  })

  test('Normalize Contract data (A3 indexed)', () => {
    expect(
      newNormalizeContract(newContractCases.A3_indexed.entryValues)
    ).toStrictEqual(newContractCases.A3_indexed.normalizedData)
  })

  test('Normalize Contract data (C2 3.0TD)', () => {
    expect(
      newNormalizeContract(newContractCases.C2_30TD.entryValues)
    ).toStrictEqual(newContractCases.C2_30TD.normalizedData)
  })

  test('Normalize Contract data (selfconsumption)', () => {
    expect(
      newNormalizeContract(newContractCases.selfconsumption.entryValues)
    ).toStrictEqual(newContractCases.selfconsumption.normalizedData)
  })

  test('Normalize Contract data (cadastral reference)', () => {
    expect(
      newNormalizeContract(newContractCases.cadastraslReference.entryValues)
    ).toStrictEqual(newContractCases.cadastraslReference.normalizedData)
  })

  test('Normalize Contract data (tpv)', () => {
    expect(
      newNormalizeContract(newContractCases.paymentTPV.entryValues)
    ).toStrictEqual(newContractCases.paymentTPV.normalizedData)
  })

})
