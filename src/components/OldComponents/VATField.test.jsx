import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, test, vi } from "vitest"

import { checkVat } from "../../services/api"
import VATField from "./VATField"

vi.mock("../../services/api", () => ({
  checkVat: vi.fn(),
}))

const createDeferred = () => {
  let resolve
  let reject

  const promise = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })

  return { promise, resolve, reject }
}

const renderField = (props = {}) => {
  const defaultProps = {
    name: "vat",
    id: "vat",
    label: "VAT",
    variant: "outlined",
    value: "",
    onChange: vi.fn(),
    isVatTouched: false,
    error: false,
    helperText: "Helper text",
    setFieldTouched: vi.fn(),
  }

  const finalProps = { ...defaultProps, ...props }

  return {
    ...render(<VATField {...finalProps} />),
    props: finalProps,
  }
}

describe("VATField", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test("renders the label and helper text", () => {
    renderField()

    expect(screen.getByRole("textbox", { name: "VAT" })).toBeInTheDocument()
    expect(screen.getByText("Helper text")).toBeInTheDocument()
  })

  test("marks the field as touched on the first change", () => {
    const { props } = renderField()

    fireEvent.change(screen.getByRole("textbox", { name: "VAT" }), {
      target: { value: "1234" },
    })

    expect(props.setFieldTouched).toHaveBeenCalledWith("vat", true)
  })

  test("sanitizes and truncates the VAT before validating it", async () => {
    vi.mocked(checkVat).mockResolvedValue({ data: { valid: true } })

    renderField()

    fireEvent.change(screen.getByRole("textbox", { name: "VAT" }), {
      target: { value: "ab12cd34ef56z" },
    })

    await waitFor(() => {
      expect(checkVat).toHaveBeenCalledWith("AB12CD34EF56")
    })
  })

  test("shows a loading indicator while validating a VAT", () => {
    const deferred = createDeferred()
    vi.mocked(checkVat).mockReturnValue(deferred.promise)

    renderField({ value: "12345678Z", isVatTouched: true })

    expect(screen.getByRole("progressbar")).toBeInTheDocument()
    expect(screen.queryByText("Helper text")).not.toBeInTheDocument()
  })

  test("reports a valid physical VAT after a successful validation", async () => {
    const onChange = vi.fn()
    vi.mocked(checkVat).mockResolvedValue({
      data: { valid: true, is_member: true, exists: false },
    })

    renderField({
      value: "12345678Z",
      isVatTouched: true,
      onChange,
    })

    await waitFor(() => {
      expect(onChange).toHaveBeenLastCalledWith({
        vat: "12345678Z",
        isPhisical: true,
        isMember: true,
        valid: true,
        exists: false,
      })
    })

    expect(screen.getByTestId("CheckIcon")).toBeInTheDocument()
  })

  test("shows an error icon when the VAT is not valid", async () => {
    vi.mocked(checkVat).mockResolvedValue({
      data: { valid: false, is_member: false, exists: true },
    })

    renderField({ value: "B12345678", isVatTouched: true })

    await waitFor(() => {
      expect(screen.getByTestId("ClearIcon")).toBeInTheDocument()
    })
  })

  test("reports an invalid VAT when the API request fails", async () => {
    const onChange = vi.fn()
    vi.mocked(checkVat).mockRejectedValue(new Error("request failed"))

    renderField({
      value: "B12345678",
      isVatTouched: true,
      onChange,
    })

    await waitFor(() => {
      expect(onChange).toHaveBeenLastCalledWith({
        vat: "B12345678",
        isPhisical: false,
        valid: false,
      })
    })

    expect(screen.getByTestId("ClearIcon")).toBeInTheDocument()
  })
})
