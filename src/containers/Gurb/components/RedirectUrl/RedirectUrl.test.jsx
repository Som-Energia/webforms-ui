import RedirectUrl from './RedirectUrl.jsx'
import { render, queryByAttribute } from '@testing-library/react'

describe('RedirectUrl component', () => {
  test('RedirectUrl renders without crashing', () => {
    const dom = render(<RedirectUrl />)

    const getByDataCy = queryByAttribute.bind(null, 'data-cy')
    const input = getByDataCy(dom.container, 'redirect-button')
    expect(input).toBeInTheDocument()
  })

  test('RedirectUrl has correct href attribute', () => {
    const dom = render(<RedirectUrl url="https://example.com" />)

    const getByDataCy = queryByAttribute.bind(null, 'data-cy')
    const button = getByDataCy(dom.container, 'redirect-button')
    expect(button).toHaveAttribute('href', 'https://example.com')
  })
})
