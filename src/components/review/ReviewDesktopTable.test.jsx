import React from "react"

import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, test } from "vitest"

import SummaryContext, {
  SummaryContextProvider,
} from "../../context/SummaryContext"
import ReviewDesktopTable from "./ReviewDesktopTable"

const SummaryFieldObserver = () => {
  const { summaryField } = React.useContext(SummaryContext)

  return <span data-testid="summary-field-value">{summaryField ?? ""}</span>
}

const renderReviewDesktopTable = (tableFields) => {
  return render(
    <SummaryContextProvider>
      <ReviewDesktopTable tableFields={tableFields} />
      <SummaryFieldObserver />
    </SummaryContextProvider>,
  )
}

describe("ReviewDesktopTable", () => {
  test("renders each row block title and visible review field values", () => {
    renderReviewDesktopTable([
      [
        {
          icon: <span>ICON 1</span>,
          title: "Account details",
          field: [
            { reviewLabel: "Name", reviewValue: "Mario" },
            { reviewLabel: "Email", reviewValue: "mario@example.com" },
          ],
        },
        {
          icon: <span>ICON 2</span>,
          title: "Supply details",
          field: [{ reviewLabel: "CUPS", reviewValue: "ES123" }],
        },
      ],
    ])

    expect(screen.getByText("Account details")).toBeInTheDocument()
    expect(screen.getByText("Supply details")).toBeInTheDocument()
    expect(screen.getByText("Name")).toBeInTheDocument()
    expect(screen.getByText("Mario")).toBeInTheDocument()
    expect(screen.getByText("Email")).toBeInTheDocument()
    expect(screen.getByText("mario@example.com")).toBeInTheDocument()
    expect(screen.getByText("CUPS")).toBeInTheDocument()
    expect(screen.getByText("ES123")).toBeInTheDocument()
  })

  test("renders optional subtitle and footer and skips hidden field entries", () => {
    renderReviewDesktopTable([
      [
        {
          icon: <span>ICON</span>,
          title: "Contract",
          subtitle: "Current tariff",
          footer: "Footer note",
          field: [
            { reviewLabel: "Visible", reviewValue: "Shown" },
            {
              reviewLabel: "Hidden",
              reviewValue: "Should not render",
              hide: true,
            },
          ],
        },
      ],
    ])

    expect(screen.getByText("Current tariff")).toBeInTheDocument()
    expect(screen.getByText("Footer note")).toBeInTheDocument()
    expect(screen.getByText("Visible")).toBeInTheDocument()
    expect(screen.getByText("Shown")).toBeInTheDocument()
    expect(screen.queryByText("Hidden")).not.toBeInTheDocument()
    expect(screen.queryByText("Should not render")).not.toBeInTheDocument()
  })

  test("passes step through to review fields so linked values can change the summary field", () => {
    renderReviewDesktopTable([
      [
        {
          icon: <span>ICON</span>,
          title: "Editable section",
          field: [
            {
              reviewLabel: "Editable field",
              reviewValue: "Change me",
              step: "edit-step",
            },
          ],
        },
      ],
    ])

    fireEvent.click(screen.getByTestId("change-value-field"))

    expect(screen.getByTestId("summary-field-value")).toHaveTextContent(
      "edit-step",
    )
  })
})
