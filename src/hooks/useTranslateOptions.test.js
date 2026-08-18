import { renderHook } from "@testing-library/react"
import dayjs from "dayjs"
import { afterEach, describe, expect, test, vi } from "vitest"

const { mockI18n } = vi.hoisted(() => ({
  mockI18n: {
    language: "es",
    changeLanguage: vi.fn(),
  },
}))

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ i18n: mockI18n }),
}))

import { useSyncDayjsLanguage, useSyncLanguage } from "./useTranslateOptions"

describe("useSyncLanguage", () => {
  afterEach(() => {
    vi.clearAllMocks()
    mockI18n.language = "es"
  })

  test("changes the language when it differs from the current one", () => {
    renderHook(() => useSyncLanguage("ca"))

    expect(mockI18n.changeLanguage).toHaveBeenCalledWith("ca")
  })

  test("does not change the language when it is already active", () => {
    mockI18n.language = "ca"

    renderHook(() => useSyncLanguage("ca"))

    expect(mockI18n.changeLanguage).not.toHaveBeenCalled()
  })
})

describe("useSyncDayjsLanguage", () => {
  afterEach(() => {
    vi.restoreAllMocks()
    mockI18n.language = "es"
  })

  test("updates dayjs locale when language differs", () => {
    const localeSpy = vi.spyOn(dayjs, "locale")

    renderHook(() => useSyncDayjsLanguage("gl"))

    expect(localeSpy).toHaveBeenCalledWith("gl")
  })

  test("falls back to es when language is missing or unchanged", () => {
    mockI18n.language = "es"
    const localeSpy = vi.spyOn(dayjs, "locale")

    renderHook(() => useSyncDayjsLanguage("es"))

    expect(localeSpy).toHaveBeenCalledWith("es")
  })
})
