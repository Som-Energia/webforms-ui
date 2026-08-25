import { render, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { vi } from "vitest"

import Powers from "./Powers"

vi.mock("react-i18next", async () => import("../tests/__mocks__/i18n.js"))

const buildProps = (overrides = {}) => ({
  values: {
    has_light: "light-off",
    contract: {
      power_type: "",
      power: {},
    },
  },
  errors: { contract: { power: {} } },
  touched: { contract: { power: {} } },
  setFieldValue: vi.fn().mockResolvedValue(undefined),
  handleBlur: vi.fn(),
  ...overrides,
})

describe("Powers", () => {
  test("renders the current contracted power title and helper when has_light is light-on", () => {
    render(
      <Powers
        {...buildProps({
          values: {
            has_light: "light-on",
            contract: { power_type: "", power: {} },
          },
        })}
      />,
    )

    expect(screen.getByText("CURRENT_CONTRACTED_POWER")).toBeInTheDocument()
    expect(screen.getByText("POWER_HELPER")).toBeInTheDocument()
    expect(screen.queryByText(/WHICH_POWER_HELPER/)).not.toBeInTheDocument()
  })

  test("renders the power to contract title, helper, and chooser options when has_light is not light-on", () => {
    render(<Powers {...buildProps()} />)

    expect(screen.getByText("POWER_TO_CONTRACT")).toBeInTheDocument()
    expect(screen.getByText("WHICH_POWER_HELPER")).toBeInTheDocument()

    const options = screen.getAllByRole("button")
    expect(options).toHaveLength(2)

    expect(screen.getByText("POWER_LOWER_15_HEADER")).toBeInTheDocument()
    expect(screen.getByText("POWER_HIGHER_15_HEADER")).toBeInTheDocument()
  })

  test("selecting the lower-power option updates power_type and resets contract.power", async () => {
    const user = userEvent.setup()
    const setFieldValue = vi.fn().mockResolvedValue(undefined)

    render(<Powers {...buildProps({ setFieldValue })} />)

    const lowerOption = screen
      .getByText("POWER_LOWER_15_HEADER")
      .closest('[role="button"]')

    await user.click(lowerOption)

    await waitFor(() => {
      expect(setFieldValue).toHaveBeenNthCalledWith(
        1,
        "contract.power_type",
        "power-lower-15kw",
      )
      expect(setFieldValue).toHaveBeenNthCalledWith(2, "contract.power", {})
    })
  })

  test("renders the lower-power helper link and exactly the lower-power inputs flow", () => {
    render(
      <Powers
        {...buildProps({
          values: {
            has_light: "light-off",
            contract: { power_type: "power-lower-15kw", power: {} },
          },
        })}
      />,
    )

    const lowerLink = screen.getByRole("link", {
      name: "POWER_LOWER_15_HELPER",
    })
    expect(lowerLink).toHaveAttribute("href", "POWER_LOWER_15_HELPER_URL")

    expect(screen.getByText("WHICH_PEAK")).toBeInTheDocument()
    expect(screen.getByText("WHICH_VALLEY")).toBeInTheDocument()
    expect(screen.queryByText("POWER_HIGHER_15_HELPER")).not.toBeInTheDocument()
    expect(screen.queryByText("WHICH_POWER")).not.toBeInTheDocument()
  })

  test("renders the higher-power helper link and the higher-power inputs flow", () => {
    render(
      <Powers
        {...buildProps({
          values: {
            has_light: "light-off",
            contract: { power_type: "power-higher-15kw", power: {} },
          },
        })}
      />,
    )

    const higherLink = screen.getByRole("link", {
      name: "POWER_HIGHER_15_HELPER",
    })
    expect(higherLink).toHaveAttribute("href", "POWER_HIGHER_15_HELPER_URL")

    expect(screen.getAllByText("WHICH_POWER")).toHaveLength(6)
    expect(screen.queryByText("POWER_LOWER_15_HELPER")).not.toBeInTheDocument()
    expect(screen.queryByText("WHICH_PEAK")).not.toBeInTheDocument()
    expect(screen.queryByText("WHICH_VALLEY")).not.toBeInTheDocument()

    const chooser = screen
      .getByText("POWER_HIGHER_15_HEADER")
      .closest('[role="button"]')
    expect(within(chooser).getByRole("checkbox")).toBeChecked()
  })
})
