import {
  fireEvent,
  queryByAttribute,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { vi } from "vitest"

import AddressAutocompletedFieldGurb from "./AddressAutocompletedFieldGurb"
import { searchPlace } from "../../../../services/googleApiClient"

vi.mock(
  "react-i18next",
  async () => import("../../../../tests/__mocks__/i18n.js"),
)

vi.mock("../../../../services/googleApiClient", () => ({
  searchPlace: vi.fn().mockResolvedValue([]),
}))

describe("AddressAutocompletedFieldGurb component", () => {
  afterEach(() => {
    vi.clearAllMocks()
    vi.clearAllTimers()
    vi.useRealTimers()
  })

  // Keep non-search fixture strings at 3 chars or fewer so the component's
  // debounced search effect does not schedule stray searchPlace calls and leak
  // into tests that are not asserting autocomplete lookups.

  test("renders with the provided value", () => {
    const dom = render(<AddressAutocompletedFieldGurb value="ABC" />)

    const getByDataCy = queryByAttribute.bind(null, "data-cy")
    const input = getByDataCy(dom.container, "street")

    expect(input).toBeInTheDocument()
    expect(screen.getByRole("combobox")).toHaveValue("ABC")
  })

  test("renders an empty combobox when value is missing", () => {
    render(<AddressAutocompletedFieldGurb onChange={vi.fn()} />)

    expect(screen.getByRole("combobox")).toHaveValue("")
  })

  test("uses the text fallback when the selected value object has no street", () => {
    render(
      <AddressAutocompletedFieldGurb
        value={{ id: "text-id", text: "Txt" }}
        onBlur={null}
      />,
    )

    const combobox = screen.getByRole("combobox")

    expect(combobox).toHaveValue("Txt")

    fireEvent.focus(combobox)
    fireEvent.blur(combobox)
  })

  test("calls onChange with a normalized street when blur changes the value", async () => {
    const mockOnChange = vi.fn()

    render(
      <AddressAutocompletedFieldGurb value="ABC" onChange={mockOnChange} />,
    )

    const combobox = screen.getByRole("combobox")

    fireEvent.change(combobox, {
      target: { value: "ABD" },
    })
    fireEvent.blur(combobox)

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith({
        id: null,
        street: "ABD",
      })
    })
  })

  test("does not reset the id on blur when the value did not change", async () => {
    const mockOnChange = vi.fn()

    render(
      <AddressAutocompletedFieldGurb
        value={{ id: "saved-id", street: "Nou" }}
        onChange={mockOnChange}
      />,
    )

    const combobox = screen.getByRole("combobox")

    fireEvent.change(combobox, { target: { value: "Nou" } })
    fireEvent.blur(combobox)

    await waitFor(() => {
      expect(mockOnChange).not.toHaveBeenCalled()
    })
  })

  test("searches places only after the debounce when the query is long enough", async () => {
    const sessionTokenRef = { current: "session-token" }
    vi.mocked(searchPlace).mockClear()

    render(
      <AddressAutocompletedFieldGurb
        value=""
        onChange={vi.fn()}
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
    const mockOnChange = vi.fn()

    render(<AddressAutocompletedFieldGurb value="" onChange={mockOnChange} />)

    const combobox = screen.getByRole("combobox")

    fireEvent.change(combobox, { target: { value: "XYZ" } })
    fireEvent.keyDown(combobox, { key: "Enter", code: "Enter" })

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith({
        id: null,
        street: "XYZ",
      })
    })
  })

  test("selects a suggested option with its normalized street", async () => {
    const mockOnChange = vi.fn()

    vi.mocked(searchPlace).mockResolvedValue([
      { id: "opt-1", text: "Option text" },
    ])

    render(<AddressAutocompletedFieldGurb value="" onChange={mockOnChange} />)

    const combobox = screen.getByRole("combobox")

    fireEvent.change(combobox, { target: { value: "Option text" } })

    fireEvent.click(await screen.findByText("Option text"))

    await waitFor(
      () => {
        expect(mockOnChange).toHaveBeenCalledWith({
          id: "opt-1",
          text: "Option text",
          street: "Option text",
        })
      },
      { timeout: 1500 },
    )
  })

  test("falls back to empty suggestions when the place search fails", async () => {
    vi.mocked(searchPlace).mockRejectedValue(new Error("network"))

    render(<AddressAutocompletedFieldGurb value="" onChange={vi.fn()} />)

    const combobox = screen.getByRole("combobox")

    fireEvent.change(combobox, { target: { value: "Plaça Major" } })

    await waitFor(
      () => {
        expect(searchPlace).toHaveBeenCalledWith("Plaça Major", undefined)
      },
      { timeout: 1500 },
    )

    expect(screen.queryByText("Option text")).not.toBeInTheDocument()
  })

  test("clears the current value from the clear indicator", async () => {
    const mockOnChange = vi.fn()

    render(
      <AddressAutocompletedFieldGurb value="ABC" onChange={mockOnChange} />,
    )

    fireEvent.click(screen.getByLabelText(/clear/i))

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith(null)
    })

    await waitFor(() => {
      expect(screen.getByRole("combobox")).toHaveValue("")
    })
  })

  test("renders the translated error and syncs when the parent value changes", async () => {
    const { rerender } = render(
      <AddressAutocompletedFieldGurb
        value="Ini"
        error="REQUIRED_FIELD"
        helperText="Helper"
        touched
      />,
    )

    expect(screen.getByText("REQUIRED_FIELD")).toBeInTheDocument()

    rerender(
      <AddressAutocompletedFieldGurb
        value={{ id: "next-id", text: "Updated street" }}
        error="REQUIRED_FIELD"
        helperText="Helper"
        touched
      />,
    )

    await waitFor(() => {
      expect(screen.getByRole("combobox")).toHaveValue("Updated street")
    })
  })
})
