import {
  fireEvent,
  queryByAttribute,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { vi } from "vitest"

import { searchPlace } from "../services/googleApiClient"
import AddressAutocompletedField from "./AddressAutocompletedField"

vi.mock("react-i18next", async () => import("../tests/__mocks__/i18n.js"))

vi.mock("../services/googleApiClient", () => ({
  searchPlace: vi.fn().mockResolvedValue([]),
}))

describe("AddressAutocompletedField component", () => {
  afterEach(() => {
    vi.clearAllMocks()
    vi.clearAllTimers()
    vi.useRealTimers()
  })

  const defaultProps = {
    id: "supply_point_street",
    textFieldLabel: "Street label",
    textFieldName: "Street name",
    onChange: vi.fn(),
  }

  test("renders with the provided value and data-cy id", () => {
    const dom = render(
      <AddressAutocompletedField
        {...defaultProps}
        value={{ id: "street-id", street: "Abc" }}
      />,
    )

    const getByDataCy = queryByAttribute.bind(null, "data-cy")

    expect(getByDataCy(dom.container, defaultProps.id)).toBeInTheDocument()
    expect(screen.getByRole("combobox")).toHaveValue("Abc")
  })

  test("renders an empty combobox with the field label when value is missing", () => {
    render(<AddressAutocompletedField {...defaultProps} />)

    expect(screen.getByRole("combobox")).toHaveValue("")
    expect(screen.getByLabelText("Street label")).toBeInTheDocument()
  })

  test("syncs the input when the parent value changes to a text fallback", async () => {
    const { rerender } = render(
      <AddressAutocompletedField
        {...defaultProps}
        value={{ id: "street-id", street: "Ini" }}
      />,
    )

    rerender(
      <AddressAutocompletedField
        {...defaultProps}
        value={{ id: "text-id", text: "Txt" }}
      />,
    )

    await waitFor(() => {
      expect(screen.getByRole("combobox")).toHaveValue("Txt")
    })
  })

  test("calls onBlur and normalizes the street when blur changes the value", async () => {
    const onChange = vi.fn()
    const onBlur = vi.fn()

    render(
      <AddressAutocompletedField
        {...defaultProps}
        value={{ id: "street-id", street: "Abc" }}
        onChange={onChange}
        onBlur={onBlur}
      />,
    )

    const combobox = screen.getByRole("combobox")

    fireEvent.change(combobox, { target: { value: "Abd" } })
    fireEvent.blur(combobox)

    await waitFor(() => {
      expect(onBlur).toHaveBeenCalledTimes(1)
      expect(onChange).toHaveBeenCalledWith({
        id: null,
        street: "Abd",
      })
    })
  })

  test("keeps the selected address object intact when blur does not change the value", async () => {
    const onChange = vi.fn()
    const value = { id: "street-id", street: "Nou" }

    render(
      <AddressAutocompletedField
        {...defaultProps}
        value={value}
        onChange={onChange}
      />,
    )

    const combobox = screen.getByRole("combobox")

    fireEvent.change(combobox, { target: { value: "Nou" } })
    fireEvent.blur(combobox)

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(value)
    })
  })

  test("searches places only after the debounce when the query is longer than three characters", async () => {
    const sessionTokenRef = { current: "session-token" }

    render(
      <AddressAutocompletedField
        {...defaultProps}
        value={{ id: null, street: "" }}
        sessionTokenRef={sessionTokenRef}
      />,
    )

    const combobox = screen.getByRole("combobox")

    fireEvent.change(combobox, { target: { value: "abc" } })

    await new Promise((resolve) => setTimeout(resolve, 450))

    expect(searchPlace).not.toHaveBeenCalled()

    fireEvent.change(combobox, { target: { value: "Plaça Major" } })

    await waitFor(
      () => {
        expect(searchPlace).toHaveBeenCalledWith("Plaça Major", sessionTokenRef)
      },
      { timeout: 1500 },
    )
  })

  test("commits a free-solo string value on enter", async () => {
    const onChange = vi.fn()

    render(
      <AddressAutocompletedField
        {...defaultProps}
        value={{ id: null, street: "" }}
        onChange={onChange}
      />,
    )

    const combobox = screen.getByRole("combobox")

    fireEvent.change(combobox, { target: { value: "Free Solo Street" } })
    fireEvent.keyDown(combobox, { key: "Enter", code: "Enter" })

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith({
        id: null,
        street: "Free Solo Street",
      })
    })
  })

  test("selects a suggested option and normalizes street from text", async () => {
    const onChange = vi.fn()

    vi.mocked(searchPlace).mockResolvedValue([
      { id: "option-id", text: "Selected street" },
    ])

    render(
      <AddressAutocompletedField
        {...defaultProps}
        value={{ id: null, street: "" }}
        onChange={onChange}
      />,
    )

    const combobox = screen.getByRole("combobox")

    fireEvent.change(combobox, { target: { value: "Selected street" } })
    fireEvent.click(await screen.findByText("Selected street"))

    await waitFor(
      () => {
        expect(onChange).toHaveBeenCalledWith({
          id: "option-id",
          text: "Selected street",
          street: "Selected street",
        })
      },
      { timeout: 1500 },
    )
  })

  test("falls back to empty suggestions when the place search fails", async () => {
    vi.mocked(searchPlace).mockRejectedValue(new Error("network"))

    render(
      <AddressAutocompletedField
        {...defaultProps}
        value={{ id: null, street: "" }}
      />,
    )

    const combobox = screen.getByRole("combobox")

    fireEvent.change(combobox, { target: { value: "Broken street" } })

    await waitFor(
      () => {
        expect(searchPlace).toHaveBeenCalledWith("Broken street", undefined)
      },
      { timeout: 1500 },
    )

    expect(screen.queryByRole("option")).not.toBeInTheDocument()
  })

  test("clears the current value from the clear indicator", async () => {
    const onChange = vi.fn()

    render(
      <AddressAutocompletedField
        {...defaultProps}
        value={{ id: "street-id", street: "Abc" }}
        onChange={onChange}
      />,
    )

    fireEvent.click(screen.getByLabelText(/clear/i))

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(null)
    })

    await waitFor(() => {
      expect(screen.getByRole("combobox")).toHaveValue("")
    })
  })

  test("renders the translated error when touched", () => {
    render(
      <AddressAutocompletedField
        {...defaultProps}
        value={{ id: null, street: "" }}
        error="REQUIRED_FIELD"
        touched
      />,
    )

    expect(screen.getByText("REQUIRED_FIELD")).toBeInTheDocument()
  })
})
