import { render, queryByAttribute, screen } from '@testing-library/react'
import NextButton from './NextButton'

test('NextButton renders without crashing', () => {
  const dom = render(<NextButton/>)

  const getByDataCy = queryByAttribute.bind(null, 'data-cy')
  const button = getByDataCy(dom.container, 'next')
  expect(button).toBeInTheDocument()
})

test('NextButton renders and title is shown', async () => {
  render(<NextButton title={'NEXT'} />)

  const error = await screen.findByText('NEXT')
  expect(error).toBeInTheDocument()
})

test('NextButton renders disabled', async () => {
  const {getByText} = render(<NextButton title={'NEXT'} disabled={true}/>)

  expect(getByText('NEXT')).toHaveAttribute('disabled')
})
