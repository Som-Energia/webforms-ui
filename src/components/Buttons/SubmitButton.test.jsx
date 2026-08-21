import { queryByAttribute, render } from "@testing-library/react"
import { vi } from "vitest"

import SubmitButton from "./SubmitButton"

vi.mock("react-i18next", async () => import("../../tests/__mocks__/i18n.js"))

describe("SumitButton component ", () => {
  test("SubmitButton renders without crashing", () => {
    const dom = render(<SubmitButton />)

    const getByDataCy = queryByAttribute.bind(null, "data-cy")
    const button = getByDataCy(dom.container, "next")
    expect(button).toBeInTheDocument()
  })

  test("SubmitButton renders and text is shown", async () => {
    const { queryByText } = render(<SubmitButton text={"FINISH"} />)
    expect(queryByText("FINISH")).toBeInTheDocument()
  })

  test("SubmitButton renders and children elements is shown", async () => {
    const { queryByText } = render(<SubmitButton>{"FINISH"}</SubmitButton>)
    expect(queryByText("FINISH")).toBeInTheDocument()
  })

  test("SubmitButton renders disabled", async () => {
    const { queryByText } = render(
      <SubmitButton text={"FINISH"} disabled={true} />,
    )

    expect(queryByText("FINISH")).toHaveAttribute("disabled")
  })

  test("SubmitButton renders showing sending progressbar", async () => {
    const { getByRole } = render(
      <SubmitButton text={"FINISH"} sending={true} />,
    )

    expect(getByRole("progressbar")).toBeInTheDocument()
  })
})
