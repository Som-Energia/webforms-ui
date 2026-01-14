
import RedirectUrl from './RedirectUrl.jsx'
import {
  render,
  queryByAttribute,
} from '@testing-library/react'

test('RedirectUrl renders without crashing', () => {
  const dom = render(
    <RedirectUrl />
  )

  const getByDataCy = queryByAttribute.bind(null, 'data-cy')
  const input = getByDataCy(dom.container, 'redirect-button')
  expect(input).toBeInTheDocument()
})

test('RedirectUrl has correct href attribute', () => {
  const dom = render(
    <RedirectUrl url="https://example.com" />
  )

  const getByDataCy = queryByAttribute.bind(null, 'data-cy')
  const button = getByDataCy(dom.container, 'redirect-button')
  expect(button).toHaveAttribute('href', 'https://example.com')
})

/*
test('AddressAutocompletedFieldGurb calls onChange with correct code on blur', async () => {
  const mockOnChange = vi.fn()

  render(
    <AddressAutocompletedFieldGurb
      value="Montilivi"
      onChange={mockOnChange}
    />
  )

  const combobox = screen.getByRole('combobox')

  // Simulate user changing the input value
  fireEvent.change(combobox, { target: { value: 'Avinguda de Montilivi, Girona' } })
  fireEvent.blur(combobox)

  await waitFor(() => {
    expect(mockOnChange).toHaveBeenCalledWith(
      { id: null, street: 'Avinguda de Montilivi, Girona' }
    )
  })
})
*/