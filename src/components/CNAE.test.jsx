import { useCallback, useState } from "react"

import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, test, vi } from "vitest"

import LoadingContext from "../context/LoadingContext"
import { checkCnae } from "../services/api"
import CnaeField from "./CNAE"

vi.mock("react-i18next", async () => import("../tests/__mocks__/i18n.js"))

vi.mock("../services/api", () => ({
  checkCnae: vi.fn(),
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

const renderComponent = ({
  initialValues = {
    supply_point: {
      is_housing: false,
      cnae: "",
      cnae_valid: false,
    },
  },
  initialTouched = {
    supply_point: {
      cnae: false,
    },
  },
  initialErrors = {
    supply_point: {},
  },
  setFieldValueSpy = vi.fn(),
  setFieldTouchedSpy = vi.fn(),
  setValuesSpy = vi.fn(),
  setLoadingSpy = vi.fn(),
} = {}) => {
  const Wrapper = () => {
    const [values, setValuesState] = useState(initialValues)
    const [touched, setTouchedState] = useState(initialTouched)
    const [loading, setLoadingState] = useState(false)

    const setFieldValue = useCallback(
      (fieldName, value) => {
        setFieldValueSpy(fieldName, value)

        if (fieldName.startsWith("supply_point.")) {
          const key = fieldName.replace("supply_point.", "")
          setValuesState((currentValues) => ({
            ...currentValues,
            supply_point: {
              ...currentValues.supply_point,
              [key]: value,
            },
          }))
        }
      },
      [setFieldValueSpy],
    )

    const setFieldTouched = useCallback(
      (fieldName, isTouched) => {
        setFieldTouchedSpy(fieldName, isTouched)

        if (fieldName === "supply_point.cnae") {
          setTouchedState((currentTouched) => ({
            ...currentTouched,
            supply_point: {
              ...currentTouched.supply_point,
              cnae: isTouched,
            },
          }))
        }
      },
      [setFieldTouchedSpy],
    )

    const setValues = useCallback(
      (nextValues) => {
        setValuesSpy(nextValues)
        setValuesState(nextValues)
      },
      [setValuesSpy],
    )

    const setLoading = useCallback(
      (nextValue) => {
        setLoadingSpy(nextValue)
        setLoadingState(nextValue)
      },
      [setLoadingSpy],
    )

    return (
      <LoadingContext.Provider value={{ loading, setLoading }}>
        <CnaeField
          values={values}
          errors={initialErrors}
          touched={touched}
          setFieldValue={setFieldValue}
          setFieldTouched={setFieldTouched}
          setValues={setValues}
        />
      </LoadingContext.Provider>
    )
  }

  return render(<Wrapper />)
}

const getInput = () => screen.getByRole("textbox")
const getHousingSelect = () =>
  screen.getByRole("combobox", { name: "Without label" })

describe("CnaeField", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(checkCnae).mockResolvedValue({ state: true })
  })

  test("renders the housing select, CNAE input and non-housing helper", () => {
    renderComponent()

    expect(screen.getByText("IS_HOUSING")).toBeInTheDocument()
    expect(screen.getByText("CNAE")).toBeInTheDocument()
    expect(getHousingSelect()).toBeInTheDocument()
    expect(getInput()).toBeInTheDocument()
    expect(screen.getByText("HELP_POPOVER_CNAE")).toBeInTheDocument()
  })

  test("sanitizes typed CNAE values and marks the field as touched on blur", () => {
    const setFieldValueSpy = vi.fn()
    const setFieldTouchedSpy = vi.fn()

    renderComponent({
      setFieldValueSpy,
      setFieldTouchedSpy,
    })

    fireEvent.change(getInput(), { target: { value: "12a-" } })
    fireEvent.blur(getInput())

    expect(setFieldValueSpy).toHaveBeenCalledWith("supply_point.cnae", "12")
    expect(setFieldTouchedSpy).toHaveBeenCalledWith("supply_point.cnae", true)
    expect(checkCnae).not.toHaveBeenCalled()
  })

  test("shows the translated CNAE validation error when touched", () => {
    renderComponent({
      initialValues: {
        supply_point: {
          is_housing: false,
          cnae: "12",
          cnae_valid: false,
        },
      },
      initialTouched: {
        supply_point: {
          cnae: true,
        },
      },
      initialErrors: {
        supply_point: {
          cnae_valid: "INVALID_CNAE",
        },
      },
    })

    expect(screen.getByText("INVALID_CNAE")).toBeInTheDocument()
    expect(checkCnae).not.toHaveBeenCalled()
  })

  test("selecting housing autofills 9820, disables the input and swaps the helper", async () => {
    const user = userEvent.setup()
    const setValuesSpy = vi.fn()

    renderComponent({ setValuesSpy })

    await user.click(getHousingSelect())
    await user.click(screen.getByRole("option", { name: "YES" }))

    await waitFor(() => {
      expect(setValuesSpy).toHaveBeenCalledWith({
        supply_point: {
          is_housing: true,
          cnae: 9820,
          cnae_valid: true,
        },
      })
    })

    expect(getInput()).toHaveValue("9820")
    expect(getInput()).toBeDisabled()
    expect(screen.getByText("CNAE_HELPER")).toBeInTheDocument()
    expect(checkCnae).not.toHaveBeenCalled()
  })

  test("selecting non-housing clears the autofill and re-enables the input", async () => {
    const user = userEvent.setup()
    const setValuesSpy = vi.fn()

    renderComponent({
      initialValues: {
        supply_point: {
          is_housing: true,
          cnae: 9820,
          cnae_valid: true,
        },
      },
      setValuesSpy,
    })

    vi.clearAllMocks()
    vi.mocked(checkCnae).mockResolvedValue({ state: true })

    await user.click(getHousingSelect())
    await user.click(screen.getByRole("option", { name: "NO" }))

    await waitFor(() => {
      expect(setValuesSpy).toHaveBeenCalledWith({
        supply_point: {
          is_housing: false,
          cnae: undefined,
          cnae_valid: false,
        },
      })
    })

    expect(getInput()).toHaveValue("")
    expect(getInput()).not.toBeDisabled()
    expect(screen.getByText("HELP_POPOVER_CNAE")).toBeInTheDocument()
    expect(checkCnae).not.toHaveBeenCalled()
  })

  test("validates long CNAE values through the API and toggles loading on success", async () => {
    const deferred = createDeferred()
    const setFieldValueSpy = vi.fn()
    const setLoadingSpy = vi.fn()

    vi.mocked(checkCnae).mockReturnValue(deferred.promise)

    renderComponent({
      initialValues: {
        supply_point: {
          is_housing: false,
          cnae: "1234",
          cnae_valid: false,
        },
      },
      setFieldValueSpy,
      setLoadingSpy,
    })

    await waitFor(() => {
      expect(checkCnae).toHaveBeenCalledWith("1234")
      expect(setLoadingSpy).toHaveBeenCalledWith(true)
    })

    expect(screen.getByRole("progressbar")).toBeInTheDocument()

    deferred.resolve({ state: true })

    await waitFor(() => {
      expect(setFieldValueSpy).toHaveBeenCalledWith(
        "supply_point.cnae_valid",
        true,
      )
      expect(setLoadingSpy).toHaveBeenLastCalledWith(false)
    })

    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument()
    })
  })

  test("stores false validity and clears loading when CNAE validation fails", async () => {
    const deferred = createDeferred()
    const setFieldValueSpy = vi.fn()
    const setLoadingSpy = vi.fn()

    vi.mocked(checkCnae).mockReturnValue(deferred.promise)

    renderComponent({
      initialValues: {
        supply_point: {
          is_housing: false,
          cnae: "5678",
          cnae_valid: true,
        },
      },
      setFieldValueSpy,
      setLoadingSpy,
    })

    await waitFor(() => {
      expect(checkCnae).toHaveBeenCalledWith("5678")
      expect(setLoadingSpy).toHaveBeenCalledWith(true)
    })

    deferred.reject(new Error("network"))

    await waitFor(() => {
      expect(setFieldValueSpy).toHaveBeenCalledWith(
        "supply_point.cnae_valid",
        false,
      )
      expect(setLoadingSpy).toHaveBeenLastCalledWith(false)
    })

    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument()
    })
  })
})
