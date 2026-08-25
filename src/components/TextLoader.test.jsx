import { afterEach, describe, expect, test, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"

const BASE_URL = import.meta.env.BASE_URL

const { mockAxios, mockI18n } = vi.hoisted(() => ({
  mockAxios: vi.fn(),
  mockI18n: {
    language: "ca",
    changeLanguage: vi.fn(),
  },
}))

vi.mock("axios", () => ({
  default: mockAxios,
}))

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ i18n: mockI18n }),
}))

import TextLoader from "./TextLoader"

const renderTextLoader = (props = {}) =>
  render(<TextLoader documentName="terms" {...props} />)

afterEach(() => {
  vi.clearAllMocks()
  mockI18n.language = "ca"
})

describe("TextLoader", () => {
  test("renders loading first", () => {
    mockAxios.mockReturnValueOnce(new Promise(() => {}))

    renderTextLoader()

    expect(screen.getByTestId("loading-component")).toBeInTheDocument()
    expect(mockAxios).toHaveBeenCalledWith({
      method: "GET",
      url: `${BASE_URL}static/docs/ca/terms.html`,
    })
  })

  test("uses the i18n language when the language prop is absent", async () => {
    mockI18n.language = "ca"
    mockAxios.mockResolvedValueOnce({ data: "<p>Termes i condicions</p>" })

    renderTextLoader()

    expect(await screen.findByText("Termes i condicions")).toBeInTheDocument()
    expect(mockAxios).toHaveBeenCalledWith({
      method: "GET",
      url: `${BASE_URL}static/docs/ca/terms.html`,
    })
  })

  test("uses the explicit language prop instead of the i18n language", async () => {
    mockI18n.language = "ca"
    mockAxios.mockResolvedValueOnce({ data: "<p>Términos y condiciones</p>" })

    renderTextLoader({ language: "es_ES" })

    expect(
      await screen.findByText("Términos y condiciones"),
    ).toBeInTheDocument()
    expect(mockAxios).toHaveBeenCalledWith({
      method: "GET",
      url: `${BASE_URL}static/docs/es/terms.html`,
    })
  })

  test("renders resolved html and refetches when documentName and language change", async () => {
    mockAxios
      .mockResolvedValueOnce({ data: "<p>First text</p>" })
      .mockResolvedValueOnce({ data: "<p>Updated text</p>" })

    const { rerender } = renderTextLoader()

    expect(await screen.findByText("First text")).toBeInTheDocument()

    rerender(<TextLoader documentName="privacy-policy" language="es_ES" />)

    expect(screen.getByTestId("loading-component")).toBeInTheDocument()
    expect(await screen.findByText("Updated text")).toBeInTheDocument()
    expect(mockAxios).toHaveBeenNthCalledWith(2, {
      method: "GET",
      url: `${BASE_URL}static/docs/es/privacy-policy.html`,
    })
  })

  test("keeps showing loading when the request fails", async () => {
    const error = new Error("request failed")
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {})

    mockAxios.mockRejectedValueOnce(error)

    renderTextLoader()

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        `Error retrieving text ${BASE_URL}static/docs/ca/terms.html`,
        error,
      )
    })

    expect(screen.getByTestId("loading-component")).toBeInTheDocument()
  })
})
