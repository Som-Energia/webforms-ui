import { render, screen } from "@testing-library/react"

import AlertBox from "./AlertBox"

describe("AlertBox component ", () => {
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
    'AlertBox render with severity="%s"',
    (severity) => {
      renderAlert({ severity })

      expect(screen.getByTestId(`alert-${severity}`)).toBeInTheDocument()
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
    const { container } = renderAlert()

    expect(container.querySelector("svg")).not.toBeInTheDocument()
  })

  test.each([
    ["warning", "WarningAmberOutlinedIcon"],
    ["error", "ErrorOutlineIcon"],
    ["success", "CheckCircleOutlineIcon"],
    ["info", "InfoOutlinedIcon"],
    ["unexpected-value", "InfoOutlinedIcon"],
  ])("renders %s custom icon correctly", (icon, expectedTestId) => {
    renderAlert({ icon })

    expect(screen.getByTestId(expectedTestId)).toBeInTheDocument()
  })

  test("applies the provided text alignment", () => {
    renderAlert({ textAlign: "left" })

    expect(screen.getByRole("alert")).toHaveStyle({ textAlign: "left" })
  })
})
