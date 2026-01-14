import { fireEvent, render, screen, within } from '@testing-library/react'
import SelectField from './SelectField'

const mockOptionsArray = [
  { id: '1', name: 'OPTION1' },
  { id: '2', name: 'OPTION2' }
]

const mockOptionsObject = {
  3: 'OPTION1',
  4: 'OPTION2'
}

const renderWithArray = (options) => {
  return render(<SelectField label="LABEL" options={options} />)
}

const renderWithObject = (object) => {
  return render(<SelectField label="LABEL" options={object} />)
}

const getSelectValues = (renderResult) => {
  const { getByTestId } = renderResult
  const selectElement = getByTestId('select-field')
  expect(selectElement).toBeInTheDocument()

  const combobox = within(selectElement).getByRole('combobox')
  fireEvent.mouseDown(combobox)

  const listbox = within(screen.getByRole('presentation')).getByRole('listbox')
  const options = within(listbox).getAllByRole('option')

  return options.map((li) => li.getAttribute('data-value'))
}

test('SelectField renders and empty arrays of options', async () => {
  renderWithArray([])

  const label = await screen.findByText('LABEL')
  expect(label).toBeInTheDocument()
})

test('SelectField renders and empty object of options', async () => {
  renderWithObject({})

  const label = await screen.findByText('LABEL')
  expect(label).toBeInTheDocument()
})

test('SelectField renders and show the correct options', () => {
  const optionValues = getSelectValues(renderWithArray(mockOptionsArray))
  const mockOptionsIds = mockOptionsArray.map((item) => item.id)
  expect(optionValues).toEqual(mockOptionsIds)
})

test('SelectField renders and object of options', async () => {
  const optionValues = getSelectValues(renderWithObject(mockOptionsObject))

  const mockOptionsIds = Object.keys(mockOptionsObject)
  expect(mockOptionsIds).toEqual(optionValues)
})
