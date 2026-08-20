import { beforeEach, vi } from "vitest"

import { getMunicipisByPostalCode } from "./api"
import {
  calculateTariff,
  checkCAUWhileTyping,
  checkIbanFormat,
  checkIsTariff20,
  checkIsTariff30,
  checkIsTariffIndexed,
  checkPhisicalVAT,
  checkVatFormat,
  getUrlOrBrowserSessionLanguage,
  getNextNBussinesDays,
  isMatchingCUPSandCAU,
  isCompanyVat,
  newNormalizeMember,
  newTestPowerForPeriods,
  normalizeContract,
  normalizeContribution,
  normalizeD1ConfirmationData,
  normalizeHolderChange,
  normalizeMember,
  normalizeModifyData,
  prettyCAU,
  setMunicipisWithPostalCode,
  specialCaseType,
  testPowerForPeriods,
} from "./utils"
import contractCases from "./utilsMockData/forms/contract"
import d1Cases from "./utilsMockData/forms/d1"
import holderChangeCases from "./utilsMockData/forms/holderChange"
import memberCases from "./utilsMockData/forms/member"
import modifyContractCases from "./utilsMockData/forms/modifyContract"

vi.mock("./api", async (importActual) => {
  const actual = await importActual()

  return {
    ...actual,
    getMunicipisByPostalCode: vi.fn(),
  }
})

beforeEach(() => {
  vi.clearAllMocks()
})

describe("Check the utils functions", () => {
  const tariff20td = "2.0TD"
  const tariff30td = "3.0TD"
  const tariffWrong = "wrong"
  const tariff20A = "2.0A"
  const tariff20tdIndexada = "2.0TD Indexada"
  const tariff30tdIndexada = "3.0TD Indexada"
  const tariffIndexada20td = "Indexed 2.0TD"
  const tariffIndexada30td = "Indexed 3.0TD"
  const tariffSomIndexada20td = "Som Indexed 2.0TD"
  const tariff20tdIndexadaSom = "2.0TD Indexada Som"

  test("Should return true with tariff20td", () => {
    expect(checkIsTariff20(tariff20td)).toBeTruthy()
  })

  test("Should return true with tariff30td", () => {
    expect(checkIsTariff20(tariff30td)).toBeFalsy()
  })

  test("Should return true with tariffWrong", () => {
    expect(checkIsTariff20(tariffWrong)).toBeFalsy()
  })

  test("Should return true with tariff20A", () => {
    expect(checkIsTariff20(tariff20A)).toBeTruthy()
  })

  test("Should return true with tariff20tdIndexada", () => {
    expect(checkIsTariff20(tariff20tdIndexada)).toBeTruthy()
  })

  test("Should return true with tariff30tdIndexada", () => {
    expect(checkIsTariff20(tariff30tdIndexada)).toBeFalsy()
  })

  test("Should return true with tariffIndexada20td", () => {
    expect(checkIsTariff20(tariffIndexada20td)).toBeTruthy()
  })

  test("Should return true with tariffIndexada30td", () => {
    expect(checkIsTariff20(tariffIndexada30td)).toBeFalsy()
  })

  test("Should return true with tariffSomIndexada20td", () => {
    expect(checkIsTariff20(tariffSomIndexada20td)).toBeTruthy()
  })

  test("Should return true with tariff20tdIndexadaSom", () => {
    expect(checkIsTariff20(tariff20tdIndexadaSom)).toBeTruthy()
  })

  test("Should return true with tariff30td", () => {
    expect(checkIsTariff30(tariff30td)).toBeTruthy()
  })

  test("Should return false with tariff20td for tariff30 checker", () => {
    expect(checkIsTariff30(tariff20td)).toBeFalsy()
  })

  test("Should return truthy when tariff is indexed", () => {
    expect(checkIsTariffIndexed(tariff20tdIndexada)).toBeTruthy()
  })

  test("Should return falsy when tariff is not indexed", () => {
    expect(checkIsTariffIndexed(tariff20td)).toBeFalsy()
  })
})

