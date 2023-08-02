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
      vat: "40323835M"
    }
  }
  test('Should call setFieldValue when choose member', async () => {
    const dom = render(
      <Router>
        <Routes>
          <Route exact path="/" element={<GenerationMemberIdFields setFieldValue={jest.fn()} values={mockValues} />} />
        </Routes>
      </Router>
    )
  })
})
