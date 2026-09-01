import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, test, vi } from "vitest"

import Uploader from "./Uploader"

vi.mock("react-i18next", async () => import("../../tests/__mocks__/i18n.js"))

const apiMocks = vi.hoisted(() => ({
  uploadFile: vi.fn(),
}))

vi.mock("../../services/api", () => ({
  uploadFile: apiMocks.uploadFile,
}))

const renderUploader = (props = {}) => {
  const callbackFn = vi.fn()

  const view = render(
    <Uploader callbackFn={callbackFn} values={[]} maxFiles={3} {...props} />,
  )

  return { ...view, callbackFn }
}

describe("OldComponents/Uploader", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test("renders existing uploaded values, helper text and calls callbackFn with initial values", () => {
    const values = ["hash-1", "hash-2"]
    const callbackFn = vi.fn()

    render(<Uploader callbackFn={callbackFn} values={values} maxFiles={3} />)

    expect(
      screen.getByText("INSTALL_TYPE_ATTACHMENTS_INFO"),
    ).toBeInTheDocument()
    expect(screen.getByText("hash-1")).toBeInTheDocument()
    expect(screen.getByText("hash-2")).toBeInTheDocument()
    expect(callbackFn).toHaveBeenCalledWith(values)
  })

  test("uploads one file successfully and appends the returned file hash", async () => {
    apiMocks.uploadFile.mockResolvedValue({
      data: { code: "UPLOAD_OK", file_hash: "hash-3" },
    })

    const file = new File(["pdf"], "invoice.pdf", { type: "application/pdf" })
    const { container, callbackFn } = renderUploader({ values: ["hash-1"] })
    const input = container.querySelector('input[type="file"]')

    fireEvent.change(input, {
      target: { name: input.name, files: [file] },
    })

    await waitFor(() => {
      expect(apiMocks.uploadFile).toHaveBeenCalledWith(input.name, file)
    })

    expect(await screen.findByText("hash-3")).toBeInTheDocument()
    expect(callbackFn).toHaveBeenLastCalledWith(["hash-1", "hash-3"])
  })

  test("shows the translated error when the API resolves with a non-UPLOAD_OK code", async () => {
    apiMocks.uploadFile.mockResolvedValue({
      data: { code: "INVALID_FILETYPE" },
    })

    const file = new File(["image"], "photo.png", { type: "image/png" })
    const { container } = renderUploader()
    const input = container.querySelector('input[type="file"]')

    fireEvent.change(input, {
      target: { name: input.name, files: [file] },
    })

    expect(await screen.findByText("INVALID_FILETYPE")).toBeInTheDocument()
  })

  test("shows the translated error when the API request rejects", async () => {
    apiMocks.uploadFile.mockRejectedValue({
      response: { data: { code: "INVALID_FILETYPE" } },
    })

    const file = new File(["image"], "photo.png", { type: "image/png" })
    const { container } = renderUploader()
    const input = container.querySelector('input[type="file"]')

    fireEvent.change(input, {
      target: { name: input.name, files: [file] },
    })

    expect(await screen.findByText("INVALID_FILETYPE")).toBeInTheDocument()
  })

  test("clears the error state when the clear icon is clicked", async () => {
    const user = userEvent.setup()

    apiMocks.uploadFile.mockResolvedValue({
      data: { code: "INVALID_FILETYPE" },
    })

    const file = new File(["image"], "photo.png", { type: "image/png" })
    const { container } = renderUploader()
    const input = container.querySelector('input[type="file"]')

    fireEvent.change(input, {
      target: { name: input.name, files: [file] },
    })

    expect(await screen.findByText("INVALID_FILETYPE")).toBeInTheDocument()

    await user.click(screen.getByTestId("HighlightOffIcon").closest("button"))

    await waitFor(() => {
      expect(
        screen.getByText("INSTALL_TYPE_ATTACHMENTS_INFO"),
      ).toBeInTheDocument()
    })
    expect(screen.queryByText("INVALID_FILETYPE")).not.toBeInTheDocument()
  })

  test("deletes an uploaded item and propagates the new list", async () => {
    const user = userEvent.setup()
    const callbackFn = vi.fn()

    render(
      <Uploader
        callbackFn={callbackFn}
        values={["hash-1", "hash-2"]}
        maxFiles={3}
      />,
    )

    await user.click(screen.getAllByRole("button", { name: "delete" })[0])

    expect(screen.queryByText("hash-1")).not.toBeInTheDocument()
    expect(screen.getByText("hash-2")).toBeInTheDocument()
    expect(callbackFn).toHaveBeenLastCalledWith(["hash-2"])
  })

  test("disables the file input when uploads reach maxFiles", () => {
    const { container } = renderUploader({
      values: ["hash-1", "hash-2"],
      maxFiles: 2,
    })
    const input = container.querySelector('input[type="file"]')

    expect(input).toBeDisabled()
  })
})
