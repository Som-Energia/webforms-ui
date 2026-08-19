import { useState } from "react"

import { ThemeProvider } from "@mui/material/styles"

import {
  fireEvent,
  queryByAttribute,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { beforeEach, vi } from "vitest"

import { checkCups } from "../../services/api"
import WebFormsTheme from "../../themes/webforms"
import Cups from "./CUPS"

vi.mock("react-i18next", async () => import("../../tests/__mocks__/i18n.js"))

// Mock the checkCups function
vi.mock("../../services/api", () => ({
  checkCups: vi.fn(),
}))

const webFormsTheme = WebFormsTheme()

const renderComponent = async ({
  cupsNumber,
  setValues = () => {},
  setFieldValue = () => {},
  setFieldTouched = () => {},
  touched = { cups: true },
} = {}) => {
  return render(
    <CupsWrapperComponent
      cupsNumber={cupsNumber}
      setValues={setValues}
      setFieldValue={setFieldValue}
      setFieldTouched={setFieldTouched}
      touched={touched}
    />,
  )
}

const CupsWrapperComponent = ({
  cupsNumber,
  setValues,
  setFieldValue,
  setFieldTouched,
  touched,
}) => {
  // Error handling
  const [errors, setError] = useState({ cups: null })
  const setFieldError = (fieldName, error) => {
    setError({ [fieldName]: error })
  }

  return (
    <ThemeProvider theme={webFormsTheme}>
      <Cups
        values={{ cups: cupsNumber }}
        setValues={setValues}
        errors={errors}
        setFieldValue={setFieldValue}
        touched={touched}
        setFieldError={setFieldError}
        setFieldTouched={setFieldTouched}
      />
    </ThemeProvider>
  )
}

describe("Cups component", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test("Cups renders without crashing", async () => {
    vi.mocked(checkCups).mockResolvedValue({})

    const cups = "ES0021911991898060KS"
    const dom = await renderComponent({ cupsNumber: cups })

    await waitFor(() => {
      const getByDataCy = queryByAttribute.bind(null, "data-cy")
      const input = getByDataCy(dom.container, "cups-input")
      expect(input).toBeInTheDocument()
      expect(input).toHaveValue(cups)
    })
  })

  test("Cups renders showing invalid error message through checkCups rejection", async () => {
    vi.mocked(checkCups).mockRejectedValue({})
    const invalidCups = "ES0000000000000000000"
    const setValuesSpy = vi.fn()
    await renderComponent({ cupsNumber: invalidCups, setValues: setValuesSpy })
    const errorMessage = await screen.findByText("ERROR_INVALID_FIELD")
    expect(errorMessage).toBeInTheDocument()

    const [updater] = setValuesSpy.mock.lastCall

    expect(updater({ existing: true })).toEqual(
      expect.objectContaining({
        existing: true,
        cups_valid: false,
        social_tariff: false,
      }),
    )
  })

  test("CheckCups with resolved inactive contract response", async () => {
    vi.mocked(checkCups).mockResolvedValue({
      data: {
        status: "inactive",
        knowledge_of_distri: true,
        tariff_name: "2.0TD",
        has_social_tariff: false,
      },
    })
    const cups = "ES0021911991898060KS"
    const setValuesSpy = vi.fn()
    await renderComponent({ cupsNumber: cups, setValues: setValuesSpy })

    const currentValues = {}

    await waitFor(() => {
      expect(setValuesSpy).toHaveBeenCalled()
    })

    const [updater] = setValuesSpy.mock.lastCall

    await waitFor(() => {
      expect(updater(currentValues)).toEqual(
        expect.objectContaining({
          new_contract: true,
          knowledge_of_distri: true,
          tariff_name: "2.0TD",
          social_tariff: false,
        }),
      )
    })
  })

  test("CheckCups with resolved a new contract response", async () => {
    vi.mocked(checkCups).mockResolvedValue({
      data: {
        status: "new",
        knowledge_of_distri: true,
        tariff_name: "2.0TD",
        has_social_tariff: false,
      },
    })
    const cups = "ES0021911991898060KS"
    const setValuesSpy = vi.fn()
    await renderComponent({ cupsNumber: cups, setValues: setValuesSpy })

    const currentValues = {}

    await waitFor(() => {
      expect(setValuesSpy).toHaveBeenCalled()
    })

    const [updater] = setValuesSpy.mock.lastCall

    await waitFor(() => {
      expect(updater(currentValues)).toEqual(
        expect.objectContaining({
          new_contract: true,
          knowledge_of_distri: true,
          tariff_name: "2.0TD",
          social_tariff: false,
        }),
      )
    })
  })

  test("CheckCups with another status marks new_contract as false and keeps social tariff", async () => {
    vi.mocked(checkCups).mockResolvedValue({
      data: {
        status: "active",
        knowledge_of_distri: false,
        tariff_name: "3.0TD",
        has_social_tariff: true,
      },
    })
    const cups = "ES0021911991898060KS"
    const setValuesSpy = vi.fn()
    await renderComponent({ cupsNumber: cups, setValues: setValuesSpy })

    await waitFor(() => {
      expect(setValuesSpy).toHaveBeenCalled()
    })

    const [updater] = setValuesSpy.mock.lastCall

    expect(updater({})).toEqual(
      expect.objectContaining({
        new_contract: false,
        knowledge_of_distri: false,
        tariff_name: "3.0TD",
        social_tariff: true,
      }),
    )
  })

  test("sanitizes the input value and stores it uppercased", async () => {
    const setFieldValue = vi.fn()
    const dom = await renderComponent({
      cupsNumber: "",
      setFieldValue,
      touched: { cups: false },
    })

    const getByDataCy = queryByAttribute.bind(null, "data-cy")
    const input = getByDataCy(dom.container, "cups-input")

    fireEvent.change(input, { target: { value: "es00-21abc" } })

    expect(setFieldValue).toHaveBeenCalledWith("cups", "ES00")
  })

  test("marks cups as touched on blur", async () => {
    const setFieldTouched = vi.fn()
    const dom = await renderComponent({
      cupsNumber: "",
      setFieldTouched,
      touched: { cups: false },
    })

    const getByDataCy = queryByAttribute.bind(null, "data-cy")
    const input = getByDataCy(dom.container, "cups-input")

    fireEvent.blur(input)

    expect(setFieldTouched).toHaveBeenCalledWith("cups", true)
  })

  test("does not validate cups when the value is shorter than 20 characters", async () => {
    vi.mocked(checkCups).mockResolvedValue({})

    await renderComponent({ cupsNumber: "ES0021911991" })

    await waitFor(() => {
      expect(checkCups).not.toHaveBeenCalled()
    })
  })

  test("resets cups_valid before starting validation", async () => {
    vi.mocked(checkCups).mockResolvedValue({ data: { valid: true } })
    const setFieldValue = vi.fn()

    await renderComponent({
      cupsNumber: "ES0021911991898060KS",
      setFieldValue,
    })

    await waitFor(() => {
      expect(setFieldValue).toHaveBeenCalledWith("cups_valid", false, false)
    })
  })
})
