import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { vi } from "vitest"

vi.mock("react-i18next", async () => import("../../../tests/__mocks__/i18n.js"))

vi.mock("../../../services/utils", async () => {
  const actual = await vi.importActual("../../../services/utils")

  return {
    ...actual,
    checkIbanFormat: vi.fn(),
  }
})

import { checkIbanFormat } from "../../../services/utils"
import PaymentMethod from "./PaymentMethod"

const defaultValues = {
  new_member: {
    payment_method: "",
    iban: "",
    iban_valid: undefined,
    sepa_accepted: false,
    payment_authorization_accepted: false,
  },
}

const renderPaymentMethod = (overrideProps = {}) => {
  const props = {
    values: defaultValues,
    errors: {},
    touched: {},
    setFieldValue: vi.fn(),
    setFieldError: vi.fn(),
    setFieldTouched: vi.fn(),
    ...overrideProps,
  }

  return {
    ...render(<PaymentMethod {...props} />),
    props,
  }
}

describe("PaymentMethod", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test("renders the payment title, question and both chooser options", () => {
    renderPaymentMethod()

    expect(screen.getByText("MEMBER_PAGE_PAYMENT_METHOD")).toBeInTheDocument()
    expect(
      screen.getByText("MEMBER_PAGE_PAYMENT_METHOD_QUESTION"),
    ).toBeInTheDocument()
    expect(screen.getByText("PAYMENT_METHOD_IBAN")).toBeInTheDocument()
    expect(screen.getByText("PAYMENT_METHOD_IBAN_DESC")).toBeInTheDocument()
    expect(screen.getByText("PAYMENT_METHOD_CCARD")).toBeInTheDocument()
    expect(screen.getByText("PAYMENT_METHOD_CCARD_DESC")).toBeInTheDocument()
  })

  test("selecting iban updates the payment_method field", async () => {
    const user = userEvent.setup()
    const { props } = renderPaymentMethod()

    await user.click(
      screen.getByText("PAYMENT_METHOD_IBAN").closest("[role='button']"),
    )

    expect(props.setFieldValue).toHaveBeenCalledWith(
      "new_member.payment_method",
      "iban",
    )
  })

  test("renders the iban field for iban payments and formats input before saving", () => {
    const { props, container } = renderPaymentMethod({
      values: {
        new_member: {
          ...defaultValues.new_member,
          payment_method: "iban",
        },
      },
    })

    expect(screen.getByText("MEMBER_PAGE_IBAN")).toBeInTheDocument()

    const ibanInput = container.querySelector('[data-cy="iban_number-input"]')

    fireEvent.change(ibanInput, {
      target: { value: "es91 2100 0418 4502 0005 1332" },
    })

    expect(props.setFieldValue).toHaveBeenCalledWith(
      "new_member.iban",
      "ES91 2100 0418 4502 0005 1332",
    )
  })

  test("marks iban as touched on blur", () => {
    const { props, container } = renderPaymentMethod({
      values: {
        new_member: {
          ...defaultValues.new_member,
          payment_method: "iban",
        },
      },
    })

    const ibanInput = container.querySelector('[data-cy="iban_number-input"]')

    fireEvent.blur(ibanInput)

    expect(props.setFieldTouched).toHaveBeenCalledWith("new_member.iban", true)
  })

  test("validates a long iban and stores the valid flag when the format is valid", async () => {
    checkIbanFormat.mockReturnValue(true)

    const longIban = "ES91 2100 0418 4502 0005 1332"
    const { props } = renderPaymentMethod({
      values: {
        new_member: {
          ...defaultValues.new_member,
          payment_method: "iban",
          iban: longIban,
        },
      },
    })

    await waitFor(() => {
      expect(checkIbanFormat).toHaveBeenCalledWith(longIban)
    })

    await waitFor(() => {
      expect(props.setFieldError).toHaveBeenCalledWith(
        "new_member.iban_valid",
        undefined,
      )
      expect(props.setFieldValue).toHaveBeenCalledWith(
        "new_member.iban_valid",
        true,
      )
    })
  })

  test("validates a long iban and stores the error when the format is invalid", async () => {
    checkIbanFormat.mockReturnValue(false)

    const longIban = "ES91 2100 0418 4502 0005 1332"
    const { props } = renderPaymentMethod({
      values: {
        new_member: {
          ...defaultValues.new_member,
          payment_method: "iban",
          iban: longIban,
        },
      },
    })

    await waitFor(() => {
      expect(checkIbanFormat).toHaveBeenCalledWith(longIban)
    })

    await waitFor(() => {
      expect(props.setFieldError).toHaveBeenCalledWith(
        "new_member.iban_valid",
        "INVALID_IBAN",
      )
      expect(props.setFieldValue).toHaveBeenCalledWith(
        "new_member.iban_valid",
        false,
      )
    })
  })

  test("shows the iban authorization checkbox and updates sepa acceptance", async () => {
    const user = userEvent.setup()
    const { props, container } = renderPaymentMethod({
      values: {
        new_member: {
          ...defaultValues.new_member,
          payment_method: "iban",
        },
      },
    })

    expect(screen.getByText("IBAN_ACCEPT_DIRECT_DEBIT")).toBeInTheDocument()

    await user.click(container.querySelector('[data-cy="iban_check"]'))

    expect(props.setFieldValue).toHaveBeenCalledWith(
      "new_member.sepa_accepted",
      true,
    )
    expect(props.setFieldTouched).toHaveBeenCalledWith(
      "new_member.sepa_accepted",
      true,
    )
  })

  test("shows the credit card authorization checkbox and updates card acceptance", async () => {
    const user = userEvent.setup()
    const { props, container } = renderPaymentMethod({
      values: {
        new_member: {
          ...defaultValues.new_member,
          payment_method: "credit_card",
        },
      },
    })

    expect(screen.getByText("PAYMENT_METHOD_CCARD_ACCEPT")).toBeInTheDocument()

    await user.click(container.querySelector('[data-cy="iban_check"]'))

    expect(props.setFieldValue).toHaveBeenCalledWith(
      "new_member.payment_authorization_accepted",
      true,
    )
    expect(props.setFieldTouched).toHaveBeenCalledWith(
      "new_member.payment_authorization_accepted",
      true,
    )
  })
})
