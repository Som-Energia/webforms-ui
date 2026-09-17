import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test, vi } from "vitest"

import Chooser from "./Chooser"

const baseOptions = [
  {
    value: "a",
    label: "Option A",
    description: "Description A",
    helper: <div>Helper A</div>,
  },
  {
    value: "b",
    label: "Option B",
    description: 'Description <a href="#details">B</a>',
    helper: <div>Helper B</div>,
  },
]

const renderChooser = (props = {}) => {
  return render(
    <Chooser
      question="Chooser question"
      options={baseOptions}
      value="a"
      name="chooser"
      onChange={vi.fn()}
      {...props}
    />,
  )
}

describe("OldComponents/Chooser", () => {
  test("renders question, options, descriptions and helpers", () => {
    renderChooser()

    expect(screen.getByText("Chooser question")).toBeInTheDocument()
    expect(screen.getByText("Option A")).toBeInTheDocument()
    expect(screen.getByText("Option B")).toBeInTheDocument()
    expect(screen.getByText("Description A")).toBeInTheDocument()
    expect(screen.getByText("B")).toBeInTheDocument()
    expect(screen.getByText("Helper A")).toBeInTheDocument()
    expect(screen.getByText("Helper B")).toBeInTheDocument()
  })

  test("marks the provided value as selected", () => {
    renderChooser({ value: "a" })

    const radios = screen.getAllByRole("radio")
    expect(radios[0]).toBeChecked()
    expect(radios[1]).not.toBeChecked()
  })

  test("calls onChange with the clicked option", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    renderChooser({ onChange })

    await user.click(screen.getByText("Option B"))

    expect(onChange).toHaveBeenCalledWith({ option: "b" })
  })

  test("clears the selected option when clicking the same option and canBeEmpty is true", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    renderChooser({ onChange, value: "a", canBeEmpty: true })

    await user.click(screen.getByText("Option A"))

    expect(onChange).toHaveBeenCalledWith({ option: undefined })
  })

  test("keeps the selected option when canBeEmpty is false", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    renderChooser({ onChange, value: "a", canBeEmpty: false })

    await user.click(screen.getByText("Option A"))

    expect(onChange).toHaveBeenCalledWith({ option: "a" })
  })

  test("does not trigger selection when clicking a link inside the description", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    renderChooser({ onChange })

    await user.click(screen.getByRole("link", { name: "B" }))

    expect(onChange).not.toHaveBeenCalled()
  })

  test("does not fail when using the default onChange handler", async () => {
    const user = userEvent.setup()

    render(
      <Chooser
        question="Chooser question"
        options={baseOptions}
        value="a"
        name="chooser"
      />,
    )

    await user.click(screen.getByText("Option B"))

    expect(screen.getByText("Option B")).toBeInTheDocument()
  })

  test("does not trigger selection when disabled", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    renderChooser({ onChange, disabled: true })

    await user.click(screen.getByText("Option B"))

    expect(onChange).not.toHaveBeenCalled()
    expect(screen.getAllByRole("radio")[0]).toBeDisabled()
    expect(screen.getAllByRole("radio")[1]).toBeDisabled()
  })

  test("renders the radio group with the provided name", () => {
    renderChooser({ name: "special-chooser" })

    expect(
      document.querySelector('[data-cy="special-chooser"]'),
    ).toBeInTheDocument()
  })

  test("renders options without descriptions when they are not provided", () => {
    render(
      <Chooser
        question="Chooser question"
        name="chooser"
        value="a"
        options={[
          { value: "a", label: "Option A" },
          { value: "b", label: "Option B" },
        ]}
      />,
    )

    const optionA = screen.getByText("Option A").closest("div")
    expect(screen.queryByText("Description A")).not.toBeInTheDocument()
    expect(optionA).toBeInTheDocument()
  })

  test("supports condensed and alignTop layouts without breaking interaction", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    renderChooser({ onChange, condensed: true, alignTop: true })

    const optionBox = screen.getByText("Option B").closest("div")
    expect(optionBox).toBeInTheDocument()

    await user.click(screen.getByText("Option B"))

    expect(onChange).toHaveBeenCalledWith({ option: "b" })
  })
})
