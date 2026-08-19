import React from "react"

import { render, screen } from "@testing-library/react"

import SectionTitle from "./SectionTitle"

describe("Section Title", () => {
  const mockText = "mockText"

  test("The component render properly the prop text", () => {
    render(<SectionTitle text={mockText} />)
    const textElement = screen.getByText(mockText)
    expect(textElement).toBeInTheDocument()
  })

  test("The component render properly the prop text", () => {
    render(<SectionTitle />)
    const textElement = screen.queryByText(mockText)
    expect(textElement).toBeNull()
  })
})
