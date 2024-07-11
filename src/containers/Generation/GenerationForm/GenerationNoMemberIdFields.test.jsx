import React from 'react'
import GenerationNoMemberIdFields from './GenerationNoMemberIdFields'
import {
  render,
  queryByAttribute,
  fireEvent
} from '@testing-library/react'
import { act } from 'react-dom/test-utils'


jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {})
      }
    }
  }
}))

describe('Generation Form Review', () => {
  
  const mockValuesPostalCode = {
    member: {
      is_member: true,
      has_generation_enabled_zone: false,
      postal_code: '25225'
    }
  }

  const mockValuesEnabeldAndCheckedZone = {
    member: {
      is_member: false,
      postal_code_checked: true,
      has_generation_enabled_zone: true
    }
  }

  const VAT = '40323835M'
  const POSTAL_CODE = '25290'
  const getById = queryByAttribute.bind(null, 'id')
  const mockSetFieldValue = jest.fn()
  const mocksetFieldTouched = jest.fn()

  test('Should call setFieldValue when change postal code', async () => {
    

    const dom = render(
      <GenerationNoMemberIdFields
        resetForm={jest.fn()}
        values={mockValuesPostalCode}
        setFieldValue={mockSetFieldValue}
        setFieldTouched={mocksetFieldTouched}
        setErrors={jest.fn()}
        isTesting={true}
      />
    )

    const postalCodeTextField = getById(dom.container, 'input_postalcode')
    act(() => {
      fireEvent.change(postalCodeTextField, { target: { value: POSTAL_CODE } })
    })

    expect(mockSetFieldValue).toHaveBeenCalledWith(
      'member.postal_code',
      POSTAL_CODE
    )
  })

  test('Should call setFieldValue when change vat', async () => {
    const dom = render(
      <GenerationNoMemberIdFields
        resetForm={jest.fn()}
        values={mockValuesEnabeldAndCheckedZone}
        setFieldValue={mockSetFieldValue}
        setFieldTouched={mocksetFieldTouched}
        setErrors={jest.fn()}
        isTesting={true}
      />
    )

    const vatTextField = getById(dom.container, 'vat')
    act(() => {
      fireEvent.change(vatTextField, { target: { value: VAT } })
    })
    
    expect(mockSetFieldValue).toHaveBeenCalledWith('member.vat', VAT)
  })
})
