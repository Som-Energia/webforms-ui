import AddressAutocompletedFieldGurb from './AddressAutocompletedFieldGurb'
import {
  render,
  queryByAttribute,
  fireEvent,
  screen,
  waitFor,
} from '@testing-library/react'
import { vi } from 'vitest'
import { initI18n } from '../../../../tests/i18n.mock'

describe('AddressAutocompletedFieldGurb component ', async () => {

  // avoid warnings
  await initI18n()

  test('AddressAutocompletedFieldGurb renders without crashing', () => {
    const dom = render(<AddressAutocompletedFieldGurb value="Montilivi" />)

    const getByDataCy = queryByAttribute.bind(null, 'data-cy')
    const input = getByDataCy(dom.container, 'street')
    expect(input).toBeInTheDocument()
  })

  test('AddressAutocompletedFieldGurb calls onChange handler with correct code when blur event fired', async () => {
    const mockOnChange = vi.fn()

    render(
      <AddressAutocompletedFieldGurb
        value="Montilivi"
        onChange={mockOnChange}
      />
    )

    const combobox = screen.getByRole('combobox')

    // Simulate user changing the input value
    fireEvent.change(combobox, {
      target: { value: 'Avinguda de Montilivi, Girona' },
    })
    fireEvent.blur(combobox)

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith({
        id: null,
        street: 'Avinguda de Montilivi, Girona',
      })
    })
  })
})
