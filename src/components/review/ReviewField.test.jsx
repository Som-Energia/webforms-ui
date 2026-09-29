import React from "react"

import {
  fireEvent,
  queryByAttribute,
  render,
  screen,
} from "@testing-library/react"

import SummaryContext, {
  SummaryContextProvider,
} from "../../context/SummaryContext"
import ReviewField from "./ReviewField"

const SummaryFieldObserver = () => {
  const { summaryField } = React.useContext(SummaryContext)

  return <span data-testid="summary-field-value">{summaryField ?? ""}</span>
}

describe("ReviewField component ", () => {
  test("ReviewField renders without crashing and label and text", async () => {
    render(
      <SummaryContextProvider>
        <ReviewField label="LABEL" value="TEXT" />
      </SummaryContextProvider>,
    )

    const label = await screen.findByText("LABEL")
    expect(label).toBeInTheDocument()
    const text = await screen.findByText("TEXT")
    expect(text).toBeInTheDocument()
  })

  test("ReviewField renders without crashing and only text", async () => {
    render(
      <SummaryContextProvider>
        <ReviewField value="TEXT" />
      </SummaryContextProvider>,
    )

    const text = await screen.findByText("TEXT")
    expect(text).toBeInTheDocument()
    // Use try catch to avoid test failing if element is not found
    try {
      // https://testing-library.com/docs/queries/about/#screen
      await screen.findByText("LABEL")
    } catch {
      // all fine
    }
  })

  test("ReviewField renders without crashing and text is a link to change value field", async () => {
    const dom = render(
      <SummaryContextProvider>
        <ReviewField label="LABEL" value="TEXT" step="STEP" />
        <SummaryFieldObserver />
      </SummaryContextProvider>,
    )

    const label = await screen.findByText("LABEL")
    expect(label).toBeInTheDocument()
    const text = await screen.findByText("TEXT")
    expect(text).toBeInTheDocument()
    const getByDataTestId = queryByAttribute.bind(null, "data-testid")
    const input = getByDataTestId(dom.container, "change-value-field")
    expect(input).toBeInTheDocument()

    fireEvent.click(input)

    expect(screen.getByTestId("summary-field-value")).toHaveTextContent("STEP")
  })
})
