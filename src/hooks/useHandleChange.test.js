import { renderHook } from "@testing-library/react"
import { describe, expect, test, vi } from "vitest"

import { useHandleChange, useHandleChangeNif } from "./useHandleChange"

describe("useHandleChange", () => {
  test("forwards name and value to setFieldValue", () => {
    const setFieldValue = vi.fn()
    const { result } = renderHook(() => useHandleChange(setFieldValue))

    result.current({ target: { name: "holder.name", value: "Mario" } })

    expect(setFieldValue).toHaveBeenCalledWith("holder.name", "Mario")
  })
})

describe("useHandleChangeNif", () => {
  test("sanitizes and uppercases nif values", () => {
    const setFieldValue = vi.fn()
    const { result } = renderHook(() => useHandleChangeNif(setFieldValue))

    result.current({ target: { name: "holder.nif", value: "ab12cd34ef56" } })

    expect(setFieldValue).toHaveBeenCalledWith("holder.nif", "AB12CD34E")
  })
})
