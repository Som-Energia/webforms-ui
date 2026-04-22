import React from 'react'
import GenerationReview from './GenerationReview'
import { render, queryByAttribute, fireEvent, getByText } from '@testing-library/react'


import { vi } from 'vitest';

vi.mock('react-i18next', () => require('../../../tests/__mocks__/i18n'));

describe('Generation Form Review', () => {

    const mockSetFieldValue = vi.fn()
    const getById = queryByAttribute.bind(null, 'id')  

    const mockValuesIsMember = {
      member:{
        is_member: true
      }
    }

    const mockValuesIsNewMember = {
      member:{
        is_member: false
      }
    }

    const mockValuesIsPhisicalNewMember = {
      member:{
        is_member: false,
        isphisical: true,
        name:"test_name",
        surname1: "surname1",
        surname2:"surname2"
      }
    }


    test('Should call setFieldValue when check is clicked', () => {
      const dom = render(<GenerationReview setFieldValue={mockSetFieldValue} />)

      const checkbox = getById(dom.container,"privacy_plicy_check")
      fireEvent.click(checkbox)
      expect(mockSetFieldValue).toBeCalledTimes(1)
    })

    test('Should show review personal data as a member', () => {
      const dom = render(<GenerationReview values={mockValuesIsMember} setFieldValue={mockSetFieldValue} />)

      const personalData = getById(dom.container,"personal-data")
      expect(getByText(personalData,"REVIEW_PERSONAL_DATA")).toBeInTheDocument()
    })

    test('Should show review personal data as a new member', () => {
      const dom = render(<GenerationReview values={mockValuesIsNewMember} setFieldValue={mockSetFieldValue} />)

      const personalData = getById(dom.container,"personal-data")
      expect(getByText(personalData,"NEW_MEMBER")).toBeInTheDocument()
    })

    test('Should show review personal data as a phisical new member', () => {
      const dom = render(<GenerationReview values={mockValuesIsPhisicalNewMember} setFieldValue={mockSetFieldValue} />)

      const personalData = getByText(dom.container,"NAME")
      expect(personalData).toBeInTheDocument()
      
    })

  })