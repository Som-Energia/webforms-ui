import { act, useContext } from "react"

import {
  fireEvent,
  queryByAttribute,
  render,
  screen,
} from "@testing-library/react"

import PopUpContext, { PopUpContextProvider } from "../../context/PopUpContext"
import ErrorDialog from "./ErrorDialog"

// Mock component to use the SimpleGurbDialog within a PopUpContext
const MockWrapperComponentWithDialog = () => {
  const { setContent } = useContext(PopUpContext)
  return (
    <>
      <button
        id="dummy-open-dialog"
        onClick={() =>
          setContent(<ErrorDialog title="TEST" onClose={setContent} />)
        }>
        Open Dialog
      </button>
    </>
  )
}

describe("SimpleGurbDialog component", () => {
  test("SimpleGurbDialog renders without crashing", async () => {
    const dom = render(
      <PopUpContextProvider>
        <MockWrapperComponentWithDialog />
      </PopUpContextProvider>,
    )

    const getById = queryByAttribute.bind(null, "id")
    const getByDataCy = queryByAttribute.bind(null, "data-cy")

    const buttonElement = getById(dom.container, "dummy-open-dialog")
    const contentElement = getByDataCy(dom.container, "error-dialog")
    expect(contentElement).toBeNull()
    act(() => {
      fireEvent.click(buttonElement)
    })
    const contentElementA = await screen.findByText("TEST")
    expect(contentElementA).toBeInTheDocument()
  })

  test("ErrorDialog renders custom nested content supplied as children", async () => {
    render(
      <PopUpContextProvider>
        <ErrorDialog title="TEST" onClose={() => {}}>
          <div>
            <p>Custom error details</p>
          </div>
        </ErrorDialog>
      </PopUpContextProvider>,
    )

    expect(await screen.findByText("Custom error details")).toBeVisible()
  })

  test("SimpleGurbDialog simulate close button click remove element from dom", async () => {
    const dom = render(
      <PopUpContextProvider>
        <MockWrapperComponentWithDialog />
      </PopUpContextProvider>,
    )

    const getById = queryByAttribute.bind(null, "id")
    const getByDataCy = queryByAttribute.bind(null, "data-cy")

    const buttonElement = getById(dom.container, "dummy-open-dialog")
    const contentElement = getByDataCy(dom.container, "error-dialog")
    expect(contentElement).toBeNull()
    // Click on mockup component to open the dialog
    act(() => {
      fireEvent.click(buttonElement)
    })
    // Check dialog is opened
    const closeDialogButton = await screen.findByTestId(
      "error-dialog-close-button",
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
        "error-dialog-close-button",
      )
    } catch {
      // all fine
    }

    // Check dialog is closed
    expect(closeDialogButton2).toBeNull()
  })
})
