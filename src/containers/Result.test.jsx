import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, test, vi } from "vitest"

import Result from "./Result"

vi.mock("react-i18next", async () => import("../tests/__mocks__/i18n.js"))

const { mockUseParams, mockUseSyncLanguage } = vi.hoisted(() => ({
  mockUseParams: vi.fn(),
  mockUseSyncLanguage: vi.fn(),
}))

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom")

  return {
    ...actual,
    useParams: mockUseParams,
  }
})

vi.mock("../hooks/useTranslateOptions", async () => {
  const actual = await vi.importActual("../hooks/useTranslateOptions")

  return {
    ...actual,
    useSyncLanguage: mockUseSyncLanguage,
  }
})

describe("Result", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseParams.mockReturnValue({ language: "ca" })
  })

  test("renders the success state with header and default translated title", () => {
    render(<Result mode="success" showHeader />)

    expect(mockUseSyncLanguage).toHaveBeenCalledWith("ca")
    expect(screen.getByText("SUCCESS_TITLE")).toBeInTheDocument()
    expect(screen.getByText("SUCCESS_TEXT")).toBeInTheDocument()
    expect(screen.getByTestId("CheckCircleIcon")).toBeInTheDocument()
    expect(screen.queryByTestId("CancelIcon")).not.toBeInTheDocument()
  })

  test("renders the failure state with default failure title and no header", () => {
    render(<Result mode="failure" showHeader={false} />)

    expect(screen.getByText("FAILURE_TEXT")).toBeInTheDocument()
    expect(screen.getByTestId("CancelIcon")).toBeInTheDocument()
    expect(screen.queryByTestId("CheckCircleIcon")).not.toBeInTheDocument()
    expect(screen.queryByText("SUCCESS_TITLE")).not.toBeInTheDocument()
  })

  test("renders custom title, subtitle, description and children", () => {
    render(
      <Result
        mode="success"
        title="CUSTOM_TITLE"
        subtitle="Custom subtitle"
        description="Custom description">
        <button type="button">Continue</button>
      </Result>,
    )

    expect(screen.getByText("CUSTOM_TITLE")).toBeInTheDocument()
    expect(screen.getByText("Custom subtitle")).toBeInTheDocument()
    expect(screen.getByText("Custom description")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Continue" })).toBeInTheDocument()
  })

  test("falls back to failure title when mode is not success and no custom title is provided", () => {
    render(<Result mode="unknown" />)

    expect(screen.getByText("FAILURE_TEXT")).toBeInTheDocument()
    expect(screen.queryByTestId("CheckCircleIcon")).not.toBeInTheDocument()
    expect(screen.queryByTestId("CancelIcon")).not.toBeInTheDocument()
  })
})
