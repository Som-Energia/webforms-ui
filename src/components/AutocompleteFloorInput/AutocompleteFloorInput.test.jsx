import {
  render,
  screen,
  queryByAttribute,
  fireEvent,
  waitFor,
} from '@testing-library/react'
import { vi } from 'vitest'
import SomAutocompleteFloorInput from './AutocompleteFloorInput'

const mockOptions = [
  { code: 'GF', translation: 'Ground Floor' },
  { code: 'FF', translation: 'First Floor' },
  { code: 'SF', translation: 'Second Floor' },
]

describe('AutocompleteFloorInput component ', () => {
  test('AutocompleteFloorInput renders without crashing', () => {
    const dom = render(
      <SomAutocompleteFloorInput
        fieldName="floor"
        value="GF"
        options={mockOptions}
        onChangeHandler={() => {}}
      />
    )

    const getByName = queryByAttribute.bind(null, 'name')
    const input = getByName(dom.container, 'floor')
    expect(input).toBeInTheDocument()
    expect(input.value).toBe('GF')
  })

  test('AutocompleteFloorInput calls onChangeHandler with correct code when blur event fired', async () => {
    const mockOnChangeHandler = vi.fn()

    render(
      <SomAutocompleteFloorInput
        fieldName="floor"
        value="GF"
        options={mockOptions}
        onChangeHandler={mockOnChangeHandler}
      />
    )

    const combobox = screen.getByRole('combobox')

    // Simulate user changing the input value
    fireEvent.change(combobox, { target: { value: 'Second Floor' } })
    fireEvent.blur(combobox)

    await waitFor(() => {
      expect(mockOnChangeHandler).toHaveBeenCalledWith({
        target: { name: 'floor', value: 'SF' },
      })
    })
  })

  test('AutocompleteFloorInput handles free text input correctly', async () => {
    const mockOnChangeHandler = vi.fn()

    render(
      <SomAutocompleteFloorInput
        fieldName="floor"
        value="1"
        options={mockOptions}
        onChangeHandler={mockOnChangeHandler}
      />
    )

    const input = screen.getByRole('combobox')

    // Simulate user entering a free text value
    fireEvent.change(input, { target: { value: '3' } })
    fireEvent.blur(input)

    await waitFor(() => {
      expect(mockOnChangeHandler).toHaveBeenCalledWith({
        target: { name: 'floor', value: '3' },
      })
    })
  })

  test('AutocompleteFloorInput handles non acceptable input value correctly', async () => {
    const mockOnChangeHandler = vi.fn()

    render(
      <SomAutocompleteFloorInput
        fieldName="floor"
        value="1"
        options={mockOptions}
        onChangeHandler={mockOnChangeHandler}
      />
    )

    const input = screen.getByRole('combobox')

    // Simulate user entering a free text value
    fireEvent.change(input, { target: { value: 'non_acceptable_text' } })
    fireEvent.blur(input)

    await waitFor(() => {
      expect(mockOnChangeHandler).toHaveBeenCalledWith({
        target: { name: 'floor', value: '' },
      })
    })
  })
})
