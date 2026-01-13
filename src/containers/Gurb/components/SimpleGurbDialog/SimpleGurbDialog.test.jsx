import { useContext, act } from 'react'
import {
  render,
  queryByAttribute,
  fireEvent,
  screen
} from '@testing-library/react'
import SimpleGurbDialog from './SimpleGurbDialog'
import PopUpContext, {
  PopUpContextProvider
} from '../../../../context/PopUpContext'

// Mock component to use the SimpleGurbDialog within a PopUpContext
const MockWrapperComponentWithDialog = () => {
  const { setContent } = useContext(PopUpContext)
  return (
    <>
      <button
        id="dummy-open-dialog"
        onClick={() =>
          setContent(<SimpleGurbDialog title="TEST" setContent={setContent} />)
        }>
        Open Dialog
      </button>
    </>
  )
}

test('SimpleGurbDialog renders without crashing', async () => {
  const dom = render(
    <PopUpContextProvider>
      <MockWrapperComponentWithDialog />
    </PopUpContextProvider>
  )

  const getById = queryByAttribute.bind(null, 'id')
  const getByDataCy = queryByAttribute.bind(null, 'data-cy')

  const buttonElement = getById(dom.container, 'dummy-open-dialog')
  const contentElement = getByDataCy(dom.container, 'simple-gurb-dialog')
  expect(contentElement).toBeNull()
  act(() => {
    fireEvent.click(buttonElement)
  })
  const contentElementA = await screen.findByText('TEST')
  expect(contentElementA).toBeInTheDocument()
})

test('SimpleGurbDialog close button click', async () => {
  const dom = render(
    <PopUpContextProvider>
      <MockWrapperComponentWithDialog />
    </PopUpContextProvider>
  )

  const getById = queryByAttribute.bind(null, 'id')
  const getByDataCy = queryByAttribute.bind(null, 'data-cy')

  const buttonElement = getById(dom.container, 'dummy-open-dialog')
  const contentElement = getByDataCy(dom.container, 'simple-gurb-dialog')
  expect(contentElement).toBeNull()
  // Click on mockup component to open the dialog
  act(() => {
    fireEvent.click(buttonElement)
  })
  // Check dialog is opened
  const closeDialogButton = await screen.findByTestId(
    'simple-gurb-dialog-close-button'
  )
  expect(closeDialogButton).toBeInTheDocument()
  // Click on close button in the dialog
  act(() => {
    fireEvent.click(closeDialogButton)
  })

  let closeDialogButton2 = null
  // Use try catch to avoid test failing if element is not found
  try {
    // https://testing-library.com/docs/queries/about/#screen
    closeDialogButton2 = await screen.findByTestId(
      'simple-gurb-dialog-close-button'
    )
  } catch (e) {
    // all fine
  }

  // Check dialog is closed
  expect(closeDialogButton2).toBeNull()
})
