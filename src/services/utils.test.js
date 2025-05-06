import React from 'react';
import { render } from '@testing-library/react';
import { 
    checkIsTariff20,
    normalizeContract, 
    normalizeContribution, 
    normalizeD1ConfirmationData, 
    normalizeHolderChange, 
    normalizeMember,
    newNormalizeMember,
    normalizeModifyData,
    checkCAUWhileTyping,
} from './utils'
import contractCases from './utilsMockData/forms/contract';
import memberCases from './utilsMockData/forms/member';
import holderChangeCases from './utilsMockData/forms/holderChange';
import modifyContractCases from './utilsMockData/forms/modifyContract';
import d1Cases from './utilsMockData/forms/d1';


describe("Check the utils functions", () => {

    const tariff20td = "2.0TD"
    const tariff30td = "3.0TD"
    const tariffWrong = "wrong"
    const tariff20A = "2.0A"
    const tariff20tdIndexada = "2.0TD Indexada"
    const tariff30tdIndexada = "3.0TD Indexada"
    const tariffIndexada20td = "Indexed 2.0TD"
    const tariffIndexada30td = "Indexed 3.0TD"
    const tariffSomIndexada20td = "Som Indexed 2.0TD"
    const tariff20tdIndexadaSom = "2.0TD Indexada Som"


    test("Should return true with tariff20td", () => {

        expect(checkIsTariff20(tariff20td)).toBeTruthy()

    })

    test("Should return true with tariff30td", () => {

        expect(checkIsTariff20(tariff30td)).toBeFalsy()

    })

    test("Should return true with tariffWrong", () => {

        expect(checkIsTariff20(tariffWrong)).toBeFalsy()

    })

    test("Should return true with tariff20A", () => {

        expect(checkIsTariff20(tariff20A)).toBeTruthy()

    })

    test("Should return true with tariff20tdIndexada", () => {

        expect(checkIsTariff20(tariff20tdIndexada)).toBeTruthy()

    })

    test("Should return true with tariff30tdIndexada", () => {

        expect(checkIsTariff20(tariff30tdIndexada)).toBeFalsy()

    })

    test("Should return true with tariffIndexada20td", () => {

        expect(checkIsTariff20(tariffIndexada20td)).toBeTruthy()

    })

    test("Should return true with tariffIndexada30td", () => {

        expect(checkIsTariff20(tariffIndexada30td)).toBeFalsy()

    })

    test("Should return true with tariffSomIndexada20td", () => {

        expect(checkIsTariff20(tariffSomIndexada20td)).toBeTruthy()

    })

    test("Should return true with tariff20tdIndexadaSom", () => {

        expect(checkIsTariff20(tariff20tdIndexadaSom)).toBeTruthy()

    })
})

describe("Check Contract Form (normalize function)", () => {

    test("Normalize Contract data (base)", () => {

        expect(normalizeContract(contractCases.base.entryValues)).toStrictEqual(contractCases.base.normalizedData)
    })

    test("Normalize Contract data (selfconsumption)", () => {

        expect(normalizeContract(contractCases.withSelfConsumption.entryValues)).toStrictEqual(contractCases.withSelfConsumption.normalizedData)
    })

    test("Normalize Contract data (CUPS without service)", () => {

        expect(normalizeContract(contractCases.withCUPSNoService.entryValues)).toStrictEqual(contractCases.withCUPSNoService.normalizedData)
    })
    
    test("Normalize Contract data (3.0TD)", () => {

        expect(normalizeContract(contractCases.with30TD.entryValues)).toStrictEqual(contractCases.with30TD.normalizedData)
    })

    test("Normalize Contract data (2.0)", () => {

        expect(normalizeContract(contractCases.with20.entryValues)).toStrictEqual(contractCases.with20.normalizedData)
    })
})


describe("Check Member Form (normalize function)", () => {

    test("Normalize Member data (base)", () => {
        expect(normalizeMember(memberCases.base.entryValues)).toStrictEqual(memberCases.base.normalizedData)
    })
 
    test("Normalize Member data (new Member)", () => {
        expect(normalizeMember(memberCases.newMember.entryValues)).toStrictEqual(memberCases.newMember.normalizedData)
    })

})

describe("Check Member new Form (normalize function)", () => {

  test("Normalize Member data (phisical)", () => {
      expect(newNormalizeMember(memberCases.newNewMemberPhisical.entryValues)).toStrictEqual(memberCases.newNewMemberPhisical.normalizedData)
  })

  test("Normalize Member data (juridical)", () => {
    expect(newNormalizeMember(memberCases.newNewMemberJuridical.entryValues)).toStrictEqual(memberCases.newNewMemberJuridical.normalizedData)
})
})

