import React from "react"

import { render, screen } from "@testing-library/react"
import { describe, expect, test } from "vitest"

import { SummaryContextProvider } from "../../context/SummaryContext"
import ReviewMobileTable from "./ReviewMobileTable"

const renderReviewMobileTable = (tableFields) => {
  return render(
    <SummaryContextProvider>
      <ReviewMobileTable tableFields={tableFields} />
    </SummaryContextProvider>,
  )
}

describe("ReviewMobileTable", () => {
  test("renders each mobile block title, visible field content, subtitle, and footer", () => {
    renderReviewMobileTable([
      [
        {
          icon: <span>ICON 1</span>,
          title: "Account details",
          subtitle: "Primary holder",
          footer: "Footer note",
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
    expect(screen.getByText("Primary holder")).toBeInTheDocument()
    expect(screen.getByText("Footer note")).toBeInTheDocument()
    expect(screen.getByText("Name")).toBeInTheDocument()
    expect(screen.getByText("Mario")).toBeInTheDocument()
    expect(screen.getByText("Email")).toBeInTheDocument()
    expect(screen.getByText("mario@example.com")).toBeInTheDocument()
    expect(screen.getByText("CUPS")).toBeInTheDocument()
    expect(screen.getByText("ES123")).toBeInTheDocument()
  })

  test("renders every field entry through ReviewField and preserves current hidden and step behavior", () => {
    renderReviewMobileTable([
      [
        {
          icon: <span>ICON</span>,
          title: "Editable section",
          field: [
            { reviewLabel: "Visible", reviewValue: "Shown" },
            {
              reviewLabel: "Hidden",
              reviewValue: "Still rendered on mobile",
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
    ])

    expect(screen.getByText("Visible")).toBeInTheDocument()
    expect(screen.getByText("Shown")).toBeInTheDocument()
    expect(screen.getByText("Hidden")).toBeInTheDocument()
    expect(screen.getByText("Still rendered on mobile")).toBeInTheDocument()
    expect(screen.getByText("Editable field")).toBeInTheDocument()
    expect(screen.getByText("Change me")).toBeInTheDocument()
    expect(screen.queryByTestId("change-value-field")).not.toBeInTheDocument()
  })
})
