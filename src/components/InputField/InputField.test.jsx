import { queryByAttribute, render, screen } from '@testing-library/react'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import InputField from './InputField'

test('InputField renders without crashing and label', async () => {
  const dom = render(<InputField name="NAME" />)

  const getByDataCy = queryByAttribute.bind(null, 'data-cy')
  const input = getByDataCy(dom.container, 'NAME')
  expect(input).toBeInTheDocument()
})

test('InputField renders required field', async () => {
  render(<InputField required={true} />)

  const asterisk = await screen.findByText('*')
  expect(asterisk).toBeInTheDocument()
})

test('InputField renders text helper', async () => {
  render(<InputField textFieldHelper="TEXTFIELDHELPER" />)

  const asterisk = await screen.findByText('TEXTFIELDHELPER')
  expect(asterisk).toBeInTheDocument()
})

test('InputField renders text error', async () => {
  // Initialize i18n for the test
  await i18n.use(initReactI18next).init({
    lng: 'en',
    fallbackLng: 'en',
    defaultNS: 'translationsNS',
    resources: {
      en: { translationsNS: { ERROR: 'Error translation' } }
    },
    debug: false
  })

  render(<InputField name="NAME" error="ERROR" touched={true} />)

  const error = await screen.findByText('Error translation')
  expect(error).toBeInTheDocument()
})

test('InputField renders children node', async () => {
  const { getByTestId } = render(
    <InputField name="NAME" label="LABEL">
      <div data-testid="children1">CHILDREN NODE</div>
    </InputField>
  )

  const children = getByTestId('children1')
  expect(children).toBeInTheDocument()
})
