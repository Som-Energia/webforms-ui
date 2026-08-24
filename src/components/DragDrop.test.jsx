import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, test, vi } from "vitest"

import DragDrop from "./DragDrop"

vi.mock("react-i18next", async () => import("../tests/__mocks__/i18n.js"))

const apiMocks = vi.hoisted(() => ({
  uploadFile: vi.fn(),
}))

vi.mock("../services/api", () => ({
  uploadFile: apiMocks.uploadFile,
}))

const renderComponent = (props = {}) => {
  const onChange = vi.fn()

  const view = render(
    <DragDrop
      fieldName="Attachments"
      required
      values={[]}
      onChange={onChange}
      {...props}
    />,
  )

  return { ...view, onChange }
}

describe("DragDrop", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test("renders the title, helper texts and existing uploads", () => {
    const values = [{ filename: "contract.pdf", filehash: "hash-1" }]
    const onChange = vi.fn()

    render(
      <DragDrop
        fieldName="Attachments"
        required
        values={values}
        onChange={onChange}
      />,
    )

    expect(screen.getByText("Attachments")).toBeInTheDocument()
    expect(screen.getByText("*")).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "CLICK_HERE" }),
    ).toBeInTheDocument()
    expect(screen.getByText("DRAG_AND_DROP_HERE")).toBeInTheDocument()
    expect(screen.getByText("TYPE_OF_FILES")).toBeInTheDocument()
    expect(screen.getByText("contract.pdf")).toBeInTheDocument()
    expect(onChange).toHaveBeenCalledWith(values)
  })

  test("removes an uploaded file when delete is clicked", async () => {
    const user = userEvent.setup()
    const values = [{ filename: "contract.pdf", filehash: "hash-1" }]
    const onChange = vi.fn()

    render(
      <DragDrop fieldName="Attachments" values={values} onChange={onChange} />,
    )

    await user.click(screen.getByRole("button", { name: "delete" }))

    expect(screen.queryByText("contract.pdf")).not.toBeInTheDocument()
    expect(onChange).toHaveBeenLastCalledWith([])
  })

  test("opens the hidden file input when the link is clicked", async () => {
    const user = userEvent.setup()
    const { container } = renderComponent()
    const input = container.querySelector('input[type="file"]')
    const clickSpy = vi.spyOn(input, "click")

    await user.click(screen.getByRole("button", { name: "CLICK_HERE" }))

    expect(clickSpy).toHaveBeenCalledTimes(1)
  })

  test("uploads a valid file selected from the hidden input", async () => {
    apiMocks.uploadFile.mockResolvedValue({
      data: { code: "UPLOAD_OK", file_hash: "hash-2" },
    })

    const file = new File(["pdf"], "invoice.pdf", { type: "application/pdf" })
    const { container, onChange } = renderComponent()
    const input = container.querySelector('input[type="file"]')

    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(() => {
      expect(apiMocks.uploadFile).toHaveBeenCalledWith("invoice.pdf", file)
    })

    expect(await screen.findByText("invoice.pdf")).toBeInTheDocument()
    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
    expect(onChange).toHaveBeenLastCalledWith([
      { filename: "invoice.pdf", filehash: "hash-2" },
    ])
  })

  test("shows an error and skips upload for an invalid selected file type", () => {
    const file = new File(["text"], "notes.txt", { type: "text/plain" })
    const { container, onChange } = renderComponent()
    const input = container.querySelector('input[type="file"]')

    fireEvent.change(input, { target: { files: [file] } })

    expect(screen.getByRole("alert")).toHaveTextContent("INVALID_FILETYPE")
    expect(apiMocks.uploadFile).not.toHaveBeenCalled()
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  test("shows the translated upload error returned by the API", async () => {
    apiMocks.uploadFile.mockResolvedValue({
      data: { code: "INVALID_FILETYPE" },
    })

    const file = new File(["image"], "photo.png", { type: "image/png" })
    const { container } = renderComponent()
    const input = container.querySelector('input[type="file"]')

    fireEvent.change(input, { target: { files: [file] } })

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "INVALID_FILETYPE",
    )
  })

  test("shows the translated upload error when the API request rejects", async () => {
    apiMocks.uploadFile.mockRejectedValue({
      response: { data: { code: "INVALID_FILETYPE" } },
    })

    const file = new File(["image"], "photo.png", { type: "image/png" })
    const { container } = renderComponent()
    const input = container.querySelector('input[type="file"]')

    fireEvent.change(input, { target: { files: [file] } })

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "INVALID_FILETYPE",
    )
  })

  test("shows the drag state and uploads a valid dropped file", async () => {
    apiMocks.uploadFile.mockResolvedValue({
      data: { code: "UPLOAD_OK", file_hash: "hash-3" },
    })

    const file = new File(["image"], "photo.png", { type: "image/png" })
    const clearData = vi.fn()
    const { container, onChange } = renderComponent({
      values: [{ filename: "contract.pdf", filehash: "hash-1" }],
    })
    const dropZone = container.querySelector(".MuiCard-root")

    fireEvent.dragEnter(dropZone, {
      dataTransfer: { items: [{ kind: "file", type: file.type }] },
    })

    expect(await screen.findByTestId("UploadFileIcon")).toBeInTheDocument()

    fireEvent.drop(dropZone, {
      dataTransfer: {
        files: [file],
        items: [{ kind: "file", type: file.type }],
        clearData,
      },
    })

    await waitFor(() => {
      expect(apiMocks.uploadFile).toHaveBeenCalledWith("photo.png", file)
    })

    expect(clearData).toHaveBeenCalledTimes(1)
    expect(await screen.findByText("photo.png")).toBeInTheDocument()
    expect(screen.queryByTestId("UploadFileIcon")).not.toBeInTheDocument()
    expect(onChange).toHaveBeenLastCalledWith([
      { filename: "contract.pdf", filehash: "hash-1" },
      { filename: "photo.png", filehash: "hash-3" },
    ])
  })

  test("shows an error and skips upload for an invalid dropped file type", async () => {
    const file = new File(["text"], "notes.txt", { type: "text/plain" })
    const clearData = vi.fn()
    const { container } = renderComponent()
    const dropZone = container.querySelector(".MuiCard-root")

    fireEvent.drop(dropZone, {
      dataTransfer: {
        files: [file],
        items: [{ kind: "file", type: file.type }],
        clearData,
      },
    })

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "INVALID_FILETYPE",
    )
    expect(apiMocks.uploadFile).not.toHaveBeenCalled()
    expect(clearData).not.toHaveBeenCalled()
  })
})
