import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined"

import { fireEvent, render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { vi } from "vitest"

import Chooser from "./Chooser"

const icon1 = <LightbulbOutlinedIcon />
const icon2 = <CheckCircleIcon />

const chooserOptions = [
  {
    id: "a",
    textHeader: "Option A",
    textBody: "This is option A",
    icon: icon1,
    helper: "helper-a",
  },
  {
    id: "b",
    textHeader: "Option B",
    textBody: "This is option B",
    icon: icon2,
    helper: "helper-b",
  },
]

const chooserOptionsWithoutBodyText = [
  { id: "a", textHeader: "Option A" },
  { id: "b", textHeader: "Option B" },
]

describe("Chooser", () => {
  test("renders without options", () => {
    render(<Chooser name="chooser-name" value={"a"} options={[]} />)

    expect(screen.queryAllByRole("button")).toHaveLength(0)
  })

  test("renders the expected options", () => {
    render(<Chooser name="chooser-name" value={"a"} options={chooserOptions} />)

    const buttons = screen.getAllByRole("button")
    expect(buttons).toHaveLength(2)

    const optionA = within(buttons[0])
    expect(optionA.getByText("Option A")).toBeInTheDocument()
    expect(optionA.getByText("This is option A")).toBeInTheDocument()

    const optionB = within(buttons[1])
    expect(optionB.getByText("Option B")).toBeInTheDocument()
    expect(optionB.getByText("This is option B")).toBeInTheDocument()
  })

  test("renders options without textBody", () => {
    render(
      <Chooser
        name="chooser-name"
        value={"a"}
        options={chooserOptionsWithoutBodyText}
      />,
    )

    const buttons = screen.getAllByRole("button")
    expect(buttons).toHaveLength(2)

    const optionA = within(buttons[0])
    expect(optionA.getByText("Option A")).toBeInTheDocument()

    const optionB = within(buttons[1])
    expect(optionB.getByText("Option B")).toBeInTheDocument()
  })

  test("calls handleChange with the clicked option id", async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()

    render(
      <Chooser
        name="chooser-name"
        value={"a"}
        options={chooserOptions}
        handleChange={handleChange}
      />,
    )

    const buttons = screen.getAllByRole("button")

    await user.click(buttons[1])

    expect(handleChange).toHaveBeenCalledWith("b")
  })

  test("allows selecting an option with Enter", async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()

    render(
      <Chooser
        name="chooser-name"
        value={"a"}
        options={chooserOptions}
        handleChange={handleChange}
      />,
    )

    const buttons = screen.getAllByRole("button")
    buttons[1].focus()

    await user.keyboard("{Enter}")

    expect(handleChange).toHaveBeenCalledWith("b")
  })

  test("allows selecting an option with the literal space key", () => {
    const handleChange = vi.fn()

    render(
      <Chooser
        name="chooser-name"
        value={"a"}
        options={chooserOptions}
        handleChange={handleChange}
      />,
    )

    const buttons = screen.getAllByRole("button")
    buttons[1].focus()

    fireEvent.keyDown(buttons[1], { key: " " })

    expect(handleChange).toHaveBeenCalledWith("b")
  })

  test("does not select an option for unrelated keys", () => {
    const handleChange = vi.fn()

    render(
      <Chooser
        name="chooser-name"
        value={"a"}
        options={chooserOptions}
        handleChange={handleChange}
      />,
    )

    const buttons = screen.getAllByRole("button")

    fireEvent.keyDown(buttons[1], { key: "Escape" })

    expect(handleChange).not.toHaveBeenCalled()
  })

  test("renders the selected indicator only for the selected option", () => {
    render(<Chooser name="chooser-name" value={"a"} options={chooserOptions} />)

    const [selectedOption, unselectedOption] = screen.getAllByRole("button")

    expect(within(selectedOption).getByRole("checkbox")).toBeChecked()
    expect(
      within(unselectedOption).queryByRole("checkbox"),
    ).not.toBeInTheDocument()
  })

  test("renders option helpers", async () => {
    render(<Chooser name="chooser-name" value={"a"} options={chooserOptions} />)

    const items = screen.getAllByRole("button")
    expect(items).toHaveLength(2)

    const helperA = await screen.findByText("helper-a")
    expect(helperA).toBeInTheDocument()

    const helperB = await screen.findByText("helper-b")
    expect(helperB).toBeInTheDocument()
  })

  test("renders option icons", () => {
    render(<Chooser name="chooser-name" value={"a"} options={chooserOptions} />)

    const items = screen.getAllByRole("button")
    expect(items).toHaveLength(2)

    const [firstItem, secondItem] = items
    const firstIconElement = within(firstItem).getByTestId(
      "LightbulbOutlinedIcon",
    )
    expect(firstIconElement).toBeInTheDocument()

    const secondIconElement = within(secondItem).getByTestId("CheckCircleIcon")
    expect(secondIconElement).toBeInTheDocument()
  })
})
