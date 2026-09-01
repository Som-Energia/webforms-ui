import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test, vi } from "vitest"

import TermsDialog from "./TermsDialog"

vi.mock("react-i18next", async () => import("../tests/__mocks__/i18n.js"))

const renderDialog = (props = {}) => {
  return render(
    <TermsDialog open onAccept={vi.fn()} title="Terms title" {...props}>
      <div>Terms content</div>
    </TermsDialog>,
  )
}

describe("TermsDialog", () => {
  test("does not render the dialog when closed", () => {
    renderDialog({ open: false })

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    expect(screen.queryByText("Terms title")).not.toBeInTheDocument()
    expect(screen.queryByText("Terms content")).not.toBeInTheDocument()
  })

  test("renders the title and children when open", async () => {
    renderDialog()

    expect(await screen.findByRole("dialog")).toBeInTheDocument()
    expect(screen.getByText("Terms title")).toBeInTheDocument()
    expect(screen.getByText("Terms content")).toBeInTheDocument()
  })

  test("renders only the accept button when onClose is not provided", async () => {
    renderDialog({ onClose: undefined })

    expect(
      await screen.findByRole("button", { name: "I_ACCEPT" }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole("button", { name: "I_DECLINE" }),
    ).not.toBeInTheDocument()
  })

  test("renders and calls decline when onClose is provided", async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()

    renderDialog({ onClose })

    await user.click(screen.getByRole("button", { name: "I_DECLINE" }))

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  test("calls onAccept when the accept button is clicked", async () => {
    const user = userEvent.setup()
    const onAccept = vi.fn()

    renderDialog({ onAccept })

    await user.click(screen.getByRole("button", { name: "I_ACCEPT" }))

    expect(onAccept).toHaveBeenCalledTimes(1)
  })

  test("renders a custom accept label", async () => {
    renderDialog({ acceptText: "CUSTOM_ACCEPT" })

    expect(
      await screen.findByRole("button", { name: "CUSTOM_ACCEPT" }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole("button", { name: "I_ACCEPT" }),
    ).not.toBeInTheDocument()
  })
})
