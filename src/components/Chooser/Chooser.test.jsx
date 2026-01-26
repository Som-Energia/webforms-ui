import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { fireEvent, render, screen, within } from '@testing-library/react'
import Chooser from './Chooser'
import { vi } from 'vitest'

const icon1 = <LightbulbOutlinedIcon />
const icon2 = <CheckCircleIcon />

const chooserOptions = [
  {
    id: 'a',
    textHeader: 'Option A',
    textBody: 'This is option A',
    icon: icon1,
    helper: 'helper-a',
  },
  {
    id: 'b',
    textHeader: 'Option B',
    textBody: 'This is option B',
    icon: icon2,
    helper: 'helper-b',
  },
]

const chooserOptionsWithoutBodyText = [
  { id: 'a', textHeader: 'Option A' },
  { id: 'b', textHeader: 'Option B' },
]

describe('Chooser component ', () => {
  test('Chooser renders with empty arrays of options', () => {
    render(<Chooser name="chooser-name" value={'a'} options={[]} />)

    let buttons = []
    try {
      buttons = screen.getAllByRole('button')
    } catch {
      expect(buttons).toHaveLength(0)
    }
  })

  test('Chooser renders and show the correct options', () => {
    render(<Chooser name="chooser-name" value={'a'} options={chooserOptions} />)

    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(2)

    const optionA = within(buttons[0])
    expect(optionA.getByText('Option A')).toBeInTheDocument()
    expect(optionA.getByText('This is option A')).toBeInTheDocument()

    const optionB = within(buttons[1])
    expect(optionB.getByText('Option B')).toBeInTheDocument()
    expect(optionB.getByText('This is option B')).toBeInTheDocument()
  })

  test('Chooser renders and show options without textBody', () => {
    render(
      <Chooser
        name="chooser-name"
        value={'a'}
        options={chooserOptionsWithoutBodyText}
      />
    )

    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(2)

    const optionA = within(buttons[0])
    expect(optionA.getByText('Option A')).toBeInTheDocument()

    const optionB = within(buttons[1])
    expect(optionB.getByText('Option B')).toBeInTheDocument()
  })

  test('Chooser renders with selected option', () => {
    const setSelectedSpy = vi.fn()

    render(
      <Chooser
        name="chooser-name"
        value={'a'}
        options={chooserOptions}
        handleChange={setSelectedSpy}
      />
    )

    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(2)

    fireEvent.click(buttons[0])
    expect(setSelectedSpy).toHaveBeenCalled()
  })

  test('Chooser render options with helpers', async () => {
    render(<Chooser name="chooser-name" value={'a'} options={chooserOptions} />)

    const items = screen.getAllByRole('button')
    expect(items).toHaveLength(2)

    const helperA = await screen.findByText('helper-a')
    expect(helperA).toBeInTheDocument()

    const helperB = await screen.findByText('helper-b')
    expect(helperB).toBeInTheDocument()
  })

  test('Chooser render with icons', async () => {
    render(<Chooser name="chooser-name" value={'a'} options={chooserOptions} />)

    const items = screen.getAllByRole('button')
    expect(items).toHaveLength(2)

    const [firstItem, secondItem] = items
    const firstIconElement = within(firstItem).getByTestId(
      'LightbulbOutlinedIcon'
    )
    expect(firstIconElement).toBeInTheDocument()

    const secondIconElement = within(secondItem).getByTestId('CheckCircleIcon')
    expect(secondIconElement).toBeInTheDocument()
  })
})
