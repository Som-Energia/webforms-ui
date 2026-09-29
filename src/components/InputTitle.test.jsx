import { render, screen } from "@testing-library/react"

import InputTitle from "./InputTitle"

describe("InputTitle", () => {
  test("renders the title text", () => {
    render(<InputTitle text="Field title" />)

    expect(screen.getByText("Field title")).toBeInTheDocument()
  })

  test("renders the required marker when requested", () => {
    render(<InputTitle text="Field title" required />)

    expect(screen.getByText("Field title")).toBeInTheDocument()
    expect(screen.getByText("*")).toBeInTheDocument()
  })

  test("renders the description when provided", () => {
    render(<InputTitle text="Field title" description="Helpful description" />)

    expect(screen.getByText("Helpful description")).toBeInTheDocument()
  })

  test("does not render the description when it is not provided", () => {
    render(<InputTitle text="Field title" />)

    expect(screen.queryByText("Helpful description")).not.toBeInTheDocument()
  })

  test("uses the header variant when isHeader is enabled", () => {
    render(<InputTitle text="Field title" isHeader />)

    expect(screen.getByText("Field title")).toHaveClass(
      "MuiTypography-headline4.regular",
    )
  })

  test("uses the default input label variant when isHeader is disabled", () => {
    render(<InputTitle text="Field title" />)

    expect(screen.getByText("Field title")).toHaveClass(
      "MuiTypography-input.label",
    )
  })
})
