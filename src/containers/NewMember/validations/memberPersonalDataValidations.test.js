import identifyMemberPersonalDataValidations from "../../NewContractMember/validations/identifyMemberPersonalDataValidations"
import memberPersonalDataValidations from "./memberPersonalDataValidations"

describe.each([
  ["new member", memberPersonalDataValidations],
  ["new contract member", identifyMemberPersonalDataValidations],
])("Email validation for %s", (_name, schema) => {
  test("accepts confirmation with different casing without changing the values", async () => {
    const values = {
      new_member: { email: "Nom@EXEMPLE.CAT", email2: "nom@exemple.cat" },
    }
    const original = structuredClone(values)

    await expect(schema.validateAt("new_member.email2", values)).resolves.toBe(
      "nom@exemple.cat",
    )
    expect(values).toStrictEqual(original)
  })

  test("rejects a genuinely different confirmation", async () => {
    const values = {
      new_member: { email: "Nom@EXEMPLE.CAT", email2: "altre@exemple.cat" },
    }

    await expect(
      schema.validateAt("new_member.email2", values),
    ).rejects.toThrow("NO_REPEATED_EMAIL")
  })

  test.each(["", "correu-incorrecte"])(
    "rejects an empty or invalid email: %s",
    async (email) => {
      await expect(
        schema.validateAt("new_member.email", { new_member: { email } }),
      ).rejects.toThrow("NO_EMAIL")
    },
  )
})
