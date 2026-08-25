import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, test, vi } from "vitest"

import CAUField from "./CAUField"

vi.mock("react-i18next", async () => import("../tests/__mocks__/i18n.js"))

const cauMocks = vi.hoisted(() => ({
  checkCups: vi.fn(),
  prettyCAU: vi.fn((value) => value),
  isMatchingCUPSandCAU: vi.fn(() => false),
}))

vi.mock("../services/api", () => ({
  checkCups: cauMocks.checkCups,
}))

vi.mock("../services/utils", () => ({
  prettyCAU: cauMocks.prettyCAU,
  isMatchingCUPSandCAU: cauMocks.isMatchingCUPSandCAU,
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

const buildProps = (overrides = {}) => ({
  name: "self_consumption.cau",
  id: "self-consumption-cau",
  label: "CAU_LABEL",
  variant: "outlined",
  values: {
    cups: "ES12345678901234567890",
    self_consumption: {
      cau: "",
      cau_valid: false,
      collective_installation: "collective",
    },
  },
  value: "",
  onBlur: vi.fn(),
  touched: true,
  error: "CAU_ERROR",
  required: false,
  setFieldValue: vi.fn(),
  helperText: "CAU_HELPER",
  ...overrides,
})

const renderCAUField = (overrides = {}) => {
  const props = buildProps(overrides)
  const result = render(<CAUField {...props} />)

  return {
    ...result,
    props,
  }
}

const getInput = () =>
  document.querySelector('[data-cy="self_consumption.cau-input"]')
const remoteCAU = "ES12345678901234567890ABCD"
const remoteCupsPrefix = remoteCAU.slice(0, 20)

describe("CAUField", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    cauMocks.prettyCAU.mockImplementation((value) => value)
    cauMocks.isMatchingCUPSandCAU.mockReturnValue(false)
    cauMocks.checkCups.mockReset()
  })

  test("renders the field label and helper text", () => {
    renderCAUField({ touched: false, error: false })

    expect(screen.getByText("CAU_LABEL")).toBeInTheDocument()
    expect(screen.getByText("CAU_HELPER")).toBeInTheDocument()
    expect(getInput()).toBeInTheDocument()
  })

  test("formats the input value and stores it through setFieldValue", () => {
    const setFieldValue = vi.fn()

    cauMocks.prettyCAU.mockReturnValue("ES0026FORMATTEDCAU")

    renderCAUField({ setFieldValue, touched: false, error: false })

    fireEvent.change(getInput(), { target: { value: "es-0026 raw" } })

    expect(cauMocks.prettyCAU).toHaveBeenCalledWith("es-0026 raw")
    expect(setFieldValue).toHaveBeenCalledWith(
      "self_consumption.cau",
      "ES0026FORMATTEDCAU",
    )
  })

  test("uses isMatchingCUPSandCAU for individual installations and stores the derived validity", async () => {
    const setFieldValue = vi.fn()

    cauMocks.isMatchingCUPSandCAU.mockReturnValue(true)

    renderCAUField({
      setFieldValue,
      values: {
        cups: "ES12345678901234567890",
        self_consumption: {
          cau: "ES12345678901234567890ABCDEF",
          cau_valid: false,
          collective_installation: "individual",
        },
      },
      value: "ES12345678901234567890ABCDEF",
    })

    expect(cauMocks.isMatchingCUPSandCAU).toHaveBeenCalledWith(
      "ES12345678901234567890ABCDEF",
      "ES12345678901234567890",
    )

    await waitFor(() => {
      expect(setFieldValue).toHaveBeenCalledWith(
        "self_consumption.cau_valid",
        true,
      )
    })

    expect(cauMocks.checkCups).not.toHaveBeenCalled()
  })

  test("checks the first 20 chars remotely for non-individual installations and reflects the loading helper", async () => {
    const deferred = createDeferred()
    const setFieldValue = vi.fn()

    cauMocks.checkCups.mockReturnValue(deferred.promise)

    renderCAUField({
      setFieldValue,
      values: {
        cups: "ES00000000000000000000",
        self_consumption: {
          cau: remoteCAU,
          cau_valid: false,
          collective_installation: "collective",
        },
      },
      value: remoteCAU,
    })

    await waitFor(() => {
      expect(cauMocks.checkCups).toHaveBeenCalledWith(remoteCupsPrefix)
    })

    expect(screen.getByText("API_VALIDATED_FIELD_CHECKING")).toBeInTheDocument()
    expect(screen.queryByText("CAU_ERROR")).not.toBeInTheDocument()

    deferred.resolve({ state: true })

    await waitFor(() => {
      expect(setFieldValue).toHaveBeenCalledWith(
        "self_consumption.cau_valid",
        true,
      )
    })

    await waitFor(() => {
      expect(screen.getByText("CAU_HELPER")).toBeInTheDocument()
    })

    expect(screen.getByText("CAU_ERROR")).toBeInTheDocument()
  })

  test("logs API failures, clears loading, and stores false validity", async () => {
    const deferred = createDeferred()
    const setFieldValue = vi.fn()
    const error = new Error("cups failed")
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {})

    cauMocks.checkCups.mockReturnValue(deferred.promise)

    renderCAUField({
      setFieldValue,
      values: {
        cups: "ES00000000000000000000",
        self_consumption: {
          cau: remoteCAU,
          cau_valid: false,
          collective_installation: "shared",
        },
      },
      value: remoteCAU,
    })

    await waitFor(() => {
      expect(
        screen.getByText("API_VALIDATED_FIELD_CHECKING"),
      ).toBeInTheDocument()
    })

    deferred.reject(error)

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith(error)
    })

    await waitFor(() => {
      expect(setFieldValue).toHaveBeenCalledWith(
        "self_consumption.cau_valid",
        false,
      )
    })

    await waitFor(() => {
      expect(screen.getByText("CAU_HELPER")).toBeInTheDocument()
    })

    expect(screen.getByText("CAU_ERROR")).toBeInTheDocument()

    consoleError.mockRestore()
  })
})
