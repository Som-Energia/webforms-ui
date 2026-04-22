import React from 'react'
import GenerationMemberIdFields from './GenerationMemberIdFields'
import {
  render,
  queryByAttribute,
  fireEvent,
  getByText
} from '@testing-library/react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import axios from 'axios'

import { vi } from 'vitest';

vi.mock('react-i18next', () => require('../../../tests/__mocks__/i18n'));


describe('Generation Form Review', () => {
  
  const mockValues = {
    member: {
      number: 38434,
      vat: '40323835M'
    }
  }

  const VAT = '21329935F'
  const mockSetFieldValue = vi.fn()
  const getById = queryByAttribute.bind(null, 'id')

  test('Should call setFieldValue when change vat', async () => {
    const dom = render(
      <Router>
        <Routes>
          <Route
            exact
            path="/"
            element={
              <GenerationMemberIdFields
                setFieldValue={mockSetFieldValue}
                values={mockValues}
                setErrors={vi.fn()}
                isTesting={true}
              />
            }
          />
        </Routes>
      </Router>
    )

    const vatTextField = getById(dom.container, 'vat')
    React.act(() => {
      fireEvent.change(vatTextField, { target: { value: VAT } })
    })
    expect(mockSetFieldValue).toHaveBeenCalledWith('member.vat', VAT)
  })
})
