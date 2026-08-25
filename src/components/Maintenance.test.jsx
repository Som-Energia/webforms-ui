import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, test, vi } from "vitest"

import Maintenance from "./Maintenance"

vi.mock("react-i18next", async () => import("../tests/__mocks__/i18n.js"))

const { mockUseSyncLanguage } = vi.hoisted(() => ({
  mockUseSyncLanguage: vi.fn(),
}))

vi.mock("../hooks/useTranslateOptions", async () => {
  const actual = await vi.importActual("../hooks/useTranslateOptions")

  return {
    ...actual,
    useSyncLanguage: mockUseSyncLanguage,
  }
})

describe("Maintenance", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.history.pushState({}, "", "/")
  })

  test("renders the translated maintenance texts", () => {
    render(<Maintenance />)

    expect(screen.getByText("MAINTENANCE_TEXT1")).toBeInTheDocument()
    expect(screen.getByText("MAINTENANCE_TEXT2")).toBeInTheDocument()
  })

  test("calls useSyncLanguage with ca when the pathname starts with /ca", () => {
    window.history.pushState({}, "", "/ca/maintenance")

    render(<Maintenance />)

    expect(mockUseSyncLanguage).toHaveBeenCalledWith("ca")
  })

  test.each(["/maintenance", "/fr/maintenance"])(
    "calls useSyncLanguage with es when the pathname %s has no supported language prefix",
    (pathname) => {
      window.history.pushState({}, "", pathname)

      render(<Maintenance />)

      expect(mockUseSyncLanguage).toHaveBeenCalledWith("es")
    },
  )
})
