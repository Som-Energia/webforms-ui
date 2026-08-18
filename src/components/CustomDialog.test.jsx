import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test, vi } from "vitest"

import PopUpContext from "../context/PopUpContext"
import CustomDialog, { customStyles } from "./CustomDialog"

const renderDialog = (props = {}, contextValue = { setContent: vi.fn() }) => {
  return {
    setContent: contextValue.setContent,
    ...render(
      <PopUpContext.Provider value={contextValue}>
        <CustomDialog {...props} />
      </PopUpContext.Provider>,
    ),
  }
}

describe("CustomDialog", () => {
  test("does not render an open dialog when children are not provided", () => {
    renderDialog()

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  test("renders its children inside the dialog when content is provided", () => {
    renderDialog({ children: <div>Dialog content</div> })

    expect(screen.getByRole("dialog")).toBeInTheDocument()
    expect(screen.getByText("Dialog content")).toBeInTheDocument()
  })

  test("clears the popup content when closing the dialog by escape", async () => {
    const user = userEvent.setup()
    const { setContent } = renderDialog({ children: <div>Dialog content</div> })

    await user.keyboard("{Escape}")

    expect(setContent).toHaveBeenCalledWith(undefined)
  })

  test("does not clear the popup content when closing is blocked", async () => {
    const user = userEvent.setup()
    const { setContent } = renderDialog({
      children: <div>Dialog content</div>,
      blockHandleClose: true,
    })

    await user.keyboard("{Escape}")

    expect(setContent).not.toHaveBeenCalled()
  })

  test("applies the background and additional paper styles", () => {
    renderDialog({
      children: <div>Dialog content</div>,
      withBackground: true,
      paperStyles: { width: "480px" },
    })

    expect(screen.getByRole("dialog")).toHaveStyle({
      position: "absolute",
      top: "0px",
      width: "480px",
    })
  })

  test("returns transparent paper styles when background is disabled", () => {
    expect(customStyles(false)).toEqual({
      sx: {
        position: "absolute",
        top: 0,
        backgroundColor: "transparent",
      },
    })

    expect(customStyles(true, { width: "480px" })).toEqual({
      sx: {
        position: "absolute",
        top: 0,
        backgroundColor: "white",
        width: "480px",
      },
    })
  })
})