describe("getUrlOrBrowserSessionLanguage", () => {
  test("uses the supported language from the URL when present", () => {
    expect(getUrlOrBrowserSessionLanguage("/ca/contract", "es")).toBe("ca_ES")
    expect(getUrlOrBrowserSessionLanguage("/gl/foo", "es")).toBe("gl_ES")
  })

  test("uses the fallback language when navigator is unavailable", () => {
    const originalNavigator = global.navigator

    Object.defineProperty(global, "navigator", {
      configurable: true,
      value: undefined,
    })

    expect(getUrlOrBrowserSessionLanguage("/contract", "ca")).toBe("ca_ES")

    Object.defineProperty(global, "navigator", {
      configurable: true,
      value: originalNavigator,
    })
  })

  test("falls back to the browser session language when URL has no supported language", () => {
    const originalLanguages = navigator.languages
    const originalLanguage = navigator.language

    Object.defineProperty(navigator, "languages", {
      configurable: true,
      value: ["eu-ES"],
    })
    Object.defineProperty(navigator, "language", {
      configurable: true,
      value: "eu-ES",
    })

    expect(getUrlOrBrowserSessionLanguage("/contract", "es")).toBe("eu_ES")

    Object.defineProperty(navigator, "languages", {
      configurable: true,
      value: originalLanguages,
    })
    Object.defineProperty(navigator, "language", {
      configurable: true,
      value: originalLanguage,
    })
  })

  test("uses navigator.language when navigator.languages is unavailable", () => {
    const originalLanguages = navigator.languages
    const originalLanguage = navigator.language

    Object.defineProperty(navigator, "languages", {
      configurable: true,
      value: undefined,
    })
    Object.defineProperty(navigator, "language", {
      configurable: true,
      value: "gl-ES",
    })

    expect(getUrlOrBrowserSessionLanguage("/contract", "es")).toBe("gl_ES")

    Object.defineProperty(navigator, "languages", {
      configurable: true,
      value: originalLanguages,
    })
    Object.defineProperty(navigator, "language", {
      configurable: true,
      value: originalLanguage,
    })
  })

  test("uses the fallback language when browser language is unsupported", () => {
    const originalLanguages = navigator.languages
    const originalLanguage = navigator.language

    Object.defineProperty(navigator, "languages", {
      configurable: true,
      value: ["en-US"],
    })
    Object.defineProperty(navigator, "language", {
      configurable: true,
      value: "en-US",
    })

    expect(getUrlOrBrowserSessionLanguage("/contract", "ca")).toBe("ca_ES")

    Object.defineProperty(navigator, "languages", {
      configurable: true,
      value: originalLanguages,
    })
    Object.defineProperty(navigator, "language", {
      configurable: true,
      value: originalLanguage,
    })
  })
})

