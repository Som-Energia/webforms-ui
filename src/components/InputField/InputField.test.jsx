import { queryByAttribute, render, screen } from '@testing-library/react'
import InputField from './InputField'
import { initI18n } from '../../tests/i18n.mock'

describe('InputField component', () => {
  test('InputField renders without crashing and showing label', async () => {
    const dom = render(<InputField name="NAME" />)

    const getByDataCy = queryByAttribute.bind(null, 'data-cy')
    const input = getByDataCy(dom.container, 'NAME')
    expect(input).toBeInTheDocument()
  })

  test('InputField renders with required field character', async () => {
    render(<InputField required={true} />)

    const asterisk = await screen.findByText('*')
    expect(asterisk).toBeInTheDocument()
  })

  test('InputField renders with text helper', async () => {
    render(<InputField textFieldHelper="TEXTFIELDHELPER" />)

    const asterisk = await screen.findByText('TEXTFIELDHELPER')
    expect(asterisk).toBeInTheDocument()
  })

  test('InputField renders with text error', async () => {
    // Initialize i18n for the test
    await initI18n({
      ERROR: 'Error translation',
    })

    render(<InputField name="NAME" error="ERROR" touched={true} />)

    const error = await screen.findByText('Error translation')
    expect(error).toBeInTheDocument()
  })

  test('InputField renders and showing children node', async () => {
    const { getByTestId } = render(
      <InputField name="NAME" label="LABEL">
        <div data-testid="children1">CHILDREN NODE</div>
      </InputField>
    )

    const children = getByTestId('children1')
    expect(children).toBeInTheDocument()
  })
})
