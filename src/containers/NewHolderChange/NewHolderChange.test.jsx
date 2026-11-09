import { fireEvent, render, screen } from "@testing-library/react"
import { vi } from "vitest"

import LoadingContext from "../../context/LoadingContext"
import SummaryContext from "../../context/SummaryContext"
import { createHolderChangeRequest } from "../../services/api"
import { NEW_HOLDER_CHANGE_FORM_SUBSTEPS } from "../../services/steps"
import NewHolderChangeForm from "./NewHolderChange"

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key, i18n: { language: "ca" } }),
}))

vi.mock("../../hooks/useBackNavigationWarning", () => ({
  default: vi.fn(),
}))

vi.mock("../../hooks/useTranslateOptions", () => ({
  useSyncLanguage: vi.fn(),
  useTranslateOptions: () => [],
}))

vi.mock("formik", () => ({
  Formik: ({ children, innerRef }) => {
    innerRef.current = { validateForm: vi.fn() }
    return children({ values: {}, isValid: true })
  },
}))

vi.mock("../../services/api", () => ({
  createHolderChangeRequest: vi.fn(),
  executeRequest: vi.fn(),
}))

vi.mock("../../services/newNormalize", () => ({
  newNormalizeHolderChange: () => ({}),
}))

vi.mock("./pages/NewHolderChangeSupplyPoint", () => ({
  default: () => null,
}))

vi.mock("./pages/NewHolderChangeSummary", () => ({
  default: () => null,
}))

describe("NewHolderChangeForm submission errors", () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.clearAllMocks()
  })

  test.each([
    ["a rejected request", () => Promise.reject(new Error("Request failed"))],
    ["an unsuccessful response", () => Promise.resolve({ state: false })],
  ])("shows the failure result for %s", async (_, response) => {
    vi.spyOn(console, "log").mockImplementation(() => {})
    createHolderChangeRequest.mockImplementation(response)

    render(
      <LoadingContext.Provider value={{ loading: false }}>
        <SummaryContext.Provider
          value={{
            summaryField: NEW_HOLDER_CHANGE_FORM_SUBSTEPS.SUMMARY,
            setSummaryField: vi.fn(),
          }}>
          <NewHolderChangeForm />
        </SummaryContext.Provider>
      </LoadingContext.Provider>,
    )

    fireEvent.click(screen.getByRole("button", { name: "NEXT" }))

    expect(await screen.findByText("HOLDER_CHANGE_ERROR_TITLE")).toBeVisible()
    expect(screen.getByText("HOLDER_CHANGE_ERROR_DESC")).toBeVisible()
    expect(screen.queryByRole("button", { name: "NEXT" })).toBeNull()
    expect(createHolderChangeRequest).toHaveBeenCalledOnce()
  })
})
