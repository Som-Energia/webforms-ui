import React from "react"
import { MemoryRouter } from "react-router-dom"

import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { vi } from "vitest"

import MemberIdentifierFields from "./MemberIdentifierFields"

import { checkMember } from "../../services/api"
import { checkVatFormat } from "../../services/utils"

vi.mock("react-i18next", async () => import("../../tests/__mocks__/i18n.js"))

vi.mock("../../services/api", () => ({
  checkMember: vi.fn(),
}))

vi.mock("../../services/utils", () => ({
  checkVatFormat: vi.fn(),
}))

const buildValues = (overrides = {}) => ({
  member: {
    number: "",
    vat: "",
    checked: false,
    ...overrides,
  },
})

const getMemberNumberInput = () =>
  screen.getByRole("textbox", { name: /MEMBER_NUMBER/i })

const getVatInput = () => screen.getByRole("textbox", { name: /NIF_LABEL/i })

const renderComponent = ({
  initialValues = buildValues(),
  route = "/",
  errors = {},
  touched = {},
} = {}) => {
  const setFieldValueSpy = vi.fn()

  function Harness() {
    const [values, setValues] = React.useState(initialValues)

    const setFieldValue = (field, value) => {
      setFieldValueSpy(field, value)
      const memberField = field.replace("member.", "")
      setValues((currentValues) => {
        if (currentValues.member[memberField] === value) {
          return currentValues
        }

        return {
          ...currentValues,
          member: {
            ...currentValues.member,
            [memberField]: value,
          },
        }
      })
    }

    return (
      <MemoryRouter
        initialEntries={[route]}
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}>
        <MemberIdentifierFields
          values={values}
          handleBlur={vi.fn()}
          errors={errors}
          touched={touched}
          setFieldValue={setFieldValue}
        />
      </MemoryRouter>
    )
  }

  return {
    user: userEvent.setup(),
    setFieldValueSpy,
    ...render(<Harness />),
  }
}

describe("MemberIdentifierFields", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    checkVatFormat.mockReturnValue({ isValid: true })
    checkMember.mockResolvedValue({ data: false })
  })

  test("prefills member data from the hash query and disables both inputs", async () => {
    renderComponent({
      route: "/?h=MTIzNDU7NDAzMjM4MzVN",
    })

    await waitFor(() => {
      expect(getMemberNumberInput()).toHaveValue("12345")
      expect(getVatInput()).toHaveValue("40323835M")
    })

    expect(getMemberNumberInput()).toBeDisabled()
    expect(getVatInput()).toBeDisabled()
  })

  test("sanitizes member inputs before validating an existing member", async () => {
    checkMember.mockResolvedValue({ data: true })

    const { user } = renderComponent()

    await user.type(getMemberNumberInput(), "12a3")
    await user.type(getVatInput(), "40323835m")

    await waitFor(() => {
      expect(checkMember).toHaveBeenLastCalledWith("123", "40323835M")
    })

    expect(await screen.findByText("MEMBER_FOUND")).toBeInTheDocument()
  })

  test("shows not found when the VAT format is invalid and skips the API call", async () => {
    checkVatFormat.mockReturnValue({ isValid: false })

    const { user } = renderComponent()

    await user.type(getMemberNumberInput(), "123")
    await user.type(getVatInput(), "invalid-vat")

    await waitFor(() => {
      expect(screen.getByText("MEMBER_NOT_FOUND")).toBeInTheDocument()
    })

    expect(checkMember).not.toHaveBeenCalled()
  })

  test("keeps the member as invalid when the member check API fails", async () => {
    checkMember.mockRejectedValue(new Error("network"))

    const { user } = renderComponent()

    await user.type(getMemberNumberInput(), "123")
    await user.type(getVatInput(), "40323835m")

    await waitFor(() => {
      expect(screen.getByText("MEMBER_NOT_FOUND")).toBeInTheDocument()
    })

    expect(checkMember).toHaveBeenLastCalledWith("123", "40323835M")
    expect(screen.queryByText("MEMBER_FOUND")).not.toBeInTheDocument()
  })

  test("ignores an invalid hash query without disabling the inputs", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined)

    renderComponent({
      route: "/?h=%",
    })

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Invalid hash code",
        expect.any(Error),
      )
    })

    expect(getMemberNumberInput()).toBeEnabled()
    expect(getVatInput()).toBeEnabled()

    consoleErrorSpy.mockRestore()
  })

  test("prioritizes field validation messages when fields were touched", () => {
    renderComponent({
      errors: {
        member: {
          number: "NUMBER_ERROR",
          vat: "VAT_ERROR",
        },
      },
      touched: {
        member: {
          number: true,
          vat: true,
        },
      },
    })

    expect(screen.getByText("NUMBER_ERROR")).toBeInTheDocument()
    expect(screen.getByText("VAT_ERROR")).toBeInTheDocument()
  })
})
