import React from 'react';
import { render } from '@testing-library/react';
import {checkIsTariff20} from './utils'


describe("Check the utils functions",() =>{
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


    test("Should retrun true with tariff20td", () => {

        expect(checkIsTariff20(tariff20td)).toBeTruthy()

    })

    test("Should retrun true with tariff30td", () => {

        expect(checkIsTariff20(tariff30td)).toBeFalsy()

    })

    test("Should retrun true with tariffWrong", () => {

        expect(checkIsTariff20(tariffWrong)).toBeFalsy()

    })

    test("Should retrun true with tariff20A", () => {

        expect(checkIsTariff20(tariff20A)).toBeTruthy()

    })

    test("Should retrun true with tariff20tdIndexada", () => {

        expect(checkIsTariff20(tariff20tdIndexada)).toBeTruthy()

    })

    test("Should retrun true with tariff30tdIndexada", () => {

        expect(checkIsTariff20(tariff30tdIndexada)).toBeFalsy()

    })

    test("Should retrun true with tariffIndexada20td", () => {

        expect(checkIsTariff20(tariffIndexada20td)).toBeTruthy()

    })

    test("Should retrun true with tariffIndexada30td", () => {

        expect(checkIsTariff20(tariffIndexada30td)).toBeFalsy()

    })

    test("Should retrun true with tariffSomIndexada20td", () => {

        expect(checkIsTariff20(tariffSomIndexada20td)).toBeTruthy()

    })

    test("Should retrun true with tariff20tdIndexadaSom", () => {

        expect(checkIsTariff20(tariff20tdIndexadaSom)).toBeTruthy()

    })
} )