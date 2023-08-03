import React from 'react'
import GenerationMemberIdFields from './GenerationMemberIdFields'
import {
  render,
  queryByAttribute,
  fireEvent,
  getByText
} from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import axios from 'axios'

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
  
  const mockValues = {
    member: {
      number: 38434,
      vat: '40323835M'
    }
  }

  const VAT = '21329935F'
  const mockSetFieldValue = jest.fn()
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
              />
            }
          />
        </Routes>
      </Router>
    )

    const vatTextField = getById(dom.container, 'vat')
    act(() => {
      fireEvent.change(vatTextField, { target: { value: VAT } })
    })
    expect(mockSetFieldValue).toHaveBeenCalledWith('member.vat', VAT)
  }) 
})
