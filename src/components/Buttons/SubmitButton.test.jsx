import { render, queryByAttribute, screen } from '@testing-library/react'
import SubmitButton from './SubmitButton'

test('SubmitButton renders without crashing', () => {
  const dom = render(<SubmitButton />)

  const getByDataCy = queryByAttribute.bind(null, 'data-cy')
  const button = getByDataCy(dom.container, 'next')
  expect(button).toBeInTheDocument()
})

test('SubmitButton renders and text is shown', async () => {
  render(<SubmitButton text={'FINISH'} />)

  const error = await screen.findByText('FINISH')
  expect(error).toBeInTheDocument()
})

test('SubmitButton renders disabled', async () => {
  const { getByText } = render(<SubmitButton text={'FINISH'} disabled={true} />)

  expect(getByText('FINISH')).toHaveAttribute('disabled')
})

test('SubmitButton renders sending', async () => {
  const { getByRole } = render(<SubmitButton text={'FINISH'} sending={true} />)

  expect(getByRole('progressbar')).toBeInTheDocument()
})
