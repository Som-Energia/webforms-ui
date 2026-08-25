import { render, screen } from "@testing-library/react"
import { describe, expect, test, vi } from "vitest"

import { SummaryContextProvider } from "../../context/SummaryContext"
import ReviewPrices from "./ReviewPrices"

vi.mock("react-i18next", async () => import("../../tests/__mocks__/i18n.js"))

const renderReviewPrices = (props = {}) => {
  const reviewPrices = [
    { title: "REVIEW_PRICES_ENERGY_TITLE", field: "energia" },
    { title: "GENERATION", field: "generation_kWh" },
    { title: "REVIEW_PRICES_POWER_TITLE", field: "potencia" },
  ]

  return render(
    <SummaryContextProvider>
      <ReviewPrices reviewPrices={reviewPrices} prices={{}} {...props} />
    </SummaryContextProvider>,
  )
}

describe("ReviewPrices", () => {
  test("renders the section title and one review block per reviewPrices entry", () => {
    renderReviewPrices()

    expect(screen.getByText("REVIEW_PRICES_TITLE")).toBeInTheDocument()
    expect(screen.getByText("REVIEW_PRICES_ENERGY_TITLE")).toBeInTheDocument()
    expect(screen.getByText("GENERATION")).toBeInTheDocument()
    expect(screen.getByText("REVIEW_PRICES_POWER_TITLE")).toBeInTheDocument()
  })

  test("renders UNAVAILABLE when a concept is missing", () => {
    renderReviewPrices()

    expect(screen.getAllByText("UNAVAILABLE")).toHaveLength(3)
  })

  test("renders a single condensed value when all concept values are equal", () => {
    renderReviewPrices({
      reviewPrices: [{ title: "REVIEW_PRICES_ENERGY_TITLE", field: "energia" }],
      prices: {
        energia: {
          period2: { value: "12.34", unit: "EUR" },
          period1: { value: "12.34", unit: "EUR" },
        },
      },
    })

    expect(screen.getByText("12.34 EUR")).toBeInTheDocument()
    expect(screen.queryByText("PEAK:")).not.toBeInTheDocument()
    expect(screen.queryByText("VALLEY:")).not.toBeInTheDocument()
  })

  test("renders labeled rows for 2-value concepts", () => {
    renderReviewPrices({
      reviewPrices: [{ title: "REVIEW_PRICES_ENERGY_TITLE", field: "energia" }],
      prices: {
        energia: {
          period2: { value: "10.10", unit: "EUR" },
          period1: { value: "20.20", unit: "EUR" },
        },
      },
    })

    expect(screen.getByText("PEAK:")).toBeInTheDocument()
    expect(screen.getByText("VALLEY:")).toBeInTheDocument()
    expect(screen.getByText("20.20 EUR")).toBeInTheDocument()
    expect(screen.getByText("10.10 EUR")).toBeInTheDocument()
  })

  test("renders labeled rows for 3-value concepts", () => {
    renderReviewPrices({
      reviewPrices: [{ title: "REVIEW_PRICES_POWER_TITLE", field: "potencia" }],
      prices: {
        potencia: {
          period3: { value: "30.30", unit: "EUR" },
          period1: { value: "10.10", unit: "EUR" },
          period2: { value: "20.20", unit: "EUR" },
        },
      },
    })

    expect(screen.getByText("PEAK:")).toBeInTheDocument()
    expect(screen.getByText("FLAT:")).toBeInTheDocument()
    expect(screen.getByText("VALLEY:")).toBeInTheDocument()
    expect(screen.getByText("10.10 EUR")).toBeInTheDocument()
    expect(screen.getByText("20.20 EUR")).toBeInTheDocument()
    expect(screen.getByText("30.30 EUR")).toBeInTheDocument()
  })

  test("falls back to the sorted concept keys as labels for other value counts", () => {
    renderReviewPrices({
      reviewPrices: [{ title: "GENERATION", field: "generation_kWh" }],
      prices: {
        generation_kWh: {
          p4: { value: "40", unit: "kWh" },
          p2: { value: "20", unit: "kWh" },
          p3: { value: "30", unit: "kWh" },
          p1: { value: "10", unit: "kWh" },
        },
      },
    })

    expect(screen.getByText("p1:")).toBeInTheDocument()
    expect(screen.getByText("p2:")).toBeInTheDocument()
    expect(screen.getByText("p3:")).toBeInTheDocument()
    expect(screen.getByText("p4:")).toBeInTheDocument()
    expect(screen.getByText("10 kWh")).toBeInTheDocument()
    expect(screen.getByText("20 kWh")).toBeInTheDocument()
    expect(screen.getByText("30 kWh")).toBeInTheDocument()
    expect(screen.getByText("40 kWh")).toBeInTheDocument()
  })
})
