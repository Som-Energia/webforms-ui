import { fireEvent, queryByAttribute, render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import PaymentAuthorizationCheckbox from './PaymentAuthorizationCheckbox'

describe('PaymentAuthorizationCheckbox component', () => {
  test('renders label and required asterisk', async () => {
    render(
      <PaymentAuthorizationCheckbox
        checked={false}
        label="Accepto les condicions"
      />
    )

    const label = await screen.findByText('Accepto les condicions')
    expect(label).toBeInTheDocument()

    const asterisk = await screen.findByText('*')
    expect(asterisk).toBeInTheDocument()
  })

  test('renders checkbox as checked when checked is true', () => {
    render(
      <PaymentAuthorizationCheckbox
        checked={true}
        label="Accepto les condicions"
      />
    )

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeChecked()
  })

  test('calls onChange when checkbox changes', () => {
    const handleChange = vi.fn()

    render(
      <PaymentAuthorizationCheckbox
        checked={false}
        label="Accepto les condicions"
        onChange={handleChange}
      />
    )

    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)

    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  test('passes data-cy to checkbox', () => {
    const dom = render(
      <PaymentAuthorizationCheckbox
        checked={false}
        label="Accepto les condicions"
        dataCy="iban_check"
      />
    )

    const getByDataCy = queryByAttribute.bind(null, 'data-cy')
    const checkbox = getByDataCy(dom.container, 'iban_check')
    expect(checkbox).toBeInTheDocument()
  })
})
