import { render, queryByAttribute } from '@testing-library/react'
import SubmitButton from './SubmitButton'
import { initI18n } from '../../tests/i18n.mock'

describe('SumitButton component ', async () => {
  // avoid warnings
  await initI18n()

  test('SubmitButton renders without crashing', () => {
    const dom = render(<SubmitButton />)

    const getByDataCy = queryByAttribute.bind(null, 'data-cy')
    const button = getByDataCy(dom.container, 'next')
    expect(button).toBeInTheDocument()
  })

  test('SubmitButton renders and text is shown', async () => {
    const { queryByText } = render(<SubmitButton text={'FINISH'} />)
    expect(queryByText('FINISH')).toBeInTheDocument()
  })

  test('SubmitButton renders and children elements is shown', async () => {
    const { queryByText } = render(<SubmitButton>{'FINISH'}</SubmitButton>)
    expect(queryByText('FINISH')).toBeInTheDocument()
  })

  test('SubmitButton renders disabled', async () => {
    const { queryByText } = render(
      <SubmitButton text={'FINISH'} disabled={true} />
    )

    expect(queryByText('FINISH')).toHaveAttribute('disabled')
  })

  test('SubmitButton renders showing sending progressbar', async () => {
    const { getByRole } = render(
      <SubmitButton text={'FINISH'} sending={true} />
    )

    expect(getByRole('progressbar')).toBeInTheDocument()
  })
})
