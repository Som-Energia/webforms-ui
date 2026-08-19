import { fireEvent, render, screen } from "@testing-library/react"
import { vi } from "vitest"

import InputField from "./InputField"

vi.mock("react-i18next", async () => import("../../tests/__mocks__/i18n.js"))

describe("InputField component", () => {
  test("renders the input using the provided name", () => {
    render(<InputField name="NAME" />)

    expect(document.querySelector('[data-cy="NAME"]')).toBeInTheDocument()
  })

  test("renders the field title and helper texts", () => {
    render(
      <InputField
        textFieldName="FIELD NAME"
        textFieldNameHelper="FIELD NAME HELPER"
        textFieldHelper="TEXTFIELDHELPER"
      />,
    )

    expect(screen.getByText("FIELD NAME")).toBeInTheDocument()
    expect(screen.getByText("FIELD NAME HELPER")).toBeInTheDocument()
    expect(screen.getByText("TEXTFIELDHELPER")).toBeInTheDocument()
  })

  test("renders the required field character", () => {
    render(<InputField required={true} textFieldName="FIELD NAME" />)

    expect(screen.getByText("*")).toBeInTheDocument()
  })

  test("renders the translated error when touched", async () => {
    render(<InputField name="NAME" error="ERROR" touched={true} />)

    const error = await screen.findByText("ERROR")
    expect(error).toBeInTheDocument()
  })

  test("does not render the error when not touched", () => {
    render(<InputField name="NAME" error="ERROR" touched={false} />)

    expect(screen.queryByText("ERROR")).not.toBeInTheDocument()
  })

  test("renders the info helper icon when requested", () => {
    render(<InputField textFieldHelper="TEXTFIELDHELPER" iconHelper />)

    expect(screen.getByTestId("InfoOutlinedIcon")).toBeInTheDocument()
  })

  test("renders the loading indicator while loading", () => {
    render(
      <InputField
        textFieldHelper="TEXTFIELDHELPER"
        touched={true}
        isLoading
        value="abc"
      />,
    )

    expect(screen.getByRole("progressbar")).toBeInTheDocument()
    expect(screen.getByText("TEXTFIELDHELPER")).toBeInTheDocument()
  })

  test("renders the start adornment only when there are multiple inputs", () => {
    const { rerender } = render(
      <InputField startAdornmentText="+34" numInputs={2} value="abc" />,
    )

    expect(screen.getByText("+34")).toBeInTheDocument()

    rerender(<InputField startAdornmentText="+34" numInputs={1} value="abc" />)

    expect(screen.queryByText("+34")).not.toBeInTheDocument()
  })

  test("renders the end adornment text when not loading", () => {
    render(<InputField endAdornmentText={<span>kWh</span>} value="abc" />)

    expect(screen.getByText("kWh")).toBeInTheDocument()
  })

  test("disables the input when readonlyField is enabled", () => {
    render(<InputField name="NAME" textFieldLabel="LABEL" readonlyField />)

    expect(screen.getByRole("textbox", { name: "LABEL" })).toBeDisabled()
  })

  test("forwards onChange, onBlur and onPaste to the input", () => {
    const handleChange = vi.fn()
    const handleBlur = vi.fn()
    const onPaste = vi.fn()

    render(
      <InputField
        name="NAME"
        textFieldLabel="LABEL"
        handleChange={handleChange}
        handleBlur={handleBlur}
        onPaste={onPaste}
      />,
    )

    const input = screen.getByRole("textbox", { name: "LABEL" })

    fireEvent.change(input, { target: { value: "abc" } })
    fireEvent.blur(input)
    fireEvent.paste(input)

    expect(handleChange).toHaveBeenCalledTimes(1)
    expect(handleBlur).toHaveBeenCalledTimes(1)
    expect(onPaste).toHaveBeenCalledTimes(1)
  })

  test("hides the text field label when there is already a value", () => {
    render(<InputField name="NAME" textFieldLabel="LABEL" value="abc" />)

    expect(screen.queryByText("LABEL")).not.toBeInTheDocument()
  })

  test("renders custom children instead of the default text field", () => {
    const { getByTestId } = render(
      <InputField name="NAME" label="LABEL">
        <div data-testid="children1">CHILDREN NODE</div>
      </InputField>,
    )

    const children = getByTestId("children1")
    expect(children).toBeInTheDocument()
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument()
  })
})
