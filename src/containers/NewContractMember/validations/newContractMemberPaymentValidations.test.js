import { buildInitialValues } from "../newContractMember.values"
import newContractMemberPaymentValidations from "./newContractMemberPaymentValidations"

describe("New contract member payment validation", () => {
  test("defaults to IBAN and accepts a valid direct debit payment", async () => {
    const values = buildInitialValues("ca", "periods")

    expect(values.new_member.payment_method).toBe(undefined)
    await expect(
      newContractMemberPaymentValidations.validate({
        new_member: {
          payment_method: "iban",
          iban: "ES9121000418450200051332",
          iban_valid: true,
          sepa_accepted: true,
        },
      }),
    ).resolves.toBeDefined()
  })

  test("requires the payment method", async () => {
    await expect(
      newContractMemberPaymentValidations.validate({
        new_member: {},
      }),
    ).rejects.toMatchObject({
      errors: ["REQUIRED_FIELD"],
    })
  })

  test("rejects direct debit payments when IBAN checks are not accepted", async () => {
    await expect(
      newContractMemberPaymentValidations.validate(
        {
          new_member: {
            payment_method: "iban",
            iban: "ES9121000418450200051332",
            iban_valid: false,
            sepa_accepted: false,
          },
        },
        { abortEarly: false },
      ),
    ).rejects.toMatchObject({
      errors: ["IBAN_ERROR", "REQUIRED_FIELD"],
    })
  })

  test("rejects credit card payments without authorization acceptance", async () => {
    await expect(
      newContractMemberPaymentValidations.validate({
        new_member: { payment_method: "credit_card" },
      }),
    ).rejects.toMatchObject({
      errors: ["REQUIRED_FIELD"],
    })
  })
})
