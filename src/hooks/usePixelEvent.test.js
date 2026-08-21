import { renderHook } from "@testing-library/react"
import { afterEach, describe, expect, test, vi } from "vitest"

const { trackCustom } = vi.hoisted(() => ({
  trackCustom: vi.fn(),
}))

vi.mock("react-facebook-pixel", () => ({
  default: {
    trackCustom,
  },
}))

import { usePixelEvent } from "./usePixelEvent"

describe("usePixelEvent", () => {
  afterEach(() => {
    vi.clearAllMocks()
    vi.unstubAllEnvs()
    document.body.innerHTML = ""
  })

  test("tracks the custom event", () => {
    const { result } = renderHook(() => usePixelEvent())

    result.current.triggerEvent("FormSubmit", { source: "test" })

    expect(trackCustom).toHaveBeenCalledWith("FormSubmit", { source: "test" })
  })

  test("appends a tracking iframe when VITE_PIXEL_URL is configured", () => {
    vi.stubEnv("VITE_PIXEL_URL", "https://pixel.example.com?id=1")
    const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0.123456)
    const { result } = renderHook(() => usePixelEvent())

    result.current.triggerEvent("FormSubmit")

    const iframe = document.body.querySelector("iframe")
    expect(iframe).toBeInTheDocument()
    expect(iframe.src).toContain(
      "https://pixel.example.com/?id=1&cachebuster=123456",
    )

    randomSpy.mockRestore()
  })

  test("does not append an iframe when VITE_PIXEL_URL is missing", () => {
    const { result } = renderHook(() => usePixelEvent())

    result.current.triggerEvent("FormSubmit")

    expect(document.body.querySelector("iframe")).not.toBeInTheDocument()
  })
})
