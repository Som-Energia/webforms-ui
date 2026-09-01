import { useState } from "react"

import { render, screen, waitFor } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import AvailabilityContext from "../context/AvailabilityContext"
import { apiStatus } from "../services/api"
import ApiStatus from "./ApiStatus"

vi.mock("../services/api", () => ({
  apiStatus: vi.fn(),
}))

const renderComponent = ({ initialAvailability = true } = {}) => {
  const setAvailabilitySpy = vi.fn()

  const Wrapper = () => {
    const [availability, setAvailabilityState] = useState(initialAvailability)

    const setAvailability = (nextValue) => {
      setAvailabilitySpy(nextValue)
      setAvailabilityState(nextValue)
    }

    return (
      <AvailabilityContext.Provider value={{ availability, setAvailability }}>
        <ApiStatus />
        <output data-testid="availability">
          {availability ? "available" : "unavailable"}
        </output>
      </AvailabilityContext.Provider>
    )
  }

  return {
    ...render(<Wrapper />),
    setAvailabilitySpy,
  }
}

describe("ApiStatus", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  test("calls apiStatus on mount", async () => {
    vi.mocked(apiStatus).mockResolvedValue({ data: { status: "ONLINE" } })

    renderComponent()

    await waitFor(() => {
      expect(apiStatus).toHaveBeenCalledTimes(1)
    })

    expect(screen.getByTestId("availability")).toHaveTextContent("available")
  })

  test("sets availability to false when the API returns OFFLINE", async () => {
    vi.mocked(apiStatus).mockResolvedValue({ data: { status: "OFFLINE" } })

    const { setAvailabilitySpy } = renderComponent()

    await waitFor(() => {
      expect(screen.getByTestId("availability")).toHaveTextContent(
        "unavailable",
      )
    })

    expect(setAvailabilitySpy).toHaveBeenCalledWith(false)
  })

  test("sets availability to false when the response has no status", async () => {
    vi.mocked(apiStatus).mockResolvedValue({ data: {} })

    const { setAvailabilitySpy } = renderComponent()

    await waitFor(() => {
      expect(screen.getByTestId("availability")).toHaveTextContent(
        "unavailable",
      )
    })

    expect(setAvailabilitySpy).toHaveBeenCalledWith(false)
  })

  test("sets availability to false when apiStatus rejects", async () => {
    const error = new Error("request failed")
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {})

    vi.mocked(apiStatus).mockRejectedValue(error)

    const { setAvailabilitySpy } = renderComponent()

    await waitFor(() => {
      expect(screen.getByTestId("availability")).toHaveTextContent(
        "unavailable",
      )
    })

    expect(consoleErrorSpy).toHaveBeenCalledWith(error)
    expect(setAvailabilitySpy).toHaveBeenCalledWith(false)
  })

  test("re-checks the API status on the 1200000 ms interval and clears it on unmount", async () => {
    vi.mocked(apiStatus).mockResolvedValue({ data: { status: "ONLINE" } })

    const setIntervalSpy = vi
      .spyOn(globalThis, "setInterval")
      .mockImplementation((callback) => {
        callback()
        return 123
      })
    const clearIntervalSpy = vi.spyOn(globalThis, "clearInterval")

    const { unmount } = renderComponent()

    await waitFor(() => {
      expect(apiStatus).toHaveBeenCalledTimes(2)
    })

    expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 1200000)

    unmount()

    expect(clearIntervalSpy).toHaveBeenCalledWith(123)
  })
})
