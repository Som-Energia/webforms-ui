import { vi } from "vitest"

import {
  newNormalizeContract,
  newNormalizeHolderChange,
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

describe("Normalize new holder-change form", () => {
  let data

  beforeEach(() => {
    data = {
      cups: "ES0031405905577001DH0F",
      has_member: "member-off",
      member: { link_member: false, nif: "12345678P", number: "S12345" },
      new_member: { ...client.physical.entryValues },
      address: structuredClone(address.entryValues),
      voluntary_donation: true,
      privacy_policy_accepted: true,
      generic_conditions_accepted: true,
      statutes_accepted: true,
      comercial_info_accepted: false,
      especial_cases: undefined,
      supply_point: {
        attachments_reason_death: [],
        attachments_reason_merge: [],
        attachments_reason_electrodep: [],
        attachments_reason_electrodep_census: [],
      },
    }
    vi.spyOn(console, "log").mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test("normalizes the complete direct-debit payload", () => {
    expect(newNormalizeHolderChange(data)).toStrictEqual({
      linked_member: "new-member",
      contract_info: { cups: data.cups },
      payment_type: "remesa",
      iban: client.physical.entryValues.iban,
      sepa_accepted: true,
      donation: true,
      privacy_conditions: true,
      general_contract_terms_accepted: true,
      statutes_accepted: true,
      signature: true,
      contract_owner: {
        ...client.physical.normalizedData,
        address: address.normalizedData,
      },
      especial_cases: {
        reason_death: false,
        reason_merge: false,
        reason_electrodep: false,
      },
    })
  })

  test.each([
    ["member-on", true, "already_member"],
    ["member-off", true, "sponsored"],
    ["member-off", false, "new-member"],
    ["member-on", false, "without-member"],
  ])("maps %s with link_member=%s to %s", (hasMember, linkMember, expected) => {
    data.has_member = hasMember
    data.member.link_member = linkMember

    const result = newNormalizeHolderChange(data)

    expect(result.linked_member).toBe(expected)
    if (linkMember) {
      expect(result.linked_member_info).toStrictEqual({
        vat: "12345678P",
        code: "S12345",
      })
    } else {
      expect(result).not.toHaveProperty("linked_member_info")
    }
    expect(result).not.toHaveProperty("new_member_info")
  })

  test.each([true, false])(
    "uses credit-card authorization=%s without direct-debit fields",
    (accepted) => {
      data.new_member.payment_method = "credit_card"
      data.new_member.payment_authorization_accepted = accepted

      const result = newNormalizeHolderChange(data)

      expect(result.payment_type).toBe("tpv")
      expect(result.payment_authorization_accepted).toBe(accepted)
      expect(result).not.toHaveProperty("iban")
      expect(result).not.toHaveProperty("sepa_accepted")
    },
  )

  test("preserves false consent and donation values", () => {
    data.new_member.sepa_accepted = false
    data.voluntary_donation = false
    data.privacy_policy_accepted = false
    data.generic_conditions_accepted = false
    data.statutes_accepted = false

    expect(newNormalizeHolderChange(data)).toMatchObject({
      sepa_accepted: false,
      donation: false,
      privacy_conditions: false,
      general_contract_terms_accepted: false,
      statutes_accepted: false,
    })
  })

  test("normalizes a legal-person owner and their address", () => {
    data.new_member = { ...client.juridic.entryValues }

    expect(newNormalizeHolderChange(data).contract_owner).toStrictEqual({
      ...client.juridic.normalizedData,
      address: address.normalizedData,
    })
  })

  test.each([true, false, undefined])(
    "includes commercial consent only when accepted (%s)",
    (accepted) => {
      data.comercial_info_accepted = accepted

      const result = newNormalizeHolderChange(data)

      if (accepted) {
        expect(result.comercial_info_accepted).toBe(true)
      } else {
        expect(result).not.toHaveProperty("comercial_info_accepted")
      }
    },
  )

  test.each(["reason_death", "reason_merge", "reason_electrodep"])(
    "enables only the selected special case (%s)",
    (reason) => {
      data.especial_cases = reason

      expect(newNormalizeHolderChange(data).especial_cases).toStrictEqual({
        reason_death: reason === "reason_death",
        reason_merge: reason === "reason_merge",
        reason_electrodep: reason === "reason_electrodep",
      })
    },
  )

  test("omits attachments when all upload lists are empty", () => {
    expect(newNormalizeHolderChange(data)).not.toHaveProperty("attachments")
  })

  test.each([
    ["reason_death", "attachments_reason_death", "holder_change_death"],
    ["reason_merge", "attachments_reason_merge", "holder_change_merge"],
    [
      "reason_electrodep",
      "attachments_reason_electrodep",
      "holder_change_medical",
    ],
    [
      "reason_electrodep",
      "attachments_reason_electrodep_census",
      "holder_change_medical",
    ],
  ])("includes uploaded files from %s / %s", (reason, field, category) => {
    data.especial_cases = reason
    data.supply_point[field] = [
      { filename: "document.pdf", filehash: "document-hash" },
      { filename: "another.pdf", filehash: "another-hash" },
    ]

    expect(newNormalizeHolderChange(data).attachments).toEqual([
      { filename: "document-hash", category },
      { filename: "another-hash", category },
    ])
  })

  test.each([
    ["reason_death", "attachments_reason_death", "holder_change_death"],
    ["reason_merge", "attachments_reason_merge", "holder_change_merge"],
    [
      "reason_electrodep",
      "attachments_reason_electrodep",
      "holder_change_medical",
    ],
    [
      "reason_electrodep",
      "attachments_reason_electrodep_census",
      "holder_change_medical",
    ],
  ])(
    "includes a single uploaded file from %s / %s",
    (reason, field, category) => {
      data.especial_cases = reason
      data.supply_point[field] = [
        { filename: "document.pdf", filehash: "document-hash" },
      ]

      expect(newNormalizeHolderChange(data).attachments).toEqual([
        { filename: "document-hash", category },
      ])
    },
  )

  test("combines electrodependency and census uploads without mutating them", () => {
    data.especial_cases = "reason_electrodep"
    data.supply_point.attachments_reason_electrodep = [
      { filename: "medical.pdf", filehash: "medical-hash" },
    ]
    data.supply_point.attachments_reason_electrodep_census = [
      { filename: "census.pdf", filehash: "census-hash" },
    ]
    const original = structuredClone(data)

    expect(newNormalizeHolderChange(data).attachments).toEqual([
      { filename: "medical-hash", category: "holder_change_medical" },
      { filename: "census-hash", category: "holder_change_medical" },
    ])
    expect(data).toStrictEqual(original)
  })

  test("preserves each source category when combining all upload lists", () => {
    data.supply_point.attachments_reason_death = [{ filehash: "death-hash" }]
    data.supply_point.attachments_reason_merge = [{ filehash: "merge-hash" }]
    data.supply_point.attachments_reason_electrodep = [
      { filehash: "medical-hash" },
    ]
    data.supply_point.attachments_reason_electrodep_census = [
      { filehash: "census-hash" },
    ]
    const original = structuredClone(data)

    expect(newNormalizeHolderChange(data).attachments).toStrictEqual([
      { filename: "death-hash", category: "holder_change_death" },
      { filename: "merge-hash", category: "holder_change_merge" },
      { filename: "medical-hash", category: "holder_change_medical" },
      { filename: "census-hash", category: "holder_change_medical" },
    ])
    expect(data).toStrictEqual(original)
  })

  test("does not mutate the form values", () => {
    const original = structuredClone(data)

    newNormalizeHolderChange(data)

    expect(data).toStrictEqual(original)
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
  test("Normalize Client (phisical)", () => {
    expect(normalizeClient(client.physical.entryValues)).toStrictEqual(
      client.physical.normalizedData,
    )
  })

  test("Normalize Client (juridical)", () => {
    expect(normalizeClient(client.juridic.entryValues)).toStrictEqual(
      client.juridic.normalizedData,
    )
  })
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
  test("Normalize Contract data (alreadyMember)", () => {
    expect(
      newNormalizeContract(newContractCases.alreadyMember.entryValues),
    ).toStrictEqual(newContractCases.alreadyMember.normalizedData)
  })

  test("Normalize Contract data (sponsored)", () => {
    expect(
      newNormalizeContract(newContractCases.sponsored.entryValues),
    ).toStrictEqual(newContractCases.sponsored.normalizedData)
  })

  test("Normalize Contract data (campaign-offer)", () => {
    expect(
      newNormalizeContract(newContractCases.campaign.entryValues),
    ).toStrictEqual(newContractCases.campaign.normalizedData)
  })

  test("Normalize Contract data (newMember)", () => {
    expect(
      newNormalizeContract(newContractCases.newMember.entryValues),
    ).toStrictEqual(newContractCases.newMember.normalizedData)
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
})
