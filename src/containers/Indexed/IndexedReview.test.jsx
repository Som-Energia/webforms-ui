import React from 'react'
import IndexedReview from './IndexedReview'
import { Suspense } from 'react'
import Loading from '../../components/NewLoading'
import {
  fireEvent,
  render,
  screen,
  queryByAttribute
} from '@testing-library/react'

import { vi } from 'vitest';

vi.mock('react-i18next', () => require('../../tests/__mocks__/i18n'));

describe('Test that it correctly renders', () => {
  const getById = queryByAttribute.bind(null, 'id')

  const mockContractValues = {
    isphisical: true,
    name: '0191497',
    cups: 'ES0021000001234567EQ0F',
    address: 'Auguste Renoir , 13 03730 (Jávea/Xàbia)',
    owner_vat: 'ES00123456D',
    owner_name: 'Jose Montoro Pedrolo',
    owner_mobile_phone: '600000000',
    owner_phone: '972000000',
    owner_email: 'itcrowd@somenergia.coop',
    language: 'es',
    iban: 'ES79 2100 9015 2622 0028 ****',
    donation: true,
    tariff: '2.0TD_SOM',
    powers:
      '[{"value": "P1", "power": "\\"8.050\\""}, {"value": "P2", "power": "\\"8.050\\""}]'
  }

  let mockContractValuesNoPhisical = JSON.parse(
    JSON.stringify(mockContractValues)
  )
  mockContractValuesNoPhisical.isphisical = false

  const mockSetFieldValue = vi.fn()
  const mockInitialValues = {
    terms_accepted: false,
    particular_contract_terms_accepted: false,
    indexed_legal_terms_accepted: false
  }

  test('Should call the setFieldValues function to change indexed terms', () => {
    const dom = render(
      <IndexedReview
        contractValues={mockContractValues}
        setFieldValue={mockSetFieldValue}
        values={mockInitialValues}
      />
    )
    const indexedTermsCheck = getById(
      dom.container,
      'change-tariff-indexada-terms-check'
    )
    fireEvent.click(indexedTermsCheck)
    expect(mockSetFieldValue).toBeCalledWith(
      'particular_contract_terms_accepted',
      true
    )
  })

  test('Should call the setFieldValues function to change legal terms', () => {
    const dom = render(
      <IndexedReview
        contractValues={mockContractValues}
        setFieldValue={mockSetFieldValue}
        values={mockInitialValues}
        isIndexedPilotOngoing={true}
      />
    )
    const legalTermsCheck = getById(
      dom.container,
      'change-tariff-indexada-legal-terms-check'
    )
    fireEvent.click(legalTermsCheck)
    expect(mockSetFieldValue).toBeCalledWith(
      'indexed_legal_terms_accepted',
      true
    )
  })

  test('Should call the setFieldValues function to decline general terms', async () => {
    const dom = render(
      <Suspense fallback={<Loading />}>
        <IndexedReview
          contractValues={mockContractValues}
          setFieldValue={mockSetFieldValue}
          values={mockInitialValues}
        />
      </Suspense>
    )
    const acceptTermsCheck = getById(dom.container, 'change-tarif-terms-check')
    React.act(() => {
      fireEvent.click(acceptTermsCheck)
    })
    const declineTermsButton = await screen.findByText('I_DECLINE')

    React.act(() => {
      fireEvent.click(declineTermsButton)
    })

    expect(mockSetFieldValue).toBeCalledWith('terms_accepted', false)
  })

  test('Should call the setFieldValues function to accept general terms', async () => {
    const dom = render(
      <Suspense fallback={<Loading />}>
        <IndexedReview
          contractValues={mockContractValues}
          setFieldValue={mockSetFieldValue}
          values={mockInitialValues}
        />
      </Suspense>
    )
    const acceptTermsCheck = getById(dom.container, 'change-tarif-terms-check')
    React.act(() => {
      fireEvent.click(acceptTermsCheck)
    })
    const declineTermsButton = await screen.findByText('I_ACCEPT')

    React.act(() => {
      fireEvent.click(declineTermsButton)
    })

    expect(mockSetFieldValue).toBeCalledWith('terms_accepted', true)
  })
})
