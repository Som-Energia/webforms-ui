import { SummaryContextProvider } from '../../context/SummaryContext'
import ReviewField from './ReviewField'
import {
  render,
  screen,
  queryByAttribute
} from '@testing-library/react'

test('ReviewField renders without crashing and label and text', async () => {
  render(
    <SummaryContextProvider>
      <ReviewField
        label="LABEL"
        value="TEXT"
      />
    </SummaryContextProvider>
  )

  const label = await screen.findByText('LABEL')
  expect(label).toBeInTheDocument()
  const text = await screen.findByText('TEXT')
  expect(text).toBeInTheDocument()
})

test('ReviewField renders without crashing and only text', async () => {
  render(
    <SummaryContextProvider>
      <ReviewField
        value="TEXT"
      />
    </SummaryContextProvider>
  )

  const text = await screen.findByText('TEXT')
  expect(text).toBeInTheDocument()
  // Use try catch to avoid test failing if element is not found
  try {
    // https://testing-library.com/docs/queries/about/#screen
    closeDialogButton2 = await screen.findByText(
      'LABEL'
    )
  } catch (e) {
    // all fine
  }
})

test('ReviewField renders without crashing and text is a link to change value field', async () => {
  const dom = render(
    <SummaryContextProvider>
      <ReviewField
        label="LABEL"
        value="TEXT"
        step="STEP"
      />
    </SummaryContextProvider>
  )

  const label = await screen.findByText('LABEL')
  expect(label).toBeInTheDocument()
  const text = await screen.findByText('TEXT')
  expect(text).toBeInTheDocument()
  const getByDataTestId = queryByAttribute.bind(null, 'data-testid')
  const input = getByDataTestId(dom.container, 'change-value-field')
  expect(input).toBeInTheDocument()
})
