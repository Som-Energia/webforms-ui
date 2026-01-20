import { render, queryByAttribute, screen } from '@testing-library/react'
import PrevButton from './PrevButton'
import { initI18n } from '../../tests/i18n.mock'

describe('PrevButton component ', async () => {

  // avoid warnings
  await initI18n()

  test('PrevButton renders without crashing', () => {
    const dom = render(<PrevButton />)

    const getByDataCy = queryByAttribute.bind(null, 'data-cy')
    const button = getByDataCy(dom.container, 'prev')
    expect(button).toBeInTheDocument()
  })

  test('PrevButton renders and title is shown', async () => {
    render(<PrevButton title={'PREV'} />)

    const error = await screen.findByText('PREV')
    expect(error).toBeInTheDocument()
  })

  test('PrevButton renders disabled', async () => {
    const { getByText } = render(<PrevButton title={'PREV'} disabled={true} />)

    expect(getByText('PREV')).toHaveAttribute('disabled')
  })
})
