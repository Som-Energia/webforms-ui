import { fireEvent, render, screen } from "@testing-library/react"
import { vi } from "vitest"

import PowerInputs from "./PowerInputs"

vi.mock("react-i18next", async () => import("../tests/__mocks__/i18n.js"))

const buildProps = (overrides = {}) => ({
  name: "contract.power",
  values: {
    power1: "",
    power2: "",
  },
  handleBlur: vi.fn(),
  errors: {},
  touched: { power: {} },
  setFieldValue: vi.fn(),
  has_light: "light-off",
  ...overrides,
})

const getInput = (name) => document.querySelector(`[data-cy="${name}-input"]`)

describe("PowerInputs", () => {
  test("renders the peak and valley labels with their adornments for the default two-input flow", () => {
    render(<PowerInputs {...buildProps()} />)

    expect(screen.getByText("WHICH_PEAK")).toBeInTheDocument()
    expect(screen.getByText("WHICH_VALLEY")).toBeInTheDocument()
    expect(screen.getByText("PEAK")).toBeInTheDocument()
    expect(screen.getByText("VALLEY")).toBeInTheDocument()
    expect(screen.getAllByText("kW")).toHaveLength(2)
  })

  test("uses the current peak and valley labels when has_light is light-on", () => {
    render(<PowerInputs {...buildProps({ has_light: "light-on" })} />)

    expect(screen.getByText("CURRENT_PEAK")).toBeInTheDocument()
    expect(screen.getByText("CURRENT_VALLEY")).toBeInTheDocument()
    expect(screen.queryByText("WHICH_PEAK")).not.toBeInTheDocument()
    expect(screen.queryByText("WHICH_VALLEY")).not.toBeInTheDocument()
  })

  test("renders the generic power label and numbered adornments when there are more than two inputs", () => {
    render(<PowerInputs {...buildProps({ numInputs: 4 })} />)

    expect(screen.getAllByText("WHICH_POWER")).toHaveLength(4)
    expect(screen.getByText("P1")).toBeInTheDocument()
    expect(screen.getByText("P2")).toBeInTheDocument()
    expect(screen.getByText("P3")).toBeInTheDocument()
    expect(screen.getByText("P4")).toBeInTheDocument()
  })

  test("sanitizes to one decimal and normalizes commas before calling setFieldValue in the two-input non-light flow", () => {
    const setFieldValue = vi.fn()

    render(<PowerInputs {...buildProps({ setFieldValue })} />)

    fireEvent.change(getInput("contract.power.power1"), {
      target: { value: "12,34" },
    })

    expect(setFieldValue).toHaveBeenCalledWith("contract.power.power1", "12.3")
  })

  test("sanitizes to three decimals and normalizes apostrophes when has_light is light-on", () => {
    const setFieldValue = vi.fn()

    render(
      <PowerInputs
        {...buildProps({
          setFieldValue,
          has_light: "light-on",
        })}
      />,
    )

    fireEvent.change(getInput("contract.power.power1"), {
      target: { value: "12'3456" },
    })

    expect(setFieldValue).toHaveBeenCalledWith(
      "contract.power.power1",
      "12.345",
    )
  })

  test("sanitizes to three decimals when there are more than two inputs", () => {
    const setFieldValue = vi.fn()

    render(<PowerInputs {...buildProps({ setFieldValue, numInputs: 3 })} />)

    fireEvent.change(getInput("contract.power.power3"), {
      target: { value: "7,8912" },
    })

    expect(setFieldValue).toHaveBeenCalledWith("contract.power.power3", "7.891")
  })

  test("forwards value, blur handling, touched state, and error text observably", () => {
    const handleBlur = vi.fn()

    render(
      <PowerInputs
        {...buildProps({
          handleBlur,
          values: {
            power1: "3.2",
            power2: "5.4",
          },
          touched: {
            power: {
              power1: true,
            },
          },
          errors: {
            power1: "POWER_ERROR",
          },
        })}
      />,
    )

    const input = getInput("contract.power.power1")

    expect(input).toHaveValue("3.2")
    expect(input).toHaveAttribute("aria-invalid", "true")
    expect(screen.getByText("POWER_ERROR")).toBeInTheDocument()

    fireEvent.blur(input)

    expect(handleBlur).toHaveBeenCalledTimes(1)
  })
})
