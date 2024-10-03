import React from 'react';
import { render } from '@testing-library/react';
import { 
    checkIsTariff20,
    normalizeContract, 
    normalizeContribution, 
    normalizeD1ConfirmationData, 
    normalizeHolderChange, 
    normalizeMember, 
    normalizeModifyData 
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