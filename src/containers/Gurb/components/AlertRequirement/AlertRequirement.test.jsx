import AlertRequirement from './AlertRequirement'
import { GurbErrorContextProvider } from '../../../../context/GurbErrorContext'
import { render, queryByAttribute } from '@testing-library/react'

describe('AlertRequirement component', () => {
  test('AlertRequirement with severity="alert"', () => {
    const dom = render(
      <GurbErrorContextProvider>
        <AlertRequirement
          severity="alert"
          textHeader="Test Header"
          textBody="Test Body"
        />
      </GurbErrorContextProvider>
    )

    const getByDataTestId = queryByAttribute.bind(null, 'data-testid')
    const input = getByDataTestId(dom.container, 'alert-alert')
    expect(input).toBeInTheDocument()
  })

  test('AlertRequirement with severity="success"', () => {
    const dom = render(
      <GurbErrorContextProvider>
        <AlertRequirement
          severity="success"
          textHeader="Test Header"
          textBody="Test Body"
        />
      </GurbErrorContextProvider>
    )

    const getByDataTestId = queryByAttribute.bind(null, 'data-testid')
    const input = getByDataTestId(dom.container, 'alert-success')
    expect(input).toBeInTheDocument()
  })

  test('AlertRequirement with severity="error"', () => {
    const dom = render(
      <GurbErrorContextProvider>
        <AlertRequirement
          severity="error"
          textHeader="Test Header"
          textBody="Test Body"
        />
      </GurbErrorContextProvider>
    )

    const getByDataTestId = queryByAttribute.bind(null, 'data-testid')
    const input = getByDataTestId(dom.container, 'alert-error')
    expect(input).toBeInTheDocument()
  })
})