describe("small utility helpers", () => {
  test("checkPhisicalVAT returns undefined for undefined VAT", () => {
    expect(checkPhisicalVAT(undefined)).toBeUndefined()
  })

  test("checkPhisicalVAT detects physical and non physical VAT prefixes", () => {
    expect(checkPhisicalVAT("12345678Z")).toBeTruthy()
    expect(checkPhisicalVAT("X1234567L")).toBeTruthy()
    expect(checkPhisicalVAT("B12345678")).toBeFalsy()
  })

  test("isMatchingCUPSandCAU compares the CAU prefix with the CUPS", () => {
    expect(
      isMatchingCUPSandCAU(
        "ES1234567890123456AA1FA001",
        "ES1234567890123456AA1F",
      ),
    ).toBeTruthy()
    expect(
      isMatchingCUPSandCAU(
        "ES1234567890123456AA1FA001",
        "ES9999567890123456AA1F",
      ),
    ).toBeFalsy()
  })

  test("prettyCAU strips invalid chars, uppercases and truncates to 26 chars", () => {
    expect(prettyCAU("es12 34-56aa1fa001")).toBe("ES123456AA1FA001")
    expect(prettyCAU("es1234567890123456aa1fa001999")).toBe(
      "ES1234567890123456AA1FA001",
    )
    expect(prettyCAU("")).toBe("")
  })

  test("calculateTariff chooses the tariff from the contracted power band", () => {
    expect(calculateTariff({ moreThan15Kw: true })).toBe("3.0TD")
    expect(calculateTariff({ moreThan15Kw: false })).toBe("2.0TD")
  })

  test("specialCaseType returns the first matching special case key", () => {
    expect(specialCaseType({ reason_death: true })).toBe(
      "SPECIAL_CASES_DEATH",
    )
    expect(specialCaseType({ reason_merge: true })).toBe(
      "SPECIAL_CASES_MERGE",
    )
    expect(specialCaseType({ reason_electrodep: true })).toBe(
      "SPECIAL_CASES_ELECTRODEP",
    )
    expect(specialCaseType({})).toBe("")
  })

  test("getNextNBussinesDays skips weekends and market holidays", () => {
    expect(getNextNBussinesDays("2026-08-14", 3, ["2026-08-18"])).toEqual([
      "2026-08-17",
      "2026-08-19",
      "2026-08-20",
    ])
  })

  test("normalizeContribution maps standard and signaturit payloads", () => {
    const values = {
      member: {
        number: "123",
        partner_number: "999",
        vat: "40323835M",
      },
      payment: {
        iban: "ES91 2100 0418 4502 0005 1332",
        amount: "200",
        sepa_accepted: true,
      },
      signaturit: "signature-id",
      mandate_name: "Mandate Holder",
    }

    expect(normalizeContribution(values, false)).toEqual({
      socinumber: "123",
      dni: "40323835M",
      accountbankiban: "ES91 2100 0418 4502 0005 1332",
      amount: 200,
      acceptaccountowner: 1,
    })

    expect(normalizeContribution(values, true)).toEqual({
      socinumber: "999",
      dni: "40323835M",
      accountbankiban: "ES91 2100 0418 4502 0005 1332",
      amount: 200,
      signaturit: "signature-id",
      mandate_name: "Mandate Holder",
      acceptaccountowner: "1",
    })
  })

  test("normalizeContribution keeps account owner acceptance disabled when SEPA is not accepted", () => {
    expect(
      normalizeContribution({
        member: {
          number: "123",
          vat: "40323835M",
        },
        payment: {
          iban: "ES91 2100 0418 4502 0005 1332",
          amount: "200",
          sepa_accepted: false,
        },
      }),
    ).toEqual({
      socinumber: "123",
      dni: "40323835M",
      accountbankiban: "ES91 2100 0418 4502 0005 1332",
      amount: 200,
      acceptaccountowner: 0,
    })
  })

  test("checkIbanFormat validates formatted and malformed IBAN values", () => {
    expect(checkIbanFormat("ES91 2100 0418 4502 0005 1332")).toBeTruthy()
    expect(checkIbanFormat("ES00 2100 0418 4502 0005 1332")).toBeFalsy()
  })

  test("isCompanyVat distinguishes company CIFs from personal VATs", () => {
    expect(isCompanyVat("B99286320")).toBeTruthy()
    expect(isCompanyVat("40323835M")).toBeFalsy()
  })

  test("checkVatFormat returns validator details for valid and invalid NIFs", () => {
    expect(checkVatFormat("40323835M")).toMatchObject({
      isValid: true,
      isIndividual: true,
      isCompany: false,
      compact: "40323835M",
    })

    expect(checkVatFormat("40323835A")).toMatchObject({
      isValid: false,
    })
  })

  test("setMunicipisWithPostalCode merges the first municipality into the target field", async () => {
    vi.mocked(getMunicipisByPostalCode).mockResolvedValue([
      [{ provincia: "Girona", municipi: "Olot" }],
    ])

    const setFieldValue = vi.fn()
    const values = {
      holder: {
        address: "Carrer Major",
        postal_code: "17800",
      },
    }

    await setMunicipisWithPostalCode(
      "17800",
      setFieldValue,
      "holder",
      values,
    )

    expect(getMunicipisByPostalCode).toHaveBeenCalledWith("17800")
    expect(setFieldValue).toHaveBeenCalledWith("holder", {
      address: "Carrer Major",
      postal_code: "17800",
      state: "Girona",
      city: "Olot",
    })
  })

  test("setMunicipisWithPostalCode leaves the field untouched when the postal code has no municipalities", async () => {
    vi.mocked(getMunicipisByPostalCode).mockResolvedValue([])

    const setFieldValue = vi.fn()

    await setMunicipisWithPostalCode("00000", setFieldValue, "holder", {
      holder: { address: "Unknown" },
    })

    expect(setFieldValue).not.toHaveBeenCalled()
  })

  test("testPowerForPeriods reports the minimum-power message when all required periods are below the limit", () => {
    const createError = vi.fn((error) => error)
    const t = vi.fn((key, { value }) => `${key}:${value}`)
    const rates = {
      "2.0TD": {
        num_power_periods: 2,
        min_power: { power: 0.1, num_periods_apply: 2 },
      },
    }

    expect(
      testPowerForPeriods(
        rates,
        { rate: "2.0TD", power: 0.05, power2: 0.08 },
        "min_power",
        createError,
        t,
      ),
    ).toEqual({ message: "POWER_NO_LESS_THAN:0.1" })
    expect(createError).toHaveBeenCalledWith({
      message: "POWER_NO_LESS_THAN:0.1",
    })
  })

  test("testPowerForPeriods returns true for unknown rates", () => {
    const createError = vi.fn()
    const t = vi.fn()

    expect(
      testPowerForPeriods(
        {},
        { rate: "UNKNOWN", power: 1, power2: 1 },
        "min_power",
        createError,
        t,
      ),
    ).toBe(true)
    expect(createError).not.toHaveBeenCalled()
    expect(t).not.toHaveBeenCalled()
  })

  test("testPowerForPeriods returns true when enough periods satisfy the shared minimum", () => {
    const createError = vi.fn((error) => error)
    const t = vi.fn((key, { value }) => `${key}:${value}`)
    const rates = {
      "3.0TD": {
        num_power_periods: 6,
        min_power: { power: 15.001, num_periods_apply: 1 },
      },
    }

    expect(
      testPowerForPeriods(
        rates,
        {
          tariff: "3.0TD",
          power: 20,
          power2: 10,
          power3: 10,
          power4: 10,
          power5: 10,
          power6: 10,
        },
        "min_power",
        createError,
        t,
      ),
    ).toBe(true)
    expect(createError).not.toHaveBeenCalled()
  })

  test("testPowerForPeriods reports the shared multi-period minimum message for 3.0TD rates", () => {
    const createError = vi.fn((error) => error)
    const t = vi.fn((key, { value }) => `${key}:${value}`)
    const rates = {
      "3.0TD": {
        num_power_periods: 6,
        min_power: { power: 15.001, num_periods_apply: 1 },
      },
    }

    expect(
      testPowerForPeriods(
        rates,
        {
          rate: "3.0TD",
          power: 10,
          power2: 11,
          power3: 12,
          power4: 13,
          power5: 14,
          power6: 15,
        },
        "min_power",
        createError,
        t,
      ),
    ).toEqual({ message: "SOME_PERIOD_MORE_THAN:15.001" })
  })

  test("testPowerForPeriods reports the max-power message for legacy 2.0TD rates", () => {
    const createError = vi.fn((error) => error)
    const t = vi.fn((key, { value }) => `${key}:${value}`)
    const rates = {
      "2.0TD": {
        num_power_periods: 2,
        max_power: { power: 15, num_periods_apply: 2 },
      },
    }

    expect(
      testPowerForPeriods(
        rates,
        { tariff: "2.0TD", power: 16, power2: 16 },
        "max_power",
        createError,
        t,
      ),
    ).toEqual({ message: { value: 15 } })
    expect(createError).toHaveBeenCalledWith({
      message: { value: 15 },
    })
  })

  test("testPowerForPeriods ignores max-power limits for 3.0TD rates", () => {
    const createError = vi.fn((error) => error)
    const t = vi.fn((key, { value }) => `${key}:${value}`)
    const rates = {
      "3.0TD": {
        num_power_periods: 6,
        max_power: { power: 450, num_periods_apply: 6 },
      },
    }

    expect(
      testPowerForPeriods(
        rates,
        {
          rate: "3.0TD",
          power: 500,
          power2: 510,
          power3: 520,
          power4: 530,
          power5: 540,
          power6: 550,
        },
        "max_power",
        createError,
        t,
      ),
    ).toBe(true)
    expect(createError).not.toHaveBeenCalled()
  })

  test("newTestPowerForPeriods reports the max-power message for lower-than-15kw rates", () => {
    const createError = vi.fn((error) => error)

    expect(
      newTestPowerForPeriods(
        "power-lower-15kw",
        { power1: 16, power2: 16 },
        "max_power",
        createError,
      ),
    ).toEqual({ message: "POWER_NO_MORE_THAN15" })
    expect(createError).toHaveBeenCalledWith({
      message: "POWER_NO_MORE_THAN15",
    })
  })

  test("newTestPowerForPeriods returns true for unknown rates", () => {
    const createError = vi.fn()

    expect(
      newTestPowerForPeriods(
        "unknown-rate",
        { power1: 10, power2: 10 },
        "min_power",
        createError,
      ),
    ).toBe(true)
    expect(createError).not.toHaveBeenCalled()
  })

  test("newTestPowerForPeriods returns true when enough periods satisfy the shared minimum", () => {
    const createError = vi.fn((error) => error)

    expect(
      newTestPowerForPeriods(
        "power-higher-15kw",
        {
          power1: 20,
          power2: 10,
          power3: 10,
          power4: 10,
          power5: 10,
          power6: 10,
        },
        "min_power",
        createError,
      ),
    ).toBe(true)
    expect(createError).not.toHaveBeenCalled()
  })

  test("newTestPowerForPeriods reports the shared min-power message for higher-than-15kw rates", () => {
    const createError = vi.fn((error) => error)

    expect(
      newTestPowerForPeriods(
        "power-higher-15kw",
        {
          power1: 10,
          power2: 11,
          power3: 12,
          power4: 13,
          power5: 14,
          power6: 15,
        },
        "min_power",
        createError,
      ),
    ).toEqual({ message: "SOME_PERIOD_MORE_THAN15.001" })
  })

  test("newTestPowerForPeriods ignores max-power limits for higher-than-15kw rates", () => {
    const createError = vi.fn((error) => error)

    expect(
      newTestPowerForPeriods(
        "power-higher-15kw",
        {
          power1: 500,
          power2: 510,
          power3: 520,
          power4: 530,
          power5: 540,
          power6: 550,
        },
        "max_power",
        createError,
      ),
    ).toBe(true)
    expect(createError).not.toHaveBeenCalled()
  })
})

