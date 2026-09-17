import { isValidElement } from "react"

import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { vi } from "vitest"

import PopUpContext from "../../../../context/PopUpContext"
import LightQuestion from "./LightQuestion"

vi.mock(
  "react-i18next",
  async () => import("../../../../tests/__mocks__/i18n.js"),
)

const renderLightQuestion = ({ values = { has_light: undefined } } = {}) => {
  const setFieldValue = vi.fn()
  const setContent = vi.fn()

  render(
    <PopUpContext.Provider value={{ setContent }}>
      <LightQuestion values={values} setFieldValue={setFieldValue} />
    </PopUpContext.Provider>,
  )

  return { setFieldValue, setContent }
}

const getOptionButton = (label) =>
  screen.getByText(label).closest('[role="button"]')

describe("LightQuestion", () => {
  test("renders the title and both chooser options", () => {
    renderLightQuestion()

    expect(screen.getByText("GURB_HAS_LIGHT_TITLE")).toBeInTheDocument()
    expect(screen.getByText("LIGHT_YES")).toBeInTheDocument()
    expect(screen.getByText("LIGHT_NO")).toBeInTheDocument()
    expect(screen.getAllByRole("button")).toHaveLength(2)
  })

  test("selecting light-on updates the field without opening the warning dialog", async () => {
    const user = userEvent.setup()
    const { setFieldValue, setContent } = renderLightQuestion()

    await user.click(getOptionButton("LIGHT_YES"))

    expect(setFieldValue).toHaveBeenCalledWith("has_light", "light-on")
    expect(setContent).not.toHaveBeenCalled()
  })

  test("selecting light-off updates the field and opens a warning dialog", async () => {
    const user = userEvent.setup()
    const { setFieldValue, setContent } = renderLightQuestion()

    await user.click(getOptionButton("LIGHT_NO"))

    expect(setFieldValue).toHaveBeenCalledWith("has_light", "light-off")
    expect(setContent).toHaveBeenCalledTimes(1)

    const [dialogElement] = setContent.mock.calls[0]

    expect(isValidElement(dialogElement)).toBe(true)
    expect(dialogElement.props).toMatchObject({
      severity: "warning",
      setContent,
      text1: "GURB_LIGHT_QUESTION_ERROR_MAIN_TEXT",
      text2: "GURB_LIGHT_QUESTION_ERROR_SECONDARY_TEXT",
    })
  })

  test("reflects the existing light-off selection", () => {
    renderLightQuestion({ values: { has_light: "light-off" } })

    const selectedOption = getOptionButton("LIGHT_NO")
    const unselectedOption = getOptionButton("LIGHT_YES")

    expect(selectedOption).not.toBeNull()
    expect(unselectedOption).not.toBeNull()
    expect(within(selectedOption).getByRole("checkbox")).toBeChecked()
    expect(
      within(unselectedOption).queryByRole("checkbox"),
    ).not.toBeInTheDocument()
  })
})
