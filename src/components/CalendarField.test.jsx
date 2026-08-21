import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import dayjs from "dayjs"
import { useState } from "react"
import { vi } from "vitest"

import CalendarField from "./CalendarField"

vi.mock("react-i18next", async () => {
  const actual = await import("../tests/__mocks__/i18n.js")
  const translation = actual.useTranslation()

  return {
    ...actual,
    useTranslation: () => ({
      ...translation,
      i18n: {
        ...translation.i18n,
        language: "es",
      },
    }),
  }
})

const buildProps = (overrides = {}) => ({
  textFieldName: "BIRTHDATE",
  handleChange: vi.fn(),
  value: null,
  required: false,
  ...overrides,
})

const renderCalendarField = (overrides = {}) => {
  const props = buildProps(overrides)
  const result = render(<CalendarField {...props} />)

  return {
    ...result,
    props,
  }
}

const ControlledCalendarField = ({ onChange = vi.fn(), required = false }) => {
  const [value, setValue] = useState(null)

  const handleChange = (nextValue, context) => {
    setValue(nextValue)
    onChange(nextValue, context)
  }

  return (
    <CalendarField
      textFieldName="BIRTHDATE"
      required={required}
      value={value}
      handleChange={handleChange}
    />
  )
}

const getInput = () => screen.getByRole("textbox")

describe("CalendarField", () => {
  test("renders the title and required marker", () => {
    renderCalendarField({ required: true })

    expect(screen.getByText("BIRTHDATE")).toBeInTheDocument()
    expect(screen.getByText("*")).toBeInTheDocument()
    expect(getInput()).toBeInTheDocument()
  })

  test("forwards valid date changes through the rendered input", async () => {
    const handleChange = vi.fn()

    render(<ControlledCalendarField onChange={handleChange} />)

    const input = getInput()

    fireEvent.change(input, { target: { value: "01/02/2026" } })
    fireEvent.blur(input)

    await waitFor(() => {
      expect(handleChange).toHaveBeenCalled()
    })

    expect(input).toHaveValue("01/02/2026")

    const lastCall = handleChange.mock.calls.at(-1)
    expect(dayjs.isDayjs(lastCall[0])).toBe(true)
    expect(lastCall[0].format("YYYY-MM-DD")).toBe("2026-02-01")
  })

  test("surfaces an observable error state after blur with an invalid value", async () => {
    render(<ControlledCalendarField />)

    const input = getInput()

    fireEvent.change(input, { target: { value: "99/99/9999" } })
    fireEvent.blur(input)

    await waitFor(() => {
      expect(input).toHaveAttribute("aria-invalid", "true")
    })
  })
})