describe("Check Contract Form (normalize function)", () => {
  const clone = (value) => JSON.parse(JSON.stringify(value))

  test("Normalize Contract data (base)", () => {
    expect(normalizeContract(contractCases.base.entryValues)).toStrictEqual(
      contractCases.base.normalizedData,
    )
  })

  test("Normalize Contract data (selfconsumption)", () => {
    expect(
      normalizeContract(contractCases.withSelfConsumption.entryValues),
    ).toStrictEqual(contractCases.withSelfConsumption.normalizedData)
  })

  test("Normalize Contract data (CUPS without service)", () => {
    expect(
      normalizeContract(contractCases.withCUPSNoService.entryValues),
    ).toStrictEqual(contractCases.withCUPSNoService.normalizedData)
  })

  test("Normalize Contract data (3.0TD)", () => {
    expect(normalizeContract(contractCases.with30TD.entryValues)).toStrictEqual(
      contractCases.with30TD.normalizedData,
    )
  })

  test("Normalize Contract data (2.0)", () => {
    expect(normalizeContract(contractCases.with20.entryValues)).toStrictEqual(
      contractCases.with20.normalizedData,
    )
  })

  test("Normalize Contract data builds a physical non-member contract owner and sanitizes empty owner fields", () => {
    const values = clone(contractCases.with20.entryValues)

    values.holder.vat = "11111111H"
    values.holder.name = "Maria"
    values.holder.surname1 = "Lopez"
    values.holder.surname2 = ""
    values.holder.address = "Carrer Nou"
    values.holder.number = "12"
    values.holder.floor = "2"
    values.holder.door = "B"
    values.holder.postal_code = "17001"
    values.holder.city = { id: "" }
    values.holder.state = { id: "" }
    values.holder.email = "maria@example.com"
    values.holder.phone1 = "600000000"
    values.holder.phone2 = ""
    values.holder.language = "ca_ES"
    values.supply_point.cadastral_reference = " 12 34 56 "

    expect(normalizeContract(values)).toMatchObject({
      member_number: "38434",
      member_vat: "40323835M",
      cups_cadastral_reference: "123456",
      owner_is_member: false,
      owner_is_payer: true,
      contract_owner: {
        is_juridic: false,
        vat: "11111111H",
        name: "Maria",
        surname: "Lopez",
        address: "Carrer Nou, 12 2 B",
        city_id: 0,
        state_id: 0,
        postal_code: "17001",
        email: "maria@example.com",
        phone: "600000000",
        lang: "ca_ES",
        privacy_conditions: true,
      },
    })

    expect(normalizeContract(values).contract_owner).not.toHaveProperty("proxy_vat")
    expect(normalizeContract(values).contract_owner).not.toHaveProperty("proxy_name")
    expect(normalizeContract(values).contract_owner).not.toHaveProperty("phone2")
  })

  test("Normalize Contract data builds a juridic contract owner and includes indexed terms acceptance", () => {
    const values = clone(contractCases.with20.entryValues)

    values.holder.isphisical = false
    values.holder.vat = "B12345678"
    values.holder.name = "ACME Energia"
    values.holder.proxynif = "40323835M"
    values.holder.proxyname = "Joan Proxy"
    values.holder.address = "Avinguda Solar"
    values.holder.number = "5"
    values.holder.floor = ""
    values.holder.door = ""
    values.holder.postal_code = "08001"
    values.holder.city = { id: "77" }
    values.holder.state = { id: "8" }
    values.holder.email = "billing@acme.test"
    values.holder.phone1 = "933000000"
    values.holder.phone2 = "934000000"
    values.holder.language = "es_ES"
    values.contract.isIndexed = true
    values.contract.has_service = true
    values.holder.previous_holder = false

    expect(normalizeContract(values)).toMatchObject({
      is_indexed: true,
      process: "C2",
      indexed_specific_terms_accepted: true,
      owner_is_member: false,
      contract_owner: {
        is_juridic: true,
        vat: "B12345678",
        name: "ACME Energia",
        proxy_vat: "40323835M",
        proxy_name: "Joan Proxy",
        address: "Avinguda Solar, 5",
        city_id: 77,
        state_id: 8,
        postal_code: "08001",
        email: "billing@acme.test",
        phone: "933000000",
        phone2: "934000000",
        lang: "es_ES",
        privacy_conditions: true,
      },
    })
  })

  test("Normalize Contract data keeps self-consumption attachments and removes empty optional self-consumption fields", () => {
    const values = clone(contractCases.withSelfConsumption.entryValues)

    values.self_consumption.attachments = ["authorization.pdf"]
    values.self_consumption.installation_type = ""
    values.self_consumption.technology = ""

    expect(normalizeContract(values)).toMatchObject({
      self_consumption: {
        cau: "ES0353501028615353EE0FA000",
        collective_installation: true,
        installation_power: "3500",
        aux_services: false,
        attachments: ["authorization.pdf"],
      },
    })

    expect(normalizeContract(values).self_consumption).not.toHaveProperty(
      "installation_type",
    )
    expect(normalizeContract(values).self_consumption).not.toHaveProperty(
      "technology",
    )
  })
})

