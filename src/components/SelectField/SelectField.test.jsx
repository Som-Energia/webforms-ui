import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { vi } from "vitest"

import SelectField from "./SelectField"

const mockOptionsArray = [
  { id: "1", name: "OPTION1" },
  { id: "2", name: "OPTION2" },
]

const mockOptionsObject = {
  3: "OPTION1",
  4: "OPTION2",
}

const renderComponent = (props = {}) => {
  return render(
    <SelectField
      fieldName="test-field"
      label="LABEL"
      options={[]}
      {...props}
    />,
  )
}

const openSelect = async () => {
  const user = userEvent.setup()
  const combobox = screen.getByRole("combobox", { name: "Without label" })

  await user.click(combobox)

  const listbox = within(screen.getByRole("presentation")).getByRole("listbox")
  const options = within(listbox).getAllByRole("option")

  return options.map((li) => li.getAttribute("data-value"))
}

describe("SelectField", () => {
  test("renders with an empty array of options", () => {
    renderComponent()

    expect(screen.getByText("LABEL")).toBeInTheDocument()
  })

  test("renders with an empty object of options", () => {
    renderComponent({ options: {} })

    expect(screen.getByText("LABEL")).toBeInTheDocument()
  })

  test("renders the expected array option values", async () => {
    renderComponent({ options: mockOptionsArray })

    const optionValues = await openSelect()
    const mockOptionsIds = mockOptionsArray.map((item) => item.id)

    expect(optionValues).toEqual(mockOptionsIds)
  })

  test("renders the expected object option values", async () => {
    renderComponent({ options: mockOptionsObject })

    const optionValues = await openSelect()

    const mockOptionsIds = Object.keys(mockOptionsObject)
    expect(mockOptionsIds).toEqual(optionValues)
  })

  test("shows the current selected value", () => {
    renderComponent({ options: mockOptionsArray, value: "2" })

    expect(
      screen.getByRole("combobox", { name: "Without label" }),
    ).toHaveTextContent("OPTION2")
  })

  test("marks the label as required when requested", () => {
    renderComponent({ required: true })

    expect(screen.getByText("LABEL")).toBeInTheDocument()
    expect(screen.getByText("*")).toBeInTheDocument()
  })

  test("disables the select when requested", () => {
    renderComponent({ disabled: true })

    expect(
      screen.getByRole("combobox", { name: "Without label" }),
    ).toHaveAttribute("aria-disabled", "true")
  })

  test("uses setFieldValue when provided without onChange", async () => {
    const user = userEvent.setup()
    const setFieldValue = vi.fn()

    renderComponent({ options: mockOptionsArray, setFieldValue })

    await user.click(screen.getByRole("combobox", { name: "Without label" }))
    await user.click(screen.getByRole("option", { name: "OPTION2" }))

    expect(setFieldValue).toHaveBeenCalledWith("test-field", "2")
  })

  test("uses onChange when provided", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const setFieldValue = vi.fn()

    renderComponent({ options: mockOptionsArray, onChange, setFieldValue })

    await user.click(screen.getByRole("combobox", { name: "Without label" }))
    await user.click(screen.getByRole("option", { name: "OPTION1" }))

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(setFieldValue).not.toHaveBeenCalled()
  })
})
