import React from "react"

import { render, screen } from "@testing-library/react"
import { afterAll, describe, expect, test } from "vitest"

import { SummaryContextProvider } from "../../context/SummaryContext"
import ReviewTable from "./ReviewTable"

const originalInnerWidth = window.innerWidth

const tableFields = [
  [
    {
      icon: <span>ICON</span>,
      title: "Editable section",
      field: [
        { reviewLabel: "Visible", reviewValue: "Shown" },
        {
          reviewLabel: "Hidden",
          reviewValue: "Rendered only on mobile",
          hide: true,
        },
        {
          reviewLabel: "Editable field",
          reviewValue: "Change me",
          step: "edit-step",
        },
      ],
    },
  ],
]

const renderReviewTable = (width) => {
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    writable: true,
    value: width,
  })

  return render(
    <SummaryContextProvider>
      <ReviewTable tableFields={tableFields} />
    </SummaryContextProvider>,
  )
}

afterAll(() => {
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    writable: true,
    value: originalInnerWidth,
  })
})

describe("ReviewTable", () => {
  test("renders the desktop table branch at desktop widths", () => {
    renderReviewTable(600)

    expect(screen.getByText("Visible")).toBeInTheDocument()
    expect(screen.getByText("Shown")).toBeInTheDocument()
    expect(screen.queryByText("Hidden")).not.toBeInTheDocument()
    expect(
      screen.queryByText("Rendered only on mobile"),
    ).not.toBeInTheDocument()
    expect(screen.getByTestId("change-value-field")).toHaveTextContent(
      "Change me",
    )
  })

  test("renders the mobile table branch at mobile widths", () => {
    renderReviewTable(599)

    expect(screen.getByText("Visible")).toBeInTheDocument()
    expect(screen.getByText("Shown")).toBeInTheDocument()
    expect(screen.getByText("Hidden")).toBeInTheDocument()
    expect(screen.getByText("Rendered only on mobile")).toBeInTheDocument()
    expect(screen.queryByTestId("change-value-field")).not.toBeInTheDocument()
  })
})