describe("Check Member Form (normalize function)", () => {
  test("Normalize Member data (base)", () => {
    expect(normalizeMember(memberCases.base.entryValues)).toStrictEqual(
      memberCases.base.normalizedData,
    )
  })

  test("Normalize Member data (new Member)", () => {
    expect(normalizeMember(memberCases.newMember.entryValues)).toStrictEqual(
      memberCases.newMember.normalizedData,
    )
  })
})

describe("Check Member new Form (normalize function)", () => {
  test("Normalize Member data (phisical)", () => {
    expect(
      newNormalizeMember(memberCases.newNewMemberPhisical.entryValues),
    ).toStrictEqual(memberCases.newNewMemberPhisical.normalizedData)
  })

  test("Normalize Member data (juridical)", () => {
    expect(
      newNormalizeMember(memberCases.newNewMemberJuridical.entryValues),
    ).toStrictEqual(memberCases.newNewMemberJuridical.normalizedData)
  })

  test("Normalize Member data maps credit-card payments and empty physical birthdates", () => {
    expect(
      newNormalizeMember({
        new_member: {
          person_type: "physic-person",
          name: "Maria",
          nif: "40323835M",
          phone_code: "+34",
          phone: "600000000",
          email: "maria@example.com",
          language: "ca_ES",
          payment_method: "credit_card",
          iban: "",
          surname1: "Lopez",
          surname2: "",
          birthdate: null,
          gender: "female",
          referral_source: "friend",
        },
        address: {
          postal_code: "17001",
          state: { id: 17 },
          street: "Carrer Nou",
          number: "12",
          bloc: "",
          floor: "2",
          door: "B",
          cadas_street: "Nou",
          cadas_tv: "ST",
          city: { id: 3 },
        },
        privacy_policy_accepted: true,
        statutes_accepted: true,
        comercial_info_accepted: false,
      }),
    ).toMatchObject({
      tipuspersona: "fisica",
      payment_method: "tpv",
      birthdate: "",
      cognom: "Lopez",
    })
  })
})

