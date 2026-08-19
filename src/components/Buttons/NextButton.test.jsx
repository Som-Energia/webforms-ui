import { queryByAttribute, render, screen } from "@testing-library/react"
import { vi } from "vitest"

import NextButton from "./NextButton"

vi.mock("react-i18next", async () => import("../../tests/__mocks__/i18n.js"))

describe("NextButton component ", () => {
  test("NextButton renders without crashing", () => {
    const dom = render(<NextButton />)

    const getByDataCy = queryByAttribute.bind(null, "data-cy")
    const button = getByDataCy(dom.container, "next")
    expect(button).toBeInTheDocument()
  })

  test("NextButton renders and title is shown", async () => {
    render(<NextButton>{"NEXT"}</NextButton>)

    const error = await screen.findByText("NEXT")
    expect(error).toBeInTheDocument()
  })

  test("NextButton renders disabled", async () => {
    const { getByText } = render(
      <NextButton disabled={true}>{"NEXT"}</NextButton>,
    )

    expect(getByText("NEXT")).toHaveAttribute("disabled")
  })
})