describe("Check Holder Change Form (normalize function)", () => {

    test("Normalize Member data (base)", () => {
        expect(normalizeHolderChange(holderChangeCases.base.entryValues)).toStrictEqual(holderChangeCases.base.normalizedData)
    })
 
    test("Normalize Member data (change holder)", () => {
        expect(normalizeHolderChange(holderChangeCases.changeHolder.entryValues)).toStrictEqual(holderChangeCases.changeHolder.normalizedData)
    })

})

describe("Check Modify Contract Form (normalize function)", () => {

    test("Normalize Modify Contract data (change power, 2.0)", () => {
        expect(normalizeModifyData(modifyContractCases.power20.entryValues)).toStrictEqual(modifyContractCases.power20.normalizedData)
    })
    
    test("Normalize Modify Contract data (change power, 3.0)", () => {
        expect(normalizeModifyData(modifyContractCases.power30.entryValues)).toStrictEqual(modifyContractCases.power30.normalizedData)
    })

})

describe("Check D1 Form (normalize function)", () => {

    test("Normalize D1 data (accept D1 no M1)", () => {
        expect(normalizeD1ConfirmationData(d1Cases.acceptD1noM1.entryValues)).toStrictEqual(d1Cases.acceptD1noM1.normalizedData)
    })
    
    test("Normalize D1 data (accept D1 no M1 no Attatchments)", () => {
        expect(normalizeD1ConfirmationData(d1Cases.acceptD1NoM1NoAtt.entryValues)).toStrictEqual(d1Cases.acceptD1NoM1NoAtt.normalizedData)
    })

})