describe("Check Holder Change Form (normalize function)", () => {
  test("Normalize Member data (base)", () => {
    expect(
      normalizeHolderChange(holderChangeCases.base.entryValues),
    ).toStrictEqual(holderChangeCases.base.normalizedData)
  })

  test("Normalize Member data (change holder)", () => {
    expect(
      normalizeHolderChange(holderChangeCases.changeHolder.entryValues),
    ).toStrictEqual(holderChangeCases.changeHolder.normalizedData)
  })

  test("Normalize Holder Change keeps mandatory homeowner-community member linking and strips empty special-case attachments", () => {
    const values = structuredClone(holderChangeCases.changeHolder.entryValues)

    values.holder.ismember = false
    values.holder.vat = "H12345678"
    values.holder.language = { code: "eu_ES" }
    values.member = {
      name: "Existing member",
      address: "Old address",
      postal_code: "17003",
      state: "Girona",
      city: "Girona",
      surname1: "Ignored",
      email: "old@example.com",
      phone1: "999999999",
      phone2: "888888888",
      language: "ca_ES",
      checked: true,
      full_name: "Existing member full name",
      vat: "12345678Z",
      number: "S0001",
      invite_token: false,
    }
    values.especial_cases.attachments = {
      death: ["death.pdf"],
    }

    const normalized = normalizeHolderChange(values, true)

    expect(normalized).toMatchObject({
      holder: {
        vat: "H12345678",
        language: "eu_ES",
      },
      member: {
        invite_token: false,
        become_member: false,
        link_member: true,
        vat: "12345678Z",
        number: "S0001",
      },
      especial_cases: {
        reason_death: false,
        reason_merge: false,
        reason_electrodep: false,
      },
    })

    expect(normalized.member).not.toHaveProperty("name")
    expect(normalized.especial_cases).not.toHaveProperty("attachments")
  })

  test("Normalize Holder Change flattens juridic proxy attachments and removes non-juridic name fields", () => {
    const values = structuredClone(holderChangeCases.changeHolder.entryValues)

    values.holder.isphisical = false
    values.holder.proxynif = "12345678Z"
    values.holder.proxyname = "Proxy Person"
    values.holder.proxynif_phisical = false
    values.especial_cases.reason_merge = true
    values.especial_cases.attachments = {
      merge: ["merge.pdf"],
      resident: ["resident.pdf"],
    }

    const normalized = normalizeHolderChange(values)

    expect(normalized.holder).toMatchObject({
      proxynif: "12345678Z",
      proxyname: "Proxy Person",
    })
    expect(normalized.holder).not.toHaveProperty("surname1")
    expect(normalized.holder).not.toHaveProperty("surname2")
    expect(normalized.holder).not.toHaveProperty("isphisical")
    expect(normalized.holder).not.toHaveProperty("proxynif_phisical")
    expect(normalized.especial_cases.attachments).toEqual({
      merge: "merge.pdf",
      resident: "resident.pdf",
    })
  })

  test("Normalize Holder Change removes member ids when linking is not required and flattens death or medical attachments", () => {
    const values = structuredClone(holderChangeCases.changeHolder.entryValues)

    values.holder.ismember = false
    values.holder.vat = "12345678Z"
    values.holder.vatexists = true
    values.member = {
      vat: "12345678Z",
      number: "S0002",
      invite_token: true,
    }
    values.especial_cases.reason_death = true
    values.especial_cases.reason_merge = false
    values.especial_cases.reason_electrodep = false
    values.especial_cases.attachments = {
      death: ["death.pdf"],
      medical: ["medical.pdf"],
    }

    const normalized = normalizeHolderChange(values, false)

    expect(normalized.member).toEqual({
      invite_token: true,
    })
    expect(normalized.holder).not.toHaveProperty("vatexists")
    expect(normalized.especial_cases.attachments).toEqual({
      death: "death.pdf",
      medical: "medical.pdf",
    })
  })
})

describe("Check Modify Contract Form (normalize function)", () => {
  test("Normalize Modify Contract data (change power, 2.0)", () => {
    expect(
      normalizeModifyData(modifyContractCases.power20.entryValues),
    ).toStrictEqual(modifyContractCases.power20.normalizedData)
  })

  test("Normalize Modify Contract data (change power, 3.0)", () => {
    expect(
      normalizeModifyData(modifyContractCases.power30.entryValues),
    ).toStrictEqual(modifyContractCases.power30.normalizedData)
  })

  test("Normalize Modify Contract data drops power fields when power is not changing", () => {
    expect(
      normalizeModifyData({
        modify: {
          phases: "phase-2",
          changePower: false,
        },
        contact: {
          contactName: "Maria",
          contactSurname: "Lopez",
          phone: "600000000",
        },
      }),
    ).toEqual({
      phase: "phase-2",
      contact_name: "Maria",
      contact_surname: "Lopez",
      contact_phone: "600000000",
    })
  })
})

