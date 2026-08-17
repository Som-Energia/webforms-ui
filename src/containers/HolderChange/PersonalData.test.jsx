import { fireEvent, render } from "@testing-library/react"
import { vi } from "vitest"

import PersonalData from "./PersonalData"

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key }),
}))

vi.mock("../../components/OldComponents/VATField", () => ({
  default: () => null,
}))

vi.mock("./StateCity", () => ({
  default: () => null,
}))

describe("PersonalData", () => {
  const values = {
    holder: {
      address: "",
      city: { id: "" },
      email: "",
      email2: "",
      ismember: false,
      language: "es_ES",
      postal_code: "",
      state: { id: "" },
    },
    member: {
      become_member: false,
      link_member: false,
    },
    privacy_policy_accepted: false,
  }

  const renderPersonalData = () => {
    const setFieldValue = vi.fn()

    const result = render(
      <PersonalData
        errors={{ holder: {} }}
        handleBlur={vi.fn()}
        handleChange={vi.fn()}
        setFieldTouched={vi.fn()}
        setFieldValue={setFieldValue}
        setValues={vi.fn()}
        touched={{ holder: {} }}
        values={values}
      />,
    )

    return { ...result, setFieldValue }
  }

  test("trims leading and trailing spaces from both email fields", () => {
    const { container, setFieldValue } = renderPersonalData()

    fireEvent.change(container.querySelector("#holder_email"), {
      target: { name: "holder.email", value: " alice@example.org " },
    })
    fireEvent.change(container.querySelector("#holder_email2"), {
      target: { name: "holder.email2", value: " alice@example.org " },
    })

    expect(setFieldValue).toHaveBeenNthCalledWith(
      1,
      "holder.email",
      "alice@example.org",
    )
    expect(setFieldValue).toHaveBeenNthCalledWith(
      2,
      "holder.email2",
      "alice@example.org",
    )
  })
})
