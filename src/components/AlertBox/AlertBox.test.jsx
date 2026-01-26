import AlertBox from './AlertBox'
import { render, queryByAttribute } from '@testing-library/react'

describe('AlertBox component ', () => {
  test('AlertBox render with severity="warning"', () => {
    const dom = render(
      <AlertBox
        severity="warning"
        title="Test Header"
        description="Test Body"
      />
    )

    const getByDataTestId = queryByAttribute.bind(null, 'data-testid')
    const input = getByDataTestId(dom.container, 'alert-warning')
    expect(input).toBeInTheDocument()
  })

  test('AlertBox render with severity="success"', () => {
    const dom = render(
      <AlertBox
        severity="success"
        title="Test Header"
        description="Test Body"
      />
    )

    const getByDataTestId = queryByAttribute.bind(null, 'data-testid')
    const input = getByDataTestId(dom.container, 'alert-success')
    expect(input).toBeInTheDocument()
  })

  test('AlertBox render with severity="error"', () => {
    const dom = render(
      <AlertBox severity="error" title="Test Header" description="Test Body" />
    )

    const getByDataTestId = queryByAttribute.bind(null, 'data-testid')
    const input = getByDataTestId(dom.container, 'alert-error')
    expect(input).toBeInTheDocument()
  })

  test('AlertBox render with severity="info"', () => {
    const dom = render(
      <AlertBox severity="info" title="Test Header" description="Test Body" />
    )

    const getByDataTestId = queryByAttribute.bind(null, 'data-testid')
    const input = getByDataTestId(dom.container, 'alert-info')
    expect(input).toBeInTheDocument()
  })
})
