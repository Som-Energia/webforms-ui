import AlertBox from './AlertBox'
import {
  render,
  queryByAttribute
} from '@testing-library/react'

test('AlertBox with severity="warning" renders without crashing', () => {
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

test('AlertBox with severity="success" renders without crashing', () => {
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

test('AlertBox with severity="error" renders without crashing', () => {
  const dom = render(
    <AlertBox
      severity="error"
      title="Test Header"
      description="Test Body"
    />
  )

  const getByDataTestId = queryByAttribute.bind(null, 'data-testid')
  const input = getByDataTestId(dom.container, 'alert-error')
  expect(input).toBeInTheDocument()
})

test('AlertBox with severity="info" renders without crashing', () => {
  const dom = render(
    <AlertBox
      severity="info"
      title="Test Header"
      description="Test Body"
    />
  )

  const getByDataTestId = queryByAttribute.bind(null, 'data-testid')
  const input = getByDataTestId(dom.container, 'alert-info')
  expect(input).toBeInTheDocument()
})