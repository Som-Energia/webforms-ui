import {
  fireEvent,
  queryByAttribute,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { vi } from "vitest"

import SomAutocompleteFloorInput from "./AutocompleteFloorInput"

const mockOptions = [
  { code: "GF", translation: "Ground Floor" },
  { code: "FF", translation: "First Floor" },
  { code: "SF", translation: "Second Floor" },
]

describe("AutocompleteFloorInput component ", () => {
  test("renders the hidden input with the provided field name and value", () => {
    const dom = render(
      <SomAutocompleteFloorInput
        fieldName="floor"
        value="GF"
        options={mockOptions}
        onChangeHandler={() => {}}
      />,
    )

    const getByName = queryByAttribute.bind(null, "name")
    const input = getByName(dom.container, "floor")
    expect(input).toBeInTheDocument()
    expect(input.value).toBe("GF")
  })

  test("shows the translated option label when the value matches a known code", () => {
    render(
      <SomAutocompleteFloorInput
        fieldName="floor"
        value="GF"
        options={mockOptions}
      />,
    )

    expect(screen.getByRole("combobox")).toHaveValue("Ground Floor")
  })

  test("keeps the raw value when the initial code has no matching option", () => {
    render(
      <SomAutocompleteFloorInput
        fieldName="floor"
        value="3-B"
        options={mockOptions}
      />,
    )

    expect(screen.getByRole("combobox")).toHaveValue("3-B")
  })

  test("calls onChangeHandler with the matching option code on blur", async () => {
    const mockOnChangeHandler = vi.fn()

    render(
      <SomAutocompleteFloorInput
        fieldName="floor"
        value="GF"
        options={mockOptions}
        onChangeHandler={mockOnChangeHandler}
      />,
    )

    const combobox = screen.getByRole("combobox")

    fireEvent.change(combobox, { target: { value: "Second Floor" } })
    fireEvent.blur(combobox)

    await waitFor(() => {
      expect(mockOnChangeHandler).toHaveBeenCalledWith({
        target: { name: "floor", value: "SF" },
      })
    })
  })

  test("forwards free text input when it is already acceptable", async () => {
    const mockOnChangeHandler = vi.fn()

    render(
      <SomAutocompleteFloorInput
        fieldName="floor"
        value="1"
        options={mockOptions}
        onChangeHandler={mockOnChangeHandler}
      />,
    )

    const input = screen.getByRole("combobox")

    fireEvent.change(input, { target: { value: "3" } })
    fireEvent.blur(input)

    await waitFor(() => {
      expect(mockOnChangeHandler).toHaveBeenCalledWith({
        target: { name: "floor", value: "3" },
      })
    })
  })

  test("sanitizes unsupported free text input before forwarding it", async () => {
    const mockOnChangeHandler = vi.fn()

    render(
      <SomAutocompleteFloorInput
        fieldName="floor"
        value="1"
        options={mockOptions}
        onChangeHandler={mockOnChangeHandler}
      />,
    )

    const input = screen.getByRole("combobox")

    fireEvent.change(input, { target: { value: "non_acceptable_text" } })
    fireEvent.blur(input)

    await waitFor(() => {
      expect(mockOnChangeHandler).toHaveBeenCalledWith({
        target: { name: "floor", value: "" },
      })
    })
  })

  test("preserves only numbers and hyphens from free text input", async () => {
    const mockOnChangeHandler = vi.fn()

    render(
      <SomAutocompleteFloorInput
        fieldName="floor"
        value=""
        options={mockOptions}
        onChangeHandler={mockOnChangeHandler}
      />,
    )

    const input = screen.getByRole("combobox")

    fireEvent.change(input, { target: { value: "3-B attic" } })
    fireEvent.blur(input)

    await waitFor(() => {
      expect(mockOnChangeHandler).toHaveBeenCalledWith({
        target: { name: "floor", value: "3-" },
      })
    })

    expect(input).toHaveValue("3-")
  })

  test("does not fail when blur fires without an explicit onChangeHandler", async () => {
    render(
      <SomAutocompleteFloorInput
        fieldName="floor"
        value="GF"
        options={mockOptions}
      />,
    )

    const input = screen.getByRole("combobox")

    fireEvent.change(input, { target: { value: "Ground Floor" } })
    fireEvent.blur(input)

    await waitFor(() => {
      expect(input).toHaveValue("Ground Floor")
    })
  })
})
