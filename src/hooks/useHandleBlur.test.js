import { renderHook } from "@testing-library/react"
import { describe, expect, test, vi } from "vitest"

import {
  useHandleBlur,
  useHandleBlurValueIsNumberOrOption,
} from "./useHandleBlur"

describe("useHandleBlur", () => {
  test("marks the field as touched on blur", () => {
    const setFieldTouched = vi.fn()
    const { result } = renderHook(() => useHandleBlur(setFieldTouched))

    result.current({ target: { name: "holder.vat" } })

    expect(setFieldTouched).toHaveBeenCalledWith("holder.vat", true)
  })
})

describe("useHandleBlurValueIsNumberOrOption", () => {
  test("keeps the value when it matches an allowed option", () => {
    const setFieldValue = vi.fn()
    const { result } = renderHook(() =>
      useHandleBlurValueIsNumberOrOption(setFieldValue, ["Ground Floor", "1"]),
    )

    result.current({ target: { name: "floor", value: "Ground Floor" } })

    expect(setFieldValue).toHaveBeenCalledWith("floor", "Ground Floor")
  })

  test("sanitizes the value when it does not match an allowed option", () => {
    const setFieldValue = vi.fn()
    const { result } = renderHook(() =>
      useHandleBlurValueIsNumberOrOption(setFieldValue, ["Ground Floor", "1"]),
    )

    result.current({ target: { name: "floor", value: "3-B attic" } })

    expect(setFieldValue).toHaveBeenCalledWith("floor", "3-")
  })
})
