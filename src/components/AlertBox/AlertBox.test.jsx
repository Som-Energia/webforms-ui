import { render, screen, within } from "@testing-library/react"

import AlertBox from "./AlertBox"

describe("AlertBox", () => {
  const renderAlert = (props = {}) =>
    render(
      <AlertBox
        severity="warning"
        title="Test Header"
        description="Test Body"
        {...props}
      />,
    )

  test.each(["warning", "success", "error", "info"])(
    'renders an alert with severity "%s"',
    (severity) => {
      renderAlert({ severity })

      expect(screen.getByRole("alert")).toBeInTheDocument()
      expect(screen.getByText("Test Header")).toBeInTheDocument()
    },
  )

  test("renders title, description HTML and children", () => {
    renderAlert({
      description: "Test <strong>Body</strong>",
      children: <button type="button">Action</button>,
    })

    expect(screen.getByText("Test Header")).toBeInTheDocument()
    expect(screen.getByText("Body")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Action" })).toBeInTheDocument()
  })

  test("does not render description when it is not provided", () => {
    renderAlert({ description: undefined })

    expect(screen.getByText("Test Header")).toBeInTheDocument()
    expect(screen.queryByText("Test Body")).not.toBeInTheDocument()
  })

  test("uses body1 as the default description variant", () => {
    renderAlert()

    expect(screen.getByText("Test Body")).toHaveClass("MuiTypography-body1")
  })

  test("uses the provided description variant", () => {
    renderAlert({ variant: "subtitle2" })

    expect(screen.getByText("Test Body")).toHaveClass("MuiTypography-subtitle2")
  })

  test("does not render an icon when icon prop is not provided", () => {
    renderAlert()
    const alert = screen.getByRole("alert")

    expect(alert.querySelector("svg")).not.toBeInTheDocument()
  })

  test.each([
    ["warning", "WarningAmberOutlinedIcon"],
    ["error", "ErrorOutlineIcon"],
    ["success", "CheckCircleOutlineIcon"],
    ["info", "InfoOutlinedIcon"],
    ["unexpected-value", "InfoOutlinedIcon"],
  ])("renders the %s custom icon", (icon, expectedTestId) => {
    renderAlert({ icon })

    expect(
      within(screen.getByRole("alert")).getByTestId(expectedTestId),
    ).toBeInTheDocument()
  })

  test("applies the provided text alignment", () => {
    renderAlert({ textAlign: "left" })

    expect(screen.getByRole("alert")).toHaveStyle({ textAlign: "left" })
  })
})
