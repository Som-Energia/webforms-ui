import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, test, vi } from "vitest"

import ApiValidatedField from "./ApiValidatedField"

vi.mock("react-i18next", async () => import("../../tests/__mocks__/i18n.js"))

const createDeferred = () => {
  let resolve

  const promise = new Promise((res) => {
    resolve = res
  })

  return { promise, resolve }
}

const renderField = (props = {}) => {
  const defaultProps = {
    name: "api-validated-field",
    id: "api-validated-field",
    label: "API validated field",
    variant: "outlined",
    value: "",
    onChange: vi.fn(),
    onBlur: vi.fn(),
    error: false,
    helperText: "Helper text",
    localCheck: vi.fn((value) => ({ value, valid: true, error: undefined })),
  }

  const finalProps = { ...defaultProps, ...props }

  return {
    ...render(<ApiValidatedField {...finalProps} />),
    props: finalProps,
  }
}

describe("ApiValidatedField", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test("applies inputFilter and short-circuits empty values", () => {
    const inputFilter = vi.fn((value) => value.replace(/[^a-z]/gi, "").toUpperCase())
    const localCheck = vi.fn((value) => ({ value, valid: true, error: undefined }))
    const onChange = vi.fn()

    renderField({ inputFilter, localCheck, onChange })

    const input = screen.getByRole("textbox", { name: "API validated field" })

    fireEvent.change(input, { target: { value: "ab-12" } })

    expect(inputFilter).toHaveBeenCalledWith("ab-12")
    expect(localCheck).toHaveBeenCalledWith("AB")
    expect(onChange).toHaveBeenNthCalledWith(2, {
      value: "AB",
      valid: true,
      error: undefined,
    })

    fireEvent.change(input, { target: { value: "---" } })

    expect(localCheck).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenLastCalledWith({
      valueToCheck: "",
      valid: true,
      error: undefined,
    })
  })

  test("stops after a failing localCheck", () => {
    const localCheck = vi.fn(() => ({
      value: "bad",
      valid: false,
      error: "Invalid locally",
    }))
    const remoteCheck = vi.fn()
    const onChange = vi.fn()

    renderField({ localCheck, remoteCheck, onChange })

    fireEvent.change(screen.getByRole("textbox", { name: "API validated field" }), {
      target: { value: "bad" },
    })

    expect(remoteCheck).not.toHaveBeenCalled()
    expect(onChange).toHaveBeenNthCalledWith(2, {
      value: "bad",
      valid: false,
      error: "Invalid locally",
    })
  })

  test("shows checking state before resolving a remote validation", async () => {
    const deferred = createDeferred()
    const remoteCheck = vi.fn(() => deferred.promise)
    const onChange = vi.fn()

    renderField({ remoteCheck, onChange })

    fireEvent.change(screen.getByRole("textbox", { name: "API validated field" }), {
      target: { value: "abc" },
    })

    expect(remoteCheck).toHaveBeenCalledWith("abc")
    expect(onChange).toHaveBeenNthCalledWith(2, {
      value: "abc",
      valid: false,
      error: "API_VALIDATED_FIELD_CHECKING",
    })
    expect(screen.getByText("API_VALIDATED_FIELD_CHECKING")).toBeInTheDocument()
    expect(screen.getByRole("progressbar")).toBeInTheDocument()

    deferred.resolve({ value: "abc", valid: true, error: undefined })

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith({
        value: "abc",
        valid: true,
        error: undefined,
      })
    })

    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument()
    })
  })

  test("forwards onBlur and shows the success icon when value has no error", () => {
    const onBlur = vi.fn()

    renderField({ value: "abc", onBlur })

    const input = screen.getByRole("textbox", { name: "API validated field" })
    fireEvent.blur(input)

    expect(onBlur).toHaveBeenCalledTimes(1)
    expect(screen.getByTestId("CheckOutlinedIcon")).toBeInTheDocument()
  })

  test("renders a leading icon and hides the success icon when there is an error", () => {
    const LeadingIcon = () => <svg data-testid="leading-icon" />

    renderField({
      value: "abc",
      error: "Field error",
      leadingIcon: LeadingIcon,
    })

    expect(screen.getByTestId("leading-icon")).toBeInTheDocument()
    expect(screen.queryByTestId("CheckOutlinedIcon")).not.toBeInTheDocument()
  })

  test("re-validates when a new formatted prop value differs from the last checked value", () => {
    const inputFilter = vi.fn((value) => value.toUpperCase())
    const localCheck = vi.fn((value) => ({ value, valid: true, error: undefined }))

    const { rerender } = render(
      <ApiValidatedField
        name="api-validated-field"
        id="api-validated-field"
        label="API validated field"
        variant="outlined"
        value="ab"
        onChange={vi.fn()}
        onBlur={vi.fn()}
        error={false}
        helperText="Helper text"
        inputFilter={inputFilter}
        localCheck={localCheck}
      />,
    )

    expect(localCheck).toHaveBeenCalledTimes(1)
    expect(localCheck).toHaveBeenLastCalledWith("AB")

    rerender(
      <ApiValidatedField
        name="api-validated-field"
        id="api-validated-field"
        label="API validated field"
        variant="outlined"
        value="abc"
        onChange={vi.fn()}
        onBlur={vi.fn()}
        error={false}
        helperText="Helper text"
        inputFilter={inputFilter}
        localCheck={localCheck}
      />,
    )

    expect(localCheck).toHaveBeenCalledTimes(2)
    expect(localCheck).toHaveBeenLastCalledWith("ABC")
  })
})
