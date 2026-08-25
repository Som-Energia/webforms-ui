import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { vi } from "vitest"

import PhoneField from "./PhoneField"

vi.mock("react-i18next", async () => import("../tests/__mocks__/i18n.js"))

const phoneMocks = vi.hoisted(() => ({
  isValidPhoneNumber: vi.fn(),
}))

vi.mock("libphonenumber-js", async () => {
  const actual = await vi.importActual("libphonenumber-js")

  return {
    ...actual,
    isValidPhoneNumber: phoneMocks.isValidPhoneNumber,
  }
})

const buildProps = (overrides = {}) => ({
  name: "phone",
  textFieldName: "PHONE",
  values: {
    new_member: {
      phone: "",
      phone_code: "",
    },
  },
  errors: {
    new_member: {},
  },
  touched: {
    new_member: {},
  },
  setFieldValue: vi.fn(),
  setFieldTouched: vi.fn(),
  required: false,
  ...overrides,
})

const renderPhoneField = (overrides = {}) => {
  const props = buildProps(overrides)
  const result = render(<PhoneField {...props} />)

  return {
    ...result,
    props,
  }
}

const getInput = () => document.querySelector('[data-cy="phone-input"]')
const getCountryCodeSelect = () => screen.getByRole("combobox")

describe("PhoneField", () => {
  beforeEach(() => {
    phoneMocks.isValidPhoneNumber.mockReturnValue(false)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  test("renders the title and required marker", () => {
    renderPhoneField({ required: true })

    expect(screen.getByText("PHONE")).toBeInTheDocument()
    expect(screen.getByText("*")).toBeInTheDocument()
    expect(getInput()).toBeInTheDocument()
    expect(getCountryCodeSelect()).toBeInTheDocument()
  })

  test("uses the initial phone and phone_code values when provided", () => {
    renderPhoneField({
      values: {
        new_member: {
          phone: "612345678",
          phone_code: "+33",
        },
      },
    })

    expect(getInput()).toHaveValue("612345678")
    expect(getCountryCodeSelect()).toHaveTextContent("+33")
  })

  test("falls back to +34 when there is no initial phone_code", () => {
    renderPhoneField({
      values: {
        new_member: {
          phone: "612345678",
        },
      },
    })

    expect(getCountryCodeSelect()).toHaveTextContent("+34")
  })

  test("sanitizes the input before persisting it", async () => {
    const setFieldValue = vi.fn()

    phoneMocks.isValidPhoneNumber.mockImplementation(
      (fullPhoneNumber) => fullPhoneNumber === "+34612345678",
    )

    renderPhoneField({ setFieldValue })

    fireEvent.change(getInput(), {
      target: { value: "  +00612345678 " },
    })

    expect(getInput()).toHaveValue("612345678")

    await waitFor(() => {
      expect(setFieldValue).toHaveBeenCalledWith("phone", "612345678")
    })
  })

  test("updates the stored country code when the selected code changes", async () => {
    const user = userEvent.setup()
    const setFieldValue = vi.fn()

    phoneMocks.isValidPhoneNumber.mockImplementation(
      (fullPhoneNumber) => fullPhoneNumber === "+33612345678",
    )

    renderPhoneField({
      setFieldValue,
      values: {
        new_member: {
          phone: "612345678",
        },
      },
    })

    await user.click(getCountryCodeSelect())

    const listbox = within(screen.getByRole("presentation")).getByRole(
      "listbox",
    )
    await user.click(within(listbox).getByRole("option", { name: "+33 (FR)" }))

    await waitFor(() => {
      expect(setFieldValue).toHaveBeenCalledWith("phone_code", "+33")
    })
  })

  test("marks the field as touched on blur", async () => {
    const setFieldTouched = vi.fn()

    renderPhoneField({ setFieldTouched })

    fireEvent.blur(getInput())

    await waitFor(() => {
      expect(setFieldTouched).toHaveBeenCalledWith("phone", true)
    })
  })

  test("sets phone_valid to true when the current number is valid", async () => {
    const setFieldValue = vi.fn()

    phoneMocks.isValidPhoneNumber.mockImplementation(
      (fullPhoneNumber) => fullPhoneNumber === "+34612345678",
    )

    renderPhoneField({
      setFieldValue,
      values: {
        new_member: {
          phone: "612345678",
        },
      },
    })

    await waitFor(() => {
      expect(setFieldValue).toHaveBeenCalledWith("phone_valid", true)
    })
  })

  test("sets phone_valid to false when the current number is invalid", async () => {
    const setFieldValue = vi.fn()

    renderPhoneField({
      setFieldValue,
      values: {
        new_member: {
          phone: "123",
        },
      },
    })

    await waitFor(() => {
      expect(setFieldValue).toHaveBeenCalledWith("phone_valid", false)
    })
  })
})
