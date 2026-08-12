import { queryByAttribute, render, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { vi } from "vitest"

import { initI18n } from "../../tests/i18n.mock"
import Contact from "./Contact"

const renderContact = () =>
  render(
    <Contact
      nextStep={vi.fn()}
      prevStep={vi.fn()}
      handleStepChanges={vi.fn()}
    />,
  )

describe("Contact", async () => {
  await initI18n()

  const getById = queryByAttribute.bind(null, "id")

  test("keeps submit disabled until the contact details are valid", async () => {
    const user = userEvent.setup()
    const dom = renderContact()

    const submitButton = getById(dom.container, "nextButton")
    await waitFor(() => expect(submitButton).toBeDisabled())

    const inputName = getById(dom.container, "contactName")
    await user.type(inputName, "Aitor")
    await waitFor(() => expect(submitButton).toBeDisabled())

    const inputSurname = getById(dom.container, "contactSurname")
    await user.type(inputSurname, "Menta")
    await waitFor(() => expect(submitButton).toBeDisabled())

    const inputPhone = getById(dom.container, "phone")
    await user.type(inputPhone, "666666666")

    await waitFor(() => expect(submitButton).toBeEnabled())
  })
})
