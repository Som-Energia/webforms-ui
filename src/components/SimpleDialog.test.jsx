import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test, vi } from "vitest"

import PopUpContext from "../context/PopUpContext"
import SimpleDialog from "./SimpleDialog"

vi.mock("react-i18next", async () => import("../tests/__mocks__/i18n.js"))

const renderDialog = (props = {}) => {
  return render(
    <PopUpContext.Provider value={{ setContent: vi.fn() }}>
      <SimpleDialog {...props} />
    </PopUpContext.Provider>,
  )
}

describe("SimpleDialog", () => {
  test("renders the dialog title and text", async () => {
    renderDialog({ title: "Dialog title", text: "Dialog body" })

    expect(await screen.findByRole("dialog")).toBeInTheDocument()
    expect(await screen.findByText("Dialog title")).toBeInTheDocument()
    expect(await screen.findByText("Dialog body")).toBeInTheDocument()
  })

  test("renders only the accept button when only acceptFunction is provided", async () => {
    renderDialog({
      title: "Dialog title",
      text: "Dialog body",
      acceptFunction: vi.fn(),
    })

    expect(
      await screen.findByRole("button", {
        name: "GENERATION_ADD_CONTRACT_LIST_ACCEPT",
      }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole("button", {
        name: "GENERATION_ADD_CONTRACT_LIST_CANCEL",
      }),
    ).not.toBeInTheDocument()
  })

  test("renders only the cancel button when only cancelFunction is provided", async () => {
    renderDialog({
      title: "Dialog title",
      text: "Dialog body",
      cancelFunction: vi.fn(),
    })

    expect(
      await screen.findByRole("button", {
        name: "GENERATION_ADD_CONTRACT_LIST_CANCEL",
      }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole("button", {
        name: "GENERATION_ADD_CONTRACT_LIST_ACCEPT",
      }),
    ).not.toBeInTheDocument()
  })

  test("calls acceptFunction when the accept button is clicked", async () => {
    const user = userEvent.setup()
    const acceptFunction = vi.fn()

    renderDialog({
      title: "Dialog title",
      text: "Dialog body",
      acceptFunction,
    })

    await user.click(
      screen.getByRole("button", {
        name: "GENERATION_ADD_CONTRACT_LIST_ACCEPT",
      }),
    )

    expect(acceptFunction).toHaveBeenCalledTimes(1)
  })

  test("calls cancelFunction when the cancel button is clicked", async () => {
    const user = userEvent.setup()
    const cancelFunction = vi.fn()

    renderDialog({
      title: "Dialog title",
      text: "Dialog body",
      cancelFunction,
    })

    await user.click(
      screen.getByRole("button", {
        name: "GENERATION_ADD_CONTRACT_LIST_CANCEL",
      }),
    )

    expect(cancelFunction).toHaveBeenCalledTimes(1)
  })

  test("renders both action buttons when both callbacks are provided", async () => {
    renderDialog({
      title: "Dialog title",
      text: "Dialog body",
      acceptFunction: vi.fn(),
      cancelFunction: vi.fn(),
    })

    expect(
      await screen.findByRole("button", {
        name: "GENERATION_ADD_CONTRACT_LIST_ACCEPT",
      }),
    ).toBeInTheDocument()
    expect(
      await screen.findByRole("button", {
        name: "GENERATION_ADD_CONTRACT_LIST_CANCEL",
      }),
    ).toBeInTheDocument()
  })
})