describe("Check D1 Form (normalize function)", () => {
  test("Normalize D1 data (accept D1 no M1)", () => {
    expect(
      normalizeD1ConfirmationData(d1Cases.acceptD1noM1.entryValues),
    ).toStrictEqual(d1Cases.acceptD1noM1.normalizedData)
  })

  test("Normalize D1 data (accept D1 no M1 no Attatchments)", () => {
    expect(
      normalizeD1ConfirmationData(d1Cases.acceptD1NoM1NoAtt.entryValues),
    ).toStrictEqual(d1Cases.acceptD1NoM1NoAtt.normalizedData)
  })

  test("Normalize D1 data includes a sanitized contract modification when modify data exists", () => {
    expect(
      normalizeD1ConfirmationData({
        validate: true,
        d1Attachments: ["resolution.pdf"],
        refuseReason: "",
        modify: {
          phases: "phase-3",
          attachments: ["id-card.pdf"],
          changePower: false,
        },
        contact: {
          contactName: "Alex",
          contactSurname: "Serra",
          phone: "611111111",
        },
      }),
    ).toEqual({
      confirm: true,
      attachments: ["resolution.pdf"],
      contract_modification: {
        phase: "phase-3",
        attachments: ["id-card.pdf"],
        contact_name: "Alex",
        contact_surname: "Serra",
        contact_phone: "611111111",
      },
    })
  })
})

describe("checkCAUWhileTyping provides feedback and correction while typing the CAU code", () => {
  const t = (x) => x // Translate identity
  test("Should return invalid with no message when still empty", () => {
    expect(checkCAUWhileTyping("", t)).toEqual({
      value: "",
      valid: false,
      error: undefined,
    })
  })
  test("Should strip spaces", () => {
    expect(checkCAUWhileTyping("   ", t)).toEqual({
      value: "",
      valid: false,
      error: undefined,
    })
  })
  test("Should complain starting different than 'E'", () => {
    expect(checkCAUWhileTyping("K", t)).toEqual({
      value: "K",
      valid: false,
      error: "CAU_INVALID_PREFIX",
    })
  })
  test("Should complain second leter not 'S'", () => {
    expect(checkCAUWhileTyping("EK", t)).toEqual({
      value: "EK",
      valid: false,
      error: "CAU_INVALID_PREFIX",
    })
  })
  test("Should complain on length when just E", () => {
    expect(checkCAUWhileTyping("E", t)).toEqual({
      value: "E",
      valid: false,
      error: "CAU_INVALID_LENGTH",
    })
  })
  test("Should complain on length when just ES", () => {
    expect(checkCAUWhileTyping("ES", t)).toEqual({
      value: "ES",
      valid: false,
      error: "CAU_INVALID_LENGTH",
    })
  })
  test("Should correct lower cases", () => {
    expect(checkCAUWhileTyping("es", t)).toEqual({
      value: "ES",
      valid: false,
      error: "CAU_INVALID_LENGTH",
    })
  })
  test("Should complain on non numbers after ES", () => {
    expect(checkCAUWhileTyping("ESD", t)).toEqual({
      value: "ESD",
      valid: false,
      error: "CAU_INVALID_AFTER_ES_SHOULD_BE_NUMBERS",
    })
  })
  test("Should complain about length if just numbers after ES", () => {
    expect(checkCAUWhileTyping("ES12345678", t)).toEqual({
      value: "ES12345678",
      valid: false,
      error: "CAU_INVALID_LENGTH",
    })
  })
  test("Should complain about length if all numbers after ES", () => {
    expect(checkCAUWhileTyping("ES1234567890123456", t)).toEqual({
      value: "ES1234567890123456",
      valid: false,
      error: "CAU_INVALID_LENGTH",
    })
  })
  test("Should complain on non numbers if up to the 16th is not number", () => {
    expect(checkCAUWhileTyping("ES123456789012345K", t)).toEqual({
      value: "ES123456789012345K",
      valid: false,
      error: "CAU_INVALID_AFTER_ES_SHOULD_BE_NUMBERS",
    })
  })
  test("Should complain first CRC should be a number", () => {
    expect(checkCAUWhileTyping("ES12345678901234567", t)).toEqual({
      value: "ES12345678901234567",
      valid: false,
      error: "CAU_INVALID_REDUNDANCY_CONTROL_SHOULD_BE_LETTERS",
    })
  })
  test("Should complain second CRC digit is a number", () => {
    expect(checkCAUWhileTyping("ES1234567890123456A8", t)).toEqual({
      value: "ES1234567890123456A8",
      valid: false,
      error: "CAU_INVALID_REDUNDANCY_CONTROL_SHOULD_BE_LETTERS",
    })
  })
  test("Should complain of a border point not starting with a number", () => {
    expect(checkCAUWhileTyping("ES1234567890123456AAK", t)).toEqual({
      value: "ES1234567890123456AAK",
      valid: false,
      error: "CAU_INVALID_BORDER_POINT",
    })
  })
  test("Should complain of a border point not followint a letter", () => {
    expect(checkCAUWhileTyping("ES1234567890123456AA11", t)).toEqual({
      value: "ES1234567890123456AA11",
      valid: false,
      error: "CAU_INVALID_BORDER_POINT",
    })
  })
  test("Should complain about length if border point is ok", () => {
    expect(checkCAUWhileTyping("ES1234567890123456AA1F", t)).toEqual({
      value: "ES1234567890123456AA1F",
      valid: false,
      error: "CAU_INVALID_LENGTH",
    })
  })
  test("Should complain about installation if starting not an A", () => {
    expect(checkCAUWhileTyping("ES1234567890123456AA1FK", t)).toEqual({
      value: "ES1234567890123456AA1FK",
      valid: false,
      error: "CAU_INVALID_INSTALLATION",
    })
  })
  test("Should complain about length when installation starts with A", () => {
    expect(checkCAUWhileTyping("ES1234567890123456AA1FA", t)).toEqual({
      value: "ES1234567890123456AA1FA",
      valid: false,
      error: "CAU_INVALID_LENGTH",
    })
  })
  test("Should complain about installation when a non number follows A", () => {
    expect(checkCAUWhileTyping("ES1234567890123456AA1FAK", t)).toEqual({
      value: "ES1234567890123456AA1FAK",
      valid: false,
      error: "CAU_INVALID_INSTALLATION",
    })
  })
  test("Should accept a full CUA", () => {
    expect(checkCAUWhileTyping("ES1234567890123456AA1FA001", t)).toEqual({
      value: "ES1234567890123456AA1FA001",
      valid: true,
    })
  })
  test("Should complain if provided CUPS and does not match", () => {
    expect(
      checkCAUWhileTyping(
        "ES1234567890123456AA1FA001",
        t,
        "ES1111222233334444551F",
      ),
    ).toEqual({
      value: "ES1234567890123456AA1FA001",
      valid: false,
      error: "CAU_NOT_MATCHING_CUPS",
    })
  })
  test("Should accept if provided CUPS matches", () => {
    expect(
      checkCAUWhileTyping(
        "ES1234567890123456AA1FA001",
        t,
        "ES1234567890123456AA1F",
      ),
    ).toEqual({
      value: "ES1234567890123456AA1FA001",
      valid: true,
    })
  })
  test("Should complain if provided CUPS and does not match partially", () => {
    expect(
      checkCAUWhileTyping("ES1234567890", t, "ES1111222233334444551F"),
    ).toEqual({
      value: "ES1234567890",
      valid: false,
      error: "CAU_NOT_MATCHING_CUPS",
    })
  })
  test("Should complain on length if provided CUPS matches partially", () => {
    expect(
      checkCAUWhileTyping("ES1234567890", t, "ES1234567890123456AA1F"),
    ).toEqual({
      value: "ES1234567890",
      valid: false,
      error: "CAU_INVALID_LENGTH",
    })
  })
  test("Should ignore differences with the provided CUPS on the border point", () => {
    expect(
      checkCAUWhileTyping(
        "ES1234567890123456AA1FA001",
        t,
        "ES1234567890123456AA4F",
      ),
    ).toEqual({
      value: "ES1234567890123456AA1FA001",
      valid: true,
    })
  })
  test("Should precede prefix error over matching cups", () => {
    expect(
      checkCAUWhileTyping("KS1234567890", t, "ES1111222233334444551F"),
    ).toEqual({
      value: "KS1234567890",
      valid: false,
      error: "CAU_INVALID_PREFIX",
    })
  })
  test("Should precede non-number error over matching cups", () => {
    expect(
      checkCAUWhileTyping("ES123456789K", t, "ES1111222233334444551F"),
    ).toEqual({
      value: "ES123456789K",
      valid: false,
      error: "CAU_INVALID_AFTER_ES_SHOULD_BE_NUMBERS",
    })
  })

  test("Should accept the prefix when the provided CUPS matches the partial CAU", () => {
    expect(
      checkCAUWhileTyping("ES1234567890123456AA", t, "ES1234567890123456AA1F"),
    ).toEqual({
      value: "ES1234567890123456AA",
      valid: false,
      error: "CAU_INVALID_LENGTH",
    })
  })
})

