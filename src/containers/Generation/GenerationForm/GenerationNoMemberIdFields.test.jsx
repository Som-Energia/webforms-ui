import React from 'react'
import GenerationNoMemberIdFields from './GenerationNoMemberIdFields'
import {
  render,
  queryByAttribute,
  fireEvent
} from '@testing-library/react'
import { act } from 'react-dom/test-utils'


import { vi } from 'vitest';

vi.mock('react-i18next', () => require('../../../tests/__mocks__/i18n'));

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
  const mockSetFieldValue = vi.fn()
  const mocksetFieldTouched = vi.fn()

  test('Should call setFieldValue when change postal code', async () => {
    

    const dom = render(
      <GenerationNoMemberIdFields
        resetForm={vi.fn()}
        values={mockValuesPostalCode}
        setFieldValue={mockSetFieldValue}
        setFieldTouched={mocksetFieldTouched}
        setErrors={vi.fn()}
        isTesting={true}
      />
    )

    const postalCodeTextField = getById(dom.container, 'input_postalcode')
    React.act(() => {
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
        resetForm={vi.fn()}
        values={mockValuesEnabeldAndCheckedZone}
        setFieldValue={mockSetFieldValue}
        setFieldTouched={mocksetFieldTouched}
        setErrors={vi.fn()}
        isTesting={true}
      />
    )

    const vatTextField = getById(dom.container, 'vat')
    React.act(() => {
      fireEvent.change(vatTextField, { target: { value: VAT } })
    })
    
    expect(mockSetFieldValue).toHaveBeenCalledWith('member.vat', VAT)
  })
})
