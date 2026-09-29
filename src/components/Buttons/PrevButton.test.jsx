import { queryByAttribute, render, screen } from "@testing-library/react"
import { vi } from "vitest"

import PrevButton from "./PrevButton"

vi.mock("react-i18next", async () => import("../../tests/__mocks__/i18n.js"))

describe("PrevButton component ", () => {
  test("PrevButton renders without crashing", () => {
    const dom = render(<PrevButton />)

    const getByDataCy = queryByAttribute.bind(null, "data-cy")
    const button = getByDataCy(dom.container, "prev")
    expect(button).toBeInTheDocument()
  })

  test("PrevButton renders and title is shown", async () => {
    render(<PrevButton>{"PREV"}</PrevButton>)

    const error = await screen.findByText("PREV")
    expect(error).toBeInTheDocument()
  })

  test("PrevButton renders disabled", async () => {
    const { getByText } = render(
      <PrevButton disabled={true}>{"PREV"}</PrevButton>,
    )

    expect(getByText("PREV")).toHaveAttribute("disabled")
  })
})
