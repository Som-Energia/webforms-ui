import { render, screen } from "@testing-library/react"
import { describe, expect, test, vi } from "vitest"

import NewContractMemberPayment from "./NewContractMemberPayment"

vi.mock("react-i18next", async () => import("../../../tests/__mocks__/i18n.js"))

const defaultValues = {
  has_member: "member-off",
  new_member: {
    payment_method: "",
    iban: "",
    iban_valid: undefined,
    sepa_accepted: false,
    payment_authorization_accepted: false,
  },
}

const renderNewContractMemberPayment = (overrideValues = {}) => {
  return render(
    <NewContractMemberPayment
      values={{
        ...defaultValues,
        ...overrideValues,
        new_member: {
          ...defaultValues.new_member,
          ...overrideValues.new_member,
        },
      }}
      errors={{}}
      touched={{}}
      setFieldValue={vi.fn()}
      setFieldError={vi.fn()}
      setFieldTouched={vi.fn()}
      sendTrackEvent={vi.fn()}
    />,
  )
}

describe("NewContractMemberPayment", () => {
  test.each(["member-on", "member-link"])(
    "does not show payment method descriptions for %s cases",
    (hasMember) => {
      renderNewContractMemberPayment({ has_member: hasMember })

      expect(
        screen.getByText("IBAN_PAYMENT_QUESTION_OPTION"),
      ).toBeInTheDocument()
      expect(screen.getByText("PAYMENT_METHOD_CCARD")).toBeInTheDocument()
      expect(
        screen.queryByText("PAYMENT_METHOD_IBAN_DESC"),
      ).not.toBeInTheDocument()
      expect(
        screen.queryByText("PAYMENT_METHOD_CCARD_DESC"),
      ).not.toBeInTheDocument()
    },
  )
})