describe("remaining branch coverage for utils helpers", () => {
  test("normalizeMember maps credit-card payments for company members", () => {
    expect(
      normalizeMember({
        member: {
          isphisical: false,
          name: "ACME Energia",
          vat: "B12345678",
          phone1: "933000000",
          phone2: "",
          email: "billing@acme.test",
          postal_code: "08001",
          state: { id: 8 },
          address: "Avinguda Solar",
          number: "5",
          floor: "",
          door: "",
          city: { id: 77 },
          language: "es_ES",
          proxyname: "Joan Proxy",
          proxynif: "40323835M",
        },
        payment: {
          payment_method: "credit_card",
          iban: "",
        },
      }),
    ).toMatchObject({
      tipuspersona: "juridica",
      payment_method: "tpv",
      representant_nom: "Joan Proxy",
      representant_dni: "40323835M",
    })
  })

  test("testPowerForPeriods treats missing periods as valid when counting minimum-power thresholds", () => {
    const createError = vi.fn((error) => error)
    const t = vi.fn((key, { value }) => `${key}:${value}`)

    expect(
      testPowerForPeriods(
        {
          "2.0TD": {
            num_power_periods: 2,
            min_power: { power: 0.1, num_periods_apply: 2 },
          },
        },
        { rate: "2.0TD", power: 0.15 },
        "min_power",
        createError,
        t,
      ),
    ).toBe(true)
    expect(createError).not.toHaveBeenCalled()
  })

  test("newTestPowerForPeriods reports the lower-than-15kw minimum-power message when all periods are below the limit", () => {
    const createError = vi.fn((error) => error)

    expect(
      newTestPowerForPeriods(
        "power-lower-15kw",
        { power1: 0.05, power2: 0.08 },
        "min_power",
        createError,
      ),
    ).toEqual({ message: "POWER_NO_LESS_THAN0.1" })
    expect(createError).toHaveBeenCalledWith({
      message: "POWER_NO_LESS_THAN0.1",
    })
  })
})
