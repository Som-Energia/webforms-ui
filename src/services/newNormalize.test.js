import { buildInitialValues } from "../containers/NewContractMember/newContractMember.values"
import {
  newNormalizeContract,
  normalizeAddress,
  normalizeAttachments,
  normalizeClient,
  normalizeSelfconsumption,
} from "./newNormalize"
import {
  address,
  client,
  selfconsumption,
  supply_point_attachments,
} from "./utilsMockData/common"
import newContractCases from "./utilsMockData/forms/newContract"

describe("Check Address (normalize function)", () => {
  test("Normalize Address", () => {
    expect(normalizeAddress(address.entryValues)).toStrictEqual(
      address.normalizedData,
    )
  })
})

describe("Check Selfconsumption (normalize function)", () => {
  test("Normalize Selfconsumption", () => {
    expect(normalizeSelfconsumption(selfconsumption.entryValues)).toStrictEqual(
      selfconsumption.normalizedData,
    )
  })
})

describe("Check Client (normalize function)", () => {
  test.each(["physical", "juridic"])(
    "normalizes a %s client email without changing the original values",
    (personType) => {
      const values = {
        ...client[personType].entryValues,
        email: client[personType].entryValues.email.toUpperCase(),
      }
      const original = structuredClone(values)

      expect(normalizeClient(values)).toStrictEqual(
        client[personType].normalizedData,
      )
      expect(values).toStrictEqual(original)
    },
  )
})

describe("Check Attachments (normalize function)", () => {
  test("Normalize Attachments (new_contract)", () => {
    expect(
      normalizeAttachments(
        supply_point_attachments.new_contract.entryValues.filename,
        supply_point_attachments.new_contract.entryValues.process,
      ),
    ).toStrictEqual(supply_point_attachments.new_contract.normalizedData)
  })

  test("Normalize Attachments (invoice)", () => {
    expect(
      normalizeAttachments(
        supply_point_attachments.invoice.entryValues.filename,
        supply_point_attachments.invoice.entryValues.process,
      ),
    ).toStrictEqual(supply_point_attachments.invoice.normalizedData)
  })
})

describe("Check Contract new Form (normalize function)", () => {
  test("includes the sponsored token from initial values in the payload", () => {
    const { token } = buildInitialValues("ca", {
      tariff_mode: "periods",
      token: "example-token",
    })
    const values = { ...newContractCases.sponsored.entryValues, token }

    expect(newNormalizeContract(values).token).toBe("example-token")
  })

  test("omits the token when it is not provided", () => {
    const values = buildInitialValues("ca", { tariff_mode: "periods" })
    expect(values).not.toHaveProperty("token")
    expect(
      newNormalizeContract(newContractCases.sponsored.entryValues),
    ).not.toHaveProperty("token")
  })
  test("Normalize Contract data (alreadyMember)", () => {
    expect(
      newNormalizeContract(newContractCases.alreadyMember.entryValues),
    ).toStrictEqual(newContractCases.alreadyMember.normalizedData)
  })

  test.each(["sponsored", "newMember"])(
    "normalizes the email for %s without changing the form values",
    (contractCase) => {
      const { entryValues, normalizedData } = newContractCases[contractCase]

      const formValues = structuredClone(entryValues)
      formValues.new_member.email = formValues.new_member.email.toUpperCase()
      const formValuesBeforeNormalization = structuredClone(formValues)

      const normalizedContract = newNormalizeContract(formValues)

      expect(normalizedContract).toStrictEqual(normalizedData)
      expect(formValues).toStrictEqual(formValuesBeforeNormalization)
    },
  )

  test("Normalize Contract data (campaign-offer)", () => {
    expect(
      newNormalizeContract(newContractCases.campaign.entryValues),
    ).toStrictEqual(newContractCases.campaign.normalizedData)
  })

  test("Normalize Contract data (A3 indexed)", () => {
    expect(
      newNormalizeContract(newContractCases.A3_indexed.entryValues),
    ).toStrictEqual(newContractCases.A3_indexed.normalizedData)
  })

  test("Normalize Contract data (A3 periods has_light=light-off)", () => {
    expect(
      newNormalizeContract(newContractCases.A3_periods_has_light.entryValues),
    ).toStrictEqual(newContractCases.A3_periods_has_light.normalizedData)
  })

  test("Normalize Contract data (C2 3.0TD)", () => {
    expect(
      newNormalizeContract(newContractCases.C2_30TD.entryValues),
    ).toStrictEqual(newContractCases.C2_30TD.normalizedData)
  })

  test("Normalize Contract data (selfconsumption)", () => {
    expect(
      newNormalizeContract(newContractCases.selfconsumption.entryValues),
    ).toStrictEqual(newContractCases.selfconsumption.normalizedData)
  })

  test("Normalize Contract data (cadastral reference)", () => {
    expect(
      newNormalizeContract(newContractCases.cadastraslReference.entryValues),
    ).toStrictEqual(newContractCases.cadastraslReference.normalizedData)
  })

  test("Normalize Contract data (tpv)", () => {
    expect(
      newNormalizeContract(newContractCases.paymentTPV.entryValues),
    ).toStrictEqual(newContractCases.paymentTPV.normalizedData)
  })

  test("Normalize Contract data (owner)", () => {
    const normalizedContract = newNormalizeContract(
      newContractCases.newMember.entryValues,
      undefined,
      "owner",
    )
    expect(normalizedContract).toMatchObject({
      owner: "owner",
    })
  })

  test("Normalize Contract data (lead_tag)", () => {
    const normalizedContract = newNormalizeContract(
      newContractCases.newMember.entryValues,
      undefined,
      undefined,
      "lead_tag",
    )
    expect(normalizedContract).toMatchObject({
      lead_tag: "lead_tag",
    })
  })
})