describe("checkCAUWhileTyping provides feedback and correction while typing the CAU code",() =>{
  const t = x => x // Translate identity
  test("Should return invalid with no message when still empty", () => {
    expect(checkCAUWhileTyping('', t)).toEqual({
      value: '',
      valid: false,
      error: undefined,
    })
  })
  test("Should strip spaces", () => {
    expect(checkCAUWhileTyping('   ', t)).toEqual({
      value: '',
      valid: false,
      error: undefined,
    })
  })
  test("Should complain starting different than 'E'", () => {
    expect(checkCAUWhileTyping('K', t)).toEqual({
      value: 'K',
      valid: false,
      error: 'CAU_INVALID_PREFIX',
    })
  })
  test("Should complain second leter not 'S'", () => {
    expect(checkCAUWhileTyping('EK', t)).toEqual({
      value: 'EK',
      valid: false,
      error: 'CAU_INVALID_PREFIX',
    })
  })
  test("Should complain on length when just E", () => {
    expect(checkCAUWhileTyping('E', t)).toEqual({
      value: 'E',
      valid: false,
      error: 'CAU_INVALID_LENGTH',
    })
  })
  test("Should complain on length when just ES", () => {
    expect(checkCAUWhileTyping('ES', t)).toEqual({
      value: 'ES',
      valid: false,
      error: 'CAU_INVALID_LENGTH',
    })
  })
  test("Should correct lower cases", () => {
    expect(checkCAUWhileTyping('es', t)).toEqual({
      value: 'ES',
      valid: false,
      error: 'CAU_INVALID_LENGTH',
    })
  })
  test("Should complain on non numbers after ES", () => {
    expect(checkCAUWhileTyping('ESD', t)).toEqual({
      value: 'ESD',
      valid: false,
      error: 'CAU_INVALID_AFTER_ES_SHOULD_BE_NUMBERS',
    })
  })
  test("Should complain about length if just numbers after ES", () => {
    expect(checkCAUWhileTyping('ES12345678', t)).toEqual({
      value: 'ES12345678',
      valid: false,
      error: 'CAU_INVALID_LENGTH',
    })
  })
  test("Should complain about length if all numbers after ES", () => {
    expect(checkCAUWhileTyping('ES1234567890123456', t)).toEqual({
      value: 'ES1234567890123456',
      valid: false,
      error: 'CAU_INVALID_LENGTH',
    })
  })
  test("Should complain on non numbers if up to the 16th is not number", () => {
    expect(checkCAUWhileTyping('ES123456789012345K', t)).toEqual({
      value: 'ES123456789012345K',
      valid: false,
      error: 'CAU_INVALID_AFTER_ES_SHOULD_BE_NUMBERS',
    })
  })
  test("Should complain first CRC should be a number", () => {
    expect(checkCAUWhileTyping('ES12345678901234567', t)).toEqual({
      value: 'ES12345678901234567',
      valid: false,
      error: 'CAU_INVALID_REDUNDANCY_CONTROL_SHOULD_BE_LETTERS',
    })
  })
  test("Should complain second CRC digit is a number", () => {
    expect(checkCAUWhileTyping('ES1234567890123456A8', t)).toEqual({
      value: 'ES1234567890123456A8',
      valid: false,
      error: 'CAU_INVALID_REDUNDANCY_CONTROL_SHOULD_BE_LETTERS',
    })
  })
  test("Should complain of a border point not starting with a number", () => {
    expect(checkCAUWhileTyping('ES1234567890123456AAK', t)).toEqual({
      value: 'ES1234567890123456AAK',
      valid: false,
      error: 'CAU_INVALID_BORDER_POINT',
    })
  })
  test("Should complain of a border point not followint a letter", () => {
    expect(checkCAUWhileTyping('ES1234567890123456AA11', t)).toEqual({
      value: 'ES1234567890123456AA11',
      valid: false,
      error: 'CAU_INVALID_BORDER_POINT',
    })
  })
  test("Should complain about length if border point is ok", () => {
    expect(checkCAUWhileTyping('ES1234567890123456AA1F', t)).toEqual({
      value: 'ES1234567890123456AA1F',
      valid: false,
      error: 'CAU_INVALID_LENGTH',
    })
  })
  test("Should complain about installation if starting not an A", () => {
    expect(checkCAUWhileTyping('ES1234567890123456AA1FK', t)).toEqual({
      value: 'ES1234567890123456AA1FK',
      valid: false,
      error: 'CAU_INVALID_INSTALLATION',
    })
  })
  test("Should complain about length when installation starts with A", () => {
    expect(checkCAUWhileTyping('ES1234567890123456AA1FA', t)).toEqual({
      value: 'ES1234567890123456AA1FA',
      valid: false,
      error: 'CAU_INVALID_LENGTH',
    })
  })
  test("Should complain about installation when a non number follows A", () => {
    expect(checkCAUWhileTyping('ES1234567890123456AA1FAK', t)).toEqual({
      value: 'ES1234567890123456AA1FAK',
      valid: false,
      error: 'CAU_INVALID_INSTALLATION',
    })
  })
  test("Should accept a full CUA", () => {
    expect(checkCAUWhileTyping('ES1234567890123456AA1FA001', t)).toEqual({
      value: 'ES1234567890123456AA1FA001',
      valid: true,
    })
  })
  test("Should complain if provided CUPS and does not match", () => {
    expect(checkCAUWhileTyping('ES1234567890123456AA1FA001', t, 'ES1111222233334444551F')).toEqual({
      value: 'ES1234567890123456AA1FA001',
      valid: false,
      error: 'CAU_NOT_MATCHING_CUPS',
    })
  })
  test("Should accept if provided CUPS matches", () => {
    expect(checkCAUWhileTyping('ES1234567890123456AA1FA001', t, 'ES1234567890123456AA1F')).toEqual({
      value: 'ES1234567890123456AA1FA001',
      valid: true,
    })
  })
  test("Should complain if provided CUPS and does not match partially", () => {
    expect(checkCAUWhileTyping('ES1234567890', t, 'ES1111222233334444551F')).toEqual({
      value: 'ES1234567890',
      valid: false,
      error: 'CAU_NOT_MATCHING_CUPS',
    })
  })
  test("Should complain on length if provided CUPS matches partially", () => {
    expect(checkCAUWhileTyping('ES1234567890', t, 'ES1234567890123456AA1F')).toEqual({
      value: 'ES1234567890',
      valid: false,
      error: 'CAU_INVALID_LENGTH',
    })
  })
  test("Should ignore differences with the provided CUPS on the border point", () => {
    expect(checkCAUWhileTyping('ES1234567890123456AA1FA001', t, 'ES1234567890123456AA4F')).toEqual({
      value: 'ES1234567890123456AA1FA001',
      valid: true,
    })
  })
  test("Should precede prefix error over matching cups", () => {
    expect(checkCAUWhileTyping('KS1234567890', t, 'ES1111222233334444551F')).toEqual({
      value: 'KS1234567890',
      valid: false,
      error: 'CAU_INVALID_PREFIX',
    })
  })
  test("Should precede non-number error over matching cups", () => {
    expect(checkCAUWhileTyping('ES123456789K', t, 'ES1111222233334444551F')).toEqual({
      value: 'ES123456789K',
      valid: false,
      error: 'CAU_INVALID_AFTER_ES_SHOULD_BE_NUMBERS',
    })
  })
})
