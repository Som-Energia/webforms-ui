import {
  fireEvent,
  queryByAttribute,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { vi } from "vitest"

import Contact from "./Contact"

vi.mock("react-i18next", async () => import("../../tests/__mocks__/i18n.js"))

const renderContact = (props = {}) =>
  render(
    <Contact
      nextStep={vi.fn()}
      prevStep={vi.fn()}
      handleStepChanges={vi.fn()}
      params={{}}
      {...props}
    />,
  )

describe("Contact", () => {
  const getById = queryByAttribute.bind(null, "id")

  test("keeps submit disabled until the contact details are valid", async () => {
    const dom = renderContact()

    const submitButton = getById(dom.container, "nextButton")
    await waitFor(() => expect(submitButton).toBeDisabled())

    const inputName = getById(dom.container, "contactName")
    fireEvent.change(inputName, { target: { value: "Aitor" } })
    expect(submitButton).toBeDisabled()

    const inputSurname = getById(dom.container, "contactSurname")
    fireEvent.change(inputSurname, { target: { value: "Menta" } })
    expect(submitButton).toBeDisabled()

    const inputPhone = getById(dom.container, "phone")
    fireEvent.change(inputPhone, { target: { value: "666666666" } })

    await waitFor(() => expect(submitButton).toBeEnabled())
  })

  test("submits the hydrated contact values and advances to the next step", async () => {
    const nextStep = vi.fn()
    const handleStepChanges = vi.fn()

    const dom = renderContact({
      nextStep,
      handleStepChanges,
      params: {
        contactName: "Aitor",
        contactSurname: "Menta",
        phone: "666666666",
      },
    })

    const submitButton = getById(dom.container, "nextButton")
    await waitFor(() => expect(submitButton).toBeEnabled())

    fireEvent.click(submitButton)

    await waitFor(() =>
      expect(handleStepChanges).toHaveBeenCalledWith({
        contact: {
          contactName: "Aitor",
          contactSurname: "Menta",
          phone: "666666666",
        },
      }),
    )
    await waitFor(() => expect(nextStep).toHaveBeenCalledTimes(1))
  })

  test("shows the phone validation error after blur when the phone is invalid", async () => {
    const dom = renderContact()

    const inputPhone = getById(dom.container, "phone")

    fireEvent.change(inputPhone, { target: { value: "123" } })
    fireEvent.blur(inputPhone)

    expect(await screen.findByText("NO_PHONE")).toBeInTheDocument()
    expect(inputPhone).toHaveAttribute("aria-invalid", "true")
  })

  test("omits navigation buttons when their handlers are not provided", () => {
    const dom = renderContact({ nextStep: undefined, prevStep: undefined })

    expect(screen.queryByText("PREV")).not.toBeInTheDocument()
    expect(getById(dom.container, "nextButton")).not.toBeInTheDocument()
  })
})
