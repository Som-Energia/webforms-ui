import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { vi } from "vitest"

import VoluntaryDonation from "./VoluntaryDonation"

vi.mock("react-i18next", async () => import("../tests/__mocks__/i18n.js"))

const buildProps = (overrides = {}) => ({
  values: {
    voluntary_donation: undefined,
  },
  setFieldValue: vi.fn(),
  ...overrides,
})

describe("VoluntaryDonation", () => {
  test("renders the informational copy, required question title, and both chooser options", () => {
    render(<VoluntaryDonation {...buildProps()} />)

    expect(screen.getByText("VOLUNTARY_DONATION_HOW_INFO")).toBeInTheDocument()
    expect(screen.getByText("VOLUNTARY_DONATION_WHY_INFO")).toBeInTheDocument()
    expect(screen.getByText("VOLUNTARY_DONATION_QUESTION")).toBeInTheDocument()
    expect(screen.getByText("*")).toBeInTheDocument()

    const options = screen.getAllByRole("button")
    expect(options).toHaveLength(2)
    expect(screen.getByText("VOLUNTARY_DONATION_ON_HEADER")).toBeInTheDocument()
    expect(
      screen.getByText("VOLUNTARY_DONATION_OFF_HEADER"),
    ).toBeInTheDocument()
  })

  test.each([
    [true, "VOLUNTARY_DONATION_ON_HEADER", "VOLUNTARY_DONATION_OFF_HEADER"],
    [false, "VOLUNTARY_DONATION_OFF_HEADER", "VOLUNTARY_DONATION_ON_HEADER"],
  ])(
    "reflects the selected state when voluntary_donation is %s",
    (value, selectedHeader, unselectedHeader) => {
      render(
        <VoluntaryDonation
          {...buildProps({ values: { voluntary_donation: value } })}
        />,
      )

      const selectedOption = screen
        .getByText(selectedHeader)
        .closest('[role="button"]')
      const unselectedOption = screen
        .getByText(unselectedHeader)
        .closest('[role="button"]')

      expect(within(selectedOption).getByRole("checkbox")).toBeChecked()
      expect(
        within(unselectedOption).queryByRole("checkbox"),
      ).not.toBeInTheDocument()
    },
  )

  test("calls setFieldValue with the selected donation value", async () => {
    const user = userEvent.setup()
    const setFieldValue = vi.fn()

    render(<VoluntaryDonation {...buildProps({ setFieldValue })} />)

    await user.click(
      screen
        .getByText("VOLUNTARY_DONATION_ON_HEADER")
        .closest('[role="button"]'),
    )
    expect(setFieldValue).toHaveBeenCalledWith("voluntary_donation", true)

    await user.click(
      screen
        .getByText("VOLUNTARY_DONATION_OFF_HEADER")
        .closest('[role="button"]'),
    )
    expect(setFieldValue).toHaveBeenCalledWith("voluntary_donation", false)
  })
})
