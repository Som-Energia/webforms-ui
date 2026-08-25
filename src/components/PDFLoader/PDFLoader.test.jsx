import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import { I18nextProvider } from "react-i18next"
import i18n from "i18next"

import { initI18n } from "../../tests/i18n.mock"
import PDFLoader from "./PDFLoader"

const BACKOFFICE_URL = "https://backoffice.test"
const ORIGINAL_BACKOFFICE_URL = import.meta.env.VITE_BACKOFFICE_URL

const renderPDFLoader = (props = {}) => {
  import.meta.env.VITE_BACKOFFICE_URL = BACKOFFICE_URL

  return render(
    <I18nextProvider i18n={i18n}>
      <PDFLoader folder="contracts" documentName="terms" {...props} />
    </I18nextProvider>,
  )
}

beforeEach(async () => {
  await initI18n()
  await i18n.changeLanguage("ca")
})

afterEach(() => {
  vi.clearAllMocks()
  import.meta.env.VITE_BACKOFFICE_URL = ORIGINAL_BACKOFFICE_URL
})

describe("PDFLoader", () => {
  test("uses the i18n language when the language prop is absent", async () => {
    renderPDFLoader()

    expect(await screen.findByTitle("PDF")).toHaveAttribute(
      "data",
      `${BACKOFFICE_URL}/storage/app/media/DOCS/legal/ca/contracts/terms.pdf`,
    )
  })

  test("uses the explicit language prop instead of the i18n language", async () => {
    renderPDFLoader({ language: "es_ES" })

    expect(await screen.findByTitle("PDF")).toHaveAttribute(
      "data",
      `${BACKOFFICE_URL}/storage/app/media/DOCS/legal/es/contracts/terms.pdf`,
    )
  })

  test("updates the rendered PDF url when documentName and language change", async () => {
    const { rerender } = renderPDFLoader()

    expect(await screen.findByTitle("PDF")).toHaveAttribute(
      "data",
      `${BACKOFFICE_URL}/storage/app/media/DOCS/legal/ca/contracts/terms.pdf`,
    )

    rerender(
      <I18nextProvider i18n={i18n}>
        <PDFLoader
          folder="contracts"
          documentName="privacy-policy"
          language="es_ES"
        />
      </I18nextProvider>,
    )

    await waitFor(() => {
      expect(screen.getByTitle("PDF")).toHaveAttribute(
        "data",
        `${BACKOFFICE_URL}/storage/app/media/DOCS/legal/es/contracts/privacy-policy.pdf`,
      )
    })
  })
})
