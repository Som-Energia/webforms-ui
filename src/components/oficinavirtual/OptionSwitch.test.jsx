import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import OptionSwitch from "./OptionSwitch"

const buildProps = (overrides = {}) => ({
  title: "Green energy",
  description: "Enable this option for your subscription.",
  value: false,
  ...overrides,
})

describe("OptionSwitch", () => {
  test("renders the title and description text", () => {
    render(<OptionSwitch {...buildProps()} />)

    expect(screen.getByText("Green energy")).toBeInTheDocument()
    expect(
      screen.getByText("Enable this option for your subscription."),
    ).toBeInTheDocument()
  })

  test.each([
    [true, true],
    [false, false],
  ])("initializes the checked state from value=%s", (value, expected) => {
    render(<OptionSwitch {...buildProps({ value })} />)

    const switchControl = screen.getByLabelText(
      "subscription Green energy switcher",
    )

    if (expected) {
      expect(switchControl).toBeChecked()
      return
    }

    expect(switchControl).not.toBeChecked()
  })

  test("toggles the checked state when clicking the title text", async () => {
    const user = userEvent.setup()

    render(<OptionSwitch {...buildProps()} />)

    const switchControl = screen.getByLabelText(
      "subscription Green energy switcher",
    )

    expect(switchControl).not.toBeChecked()

    await user.click(screen.getByText("Green energy"))
    expect(switchControl).toBeChecked()

    await user.click(screen.getByText("Green energy"))
    expect(switchControl).not.toBeChecked()
  })

  test("toggles the checked state when clicking the switch control", async () => {
    const user = userEvent.setup()

    render(<OptionSwitch {...buildProps()} />)

    const switchControl = screen.getByRole("checkbox", {
      name: "subscription Green energy switcher",
    })

    expect(switchControl).not.toBeChecked()

    await user.click(switchControl)
    expect(switchControl).toBeChecked()

    await user.click(switchControl)
    expect(switchControl).not.toBeChecked()
  })
})
