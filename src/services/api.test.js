import { afterEach, describe, expect, test, vi } from "vitest"

const WEBFORMS_API_URL = "https://api.test"
const ORIGINAL_ENV_API_URL = import.meta.env.VITE_WEBFORMS_API_URL

const setApiRootDataset = (rootElement = {
  dataset: { webformsApiUrl: WEBFORMS_API_URL },
}) => {
  global.document = {
    getElementById: vi.fn(() => rootElement),
  }
}

const loadApiModule = async (options = {}) => {
  const {
    axiosImpl,
    dayjsImpl = (value) => ({ format: () => `formatted:${value}` }),
    postalCodeData = [],
    rootElement,
  } = options

  vi.resetModules()
  setApiRootDataset(rootElement)

  if ("envApiUrl" in options) {
    import.meta.env.VITE_WEBFORMS_API_URL = options.envApiUrl
  }

  if (options.deleteEnvApiUrl) {
    delete import.meta.env.VITE_WEBFORMS_API_URL
  }

  const axios = axiosImpl || vi.fn()

  if (!axios.CancelToken) {
    axios.CancelToken = { source: vi.fn() }
  }

  if (!axios.all) {
    axios.all = vi.fn()
  }

  vi.doMock("./customAxios", () => ({
    default: axios,
  }))
  vi.doMock("dayjs", () => ({
    default: dayjsImpl,
  }))
  vi.doMock("../data/zip-ine.json", () => ({
    default: postalCodeData,
  }))

  return {
    api: await import("./api"),
    axios,
  }
}

afterEach(() => {
  vi.resetModules()
  vi.clearAllMocks()
  vi.doUnmock("./customAxios")
  vi.doUnmock("dayjs")
  vi.doUnmock("../data/zip-ine.json")
  import.meta.env.VITE_WEBFORMS_API_URL = ORIGINAL_ENV_API_URL
  delete global.document
  delete global.FormData
})

describe("api", () => {
  test("getNationalHolidays formats both dates and cancels the previous in-flight request", async () => {
    const firstSource = {
      token: "token-1",
      cancel: vi.fn(),
    }
    const secondSource = {
      token: "token-2",
      cancel: vi.fn(),
    }
    const source = vi.fn().mockReturnValueOnce(firstSource).mockReturnValueOnce(secondSource)
    const axios = vi.fn().mockResolvedValue({ data: { ok: true } })
    axios.CancelToken = { source }
    axios.all = vi.fn()
    const dayjs = vi.fn((value) => ({
      format: vi.fn(() => `formatted:${value}`),
    }))

    const { api } = await loadApiModule({ axiosImpl: axios, dayjsImpl: dayjs })

    await api.getNationalHolidays("2026-01-01", "2026-01-31")
    await api.getNationalHolidays("2026-02-01", "2026-02-28")

    expect(dayjs).toHaveBeenNthCalledWith(1, "2026-01-01")
    expect(dayjs).toHaveBeenNthCalledWith(2, "2026-01-31")
    expect(axios).toHaveBeenNthCalledWith(1, {
      method: "GET",
      url: `${WEBFORMS_API_URL}/data/marketholidays?from=formatted:2026-01-01&to=formatted:2026-01-31`,
      cancelToken: "token-1",
    })
    expect(firstSource.cancel).toHaveBeenCalledWith(
      "Operation canceled due to new request",
    )
    expect(axios).toHaveBeenNthCalledWith(2, {
      method: "GET",
      url: `${WEBFORMS_API_URL}/data/marketholidays?from=formatted:2026-02-01&to=formatted:2026-02-28`,
      cancelToken: "token-2",
    })
  })

  test("getPrices appends repeated powers and optional pricelist type into URLSearchParams", async () => {
    const axios = vi.fn().mockResolvedValue({ data: { ok: true } })
    axios.CancelToken = { source: vi.fn() }
    axios.all = vi.fn()

    const { api } = await loadApiModule({ axiosImpl: axios })

    await api.getPrices({
      tariff: "2.0TD",
      max_power: 15,
      vat: "ES123",
      cnae: "9820",
      city_id: "08019",
      powers: [3.45, 4.6],
      pricelist_type: "indexed",
    })

    const request = axios.mock.calls[0][0]

    expect(request.method).toBe("GET")
    expect(request.url).toBe(`${WEBFORMS_API_URL}/data/prices`)
    expect(request.params.toString()).toBe(
      "tariff=2.0TD&max_power=15&vat=ES123&cnae=9820&city_id=08019&powers=3.45&powers=4.6&pricelist_type=indexed",
    )
  })

  test("getPrices omits pricelist_type when it is not provided", async () => {
    const axios = vi.fn().mockResolvedValue({ data: { ok: true } })
    axios.CancelToken = { source: vi.fn() }
    axios.all = vi.fn()

    const { api } = await loadApiModule({ axiosImpl: axios })

    await api.getPrices({
      tariff: "2.0TD",
      max_power: 15,
      vat: "ES123",
      cnae: "9820",
      city_id: "08019",
      powers: [3.45],
    })

    const request = axios.mock.calls[0][0]

    expect(request.params.toString()).toBe(
      "tariff=2.0TD&max_power=15&vat=ES123&cnae=9820&city_id=08019&powers=3.45",
    )
    expect(request.params.has("pricelist_type")).toBe(false)
  })

  test("API calls fall back to the env-derived base URL when no root dataset is available at import time", async () => {
    const axios = vi.fn().mockResolvedValue({ data: { ok: true } })
    axios.CancelToken = { source: vi.fn() }
    axios.all = vi.fn()

    const { api } = await loadApiModule({
      axiosImpl: axios,
      rootElement: null,
    })

    await api.getProvincies()

    expect(global.document.getElementById).toHaveBeenCalledWith("root")
    expect(axios).toHaveBeenCalledWith({
      method: "GET",
      url: "/data/provincies",
    })
  })

  test("API calls also fall back when the root element exists but has no webformsApiUrl dataset", async () => {
    const axios = vi.fn().mockResolvedValue({ data: { ok: true } })
    axios.CancelToken = { source: vi.fn() }
    axios.all = vi.fn()

    const { api } = await loadApiModule({
      axiosImpl: axios,
      rootElement: {},
    })

    await api.getProvincies()

    expect(axios).toHaveBeenCalledWith({
      method: "GET",
      url: "/data/provincies",
    })
  })

  test("API calls fall back to null when neither root dataset nor env API URL is available at import time", async () => {
    const axios = vi.fn().mockResolvedValue({ data: { ok: true } })
    axios.CancelToken = { source: vi.fn() }
    axios.all = vi.fn()

    const { api } = await loadApiModule({
      axiosImpl: axios,
      rootElement: null,
      deleteEnvApiUrl: true,
    })

    await api.getProvincies()

    expect(axios).toHaveBeenCalledWith({
      method: "GET",
      url: "null/data/provincies",
    })
  })

  test("getMunicipisByPostalCode fans out INE requests and keeps only active municipalities", async () => {
    const source = {
      token: "postal-token",
      cancel: vi.fn(),
    }
    const axios = vi
      .fn()
      .mockResolvedValueOnce({ data: { state: true, data: { id: 1 } } })
      .mockResolvedValueOnce({ data: { state: false, data: { id: 2 } } })
    axios.CancelToken = { source: vi.fn(() => source) }
    axios.all = vi.fn((requests) => Promise.all(requests))

    const { api } = await loadApiModule({
      axiosImpl: axios,
      postalCodeData: [{ "08001": "INE001" }, { "08001": "INE002" }, { "99999": "OTHER" }],
    })

    await expect(api.getMunicipisByPostalCode("08001")).resolves.toEqual([{ id: 1 }])

    expect(axios).toHaveBeenNthCalledWith(1, {
      method: "GET",
      url: `${WEBFORMS_API_URL}/data/ine/INE001`,
      cancelToken: "postal-token",
    })
    expect(axios).toHaveBeenNthCalledWith(2, {
      method: "GET",
      url: `${WEBFORMS_API_URL}/data/ine/INE002`,
      cancelToken: "postal-token",
    })
    expect(axios.all).toHaveBeenCalledTimes(1)
  })

  test("getMunicipisByPostalCode cancels the previous postal-code lookup before issuing a second batch", async () => {
    const firstSource = {
      token: "postal-token-1",
      cancel: vi.fn(),
    }
    const secondSource = {
      token: "postal-token-2",
      cancel: vi.fn(),
    }
    const axios = vi
      .fn()
      .mockResolvedValueOnce({ data: { state: true, data: { id: "first" } } })
      .mockResolvedValueOnce({ data: { state: true, data: { id: "second" } } })
    axios.CancelToken = {
      source: vi.fn().mockReturnValueOnce(firstSource).mockReturnValueOnce(secondSource),
    }
    axios.all = vi.fn((requests) => Promise.all(requests))

    const { api } = await loadApiModule({
      axiosImpl: axios,
      postalCodeData: [{ "08001": "INE001" }],
    })

    await expect(api.getMunicipisByPostalCode("08001")).resolves.toEqual([{ id: "first" }])
    await expect(api.getMunicipisByPostalCode("08001")).resolves.toEqual([{ id: "second" }])

    expect(axios).toHaveBeenNthCalledWith(1, {
      method: "GET",
      url: `${WEBFORMS_API_URL}/data/ine/INE001`,
      cancelToken: "postal-token-1",
    })
    expect(firstSource.cancel).toHaveBeenCalledWith(
      "Operation canceled due to new request",
    )
    expect(axios).toHaveBeenNthCalledWith(2, {
      method: "GET",
      url: `${WEBFORMS_API_URL}/data/ine/INE001`,
      cancelToken: "postal-token-2",
    })
    expect(axios.all).toHaveBeenCalledTimes(2)
  })

  test("getRates and getNewRates expose the expected static tariff metadata", async () => {
    const axios = vi.fn()
    axios.CancelToken = { source: vi.fn() }
    axios.all = vi.fn()

    const { api } = await loadApiModule({ axiosImpl: axios })

    expect(api.getRates()).toEqual({
      "2.0TD": {
        num_power_periods: 2,
        min_power: { power: 0.1, num_periods_apply: 2 },
        max_power: { power: 15, num_periods_apply: 2 },
        increasing: false,
      },
      "3.0TD": {
        num_power_periods: 6,
        min_power: { power: 15.001, num_periods_apply: 1 },
        max_power: { power: 450, num_periods_apply: 6 },
        increasing: true,
      },
    })
    expect(api.getNewRates()).toEqual({
      "power-lower-15kw": {
        num_power_periods: 2,
        min_power: { power: 0.1, num_periods_apply: 2 },
        max_power: { power: 15, num_periods_apply: 2 },
        increasing: false,
      },
      "power-higher-15kw": {
        num_power_periods: 6,
        min_power: { power: 15.001, num_periods_apply: 1 },
        max_power: { power: 450, num_periods_apply: 6 },
        increasing: true,
      },
    })
  })

  test("member converts each field into FormData before posting", async () => {
    const appendedEntries = []
    const formDataInstance = {
      append: vi.fn((key, value) => appendedEntries.push([key, value])),
    }
    global.FormData = vi.fn(function FormData() {
      return formDataInstance
    })

    const axios = vi.fn().mockResolvedValue({ data: { ok: true } })
    axios.CancelToken = { source: vi.fn() }
    axios.all = vi.fn()

    const { api } = await loadApiModule({ axiosImpl: axios })

    await api.member({ name: "Ada", vat: "ES123" })

    expect(global.FormData).toHaveBeenCalledTimes(1)
    expect(appendedEntries).toEqual([
      ["name", "Ada"],
      ["vat", "ES123"],
    ])
    expect(axios).toHaveBeenCalledWith({
      method: "POST",
      url: `${WEBFORMS_API_URL}/form/soci/alta`,
      data: formDataInstance,
    })
  })

  test("memberPayment converts each field into FormData before posting to the payment redirection endpoint", async () => {
    const appendedEntries = []
    const formDataInstance = {
      append: vi.fn((key, value) => appendedEntries.push([key, value])),
    }
    global.FormData = vi.fn(function FormData() {
      return formDataInstance
    })

    const axios = vi.fn().mockResolvedValue({ data: { redirect: true } })
    axios.CancelToken = { source: vi.fn() }
    axios.all = vi.fn()

    const { api } = await loadApiModule({ axiosImpl: axios })

    await expect(
      api.memberPayment({ amount: "25.00", member_id: "42" }),
    ).resolves.toEqual({ redirect: true })

    expect(global.FormData).toHaveBeenCalledTimes(1)
    expect(appendedEntries).toEqual([
      ["amount", "25.00"],
      ["member_id", "42"],
    ])
    expect(axios).toHaveBeenCalledWith({
      method: "POST",
      url: `${WEBFORMS_API_URL}/pagament/redirectiondata`,
      data: formDataInstance,
    })
  })

  test("contribution converts each field into FormData before posting to the investment form endpoint", async () => {
    const appendedEntries = []
    const formDataInstance = {
      append: vi.fn((key, value) => appendedEntries.push([key, value])),
    }
    global.FormData = vi.fn(function FormData() {
      return formDataInstance
    })

    const axios = vi.fn().mockResolvedValue({ data: { created: true } })
    axios.CancelToken = { source: vi.fn() }
    axios.all = vi.fn()

    const { api } = await loadApiModule({ axiosImpl: axios })

    await expect(
      api.contribution({ title: "Solar roof", shares: "3" }),
    ).resolves.toEqual({ created: true })

    expect(global.FormData).toHaveBeenCalledTimes(1)
    expect(appendedEntries).toEqual([
      ["title", "Solar roof"],
      ["shares", "3"],
    ])
    expect(axios).toHaveBeenCalledWith({
      method: "POST",
      url: `${WEBFORMS_API_URL}/form/inversio`,
      data: formDataInstance,
    })
  })

  test("generation eligibility helpers build their member and postal code path segments directly", async () => {
    const axios = vi
      .fn()
      .mockResolvedValueOnce({ data: { canJoin: true } })
      .mockResolvedValueOnce({ data: { postalCodeEnabled: false } })
    axios.CancelToken = { source: vi.fn() }
    axios.all = vi.fn()

    const { api } = await loadApiModule({ axiosImpl: axios })

    await expect(
      api.checkIsFromGenerationEnabledZone({ memberNumber: "0042", memberVat: "ES123" }),
    ).resolves.toEqual({ canJoin: true })
    await expect(
      api.checkIsPostalCodeFromGenerationEnabledZone({ postalCode: "08001" }),
    ).resolves.toEqual({ postalCodeEnabled: false })

    expect(axios).toHaveBeenNthCalledWith(1, {
      method: "GET",
      url: `${WEBFORMS_API_URL}/data/generationkwh/can_join/0042/ES123`,
    })
    expect(axios).toHaveBeenNthCalledWith(2, {
      method: "GET",
      url: `${WEBFORMS_API_URL}/data/generationkwh/can_join/08001`,
    })
  })

  test("generation contribution helpers POST their payloads to the signature and contribution endpoints", async () => {
    const axios = vi
      .fn()
      .mockResolvedValueOnce({ data: { signatureId: "sig-1" } })
      .mockResolvedValueOnce({ data: { created: true } })
    axios.CancelToken = { source: vi.fn() }
    axios.all = vi.fn()

    const { api } = await loadApiModule({ axiosImpl: axios })
    const signaturePayload = { lead_id: "lead-77", shares: 5 }
    const contributionPayload = { member_id: "42", project_code: "GKWH-1" }

    await expect(api.createGenerationkWhSignature(signaturePayload)).resolves.toEqual({
      signatureId: "sig-1",
    })
    await expect(api.generationkWhContribution(contributionPayload)).resolves.toEqual({
      created: true,
    })

    expect(axios).toHaveBeenNthCalledWith(1, {
      method: "POST",
      url: `${WEBFORMS_API_URL}/form/create_gkwh_signature`,
      data: signaturePayload,
    })
    expect(axios).toHaveBeenNthCalledWith(2, {
      method: "POST",
      url: `${WEBFORMS_API_URL}/form/generationkwh`,
      data: contributionPayload,
    })
  })

  test("checkVat cancels the previous validator request before issuing a new one", async () => {
    const firstSource = {
      token: "vat-token-1",
      cancel: vi.fn(),
    }
    const secondSource = {
      token: "vat-token-2",
      cancel: vi.fn(),
    }
    const axios = vi.fn().mockResolvedValue({ data: { exists: true } })
    axios.CancelToken = {
      source: vi.fn().mockReturnValueOnce(firstSource).mockReturnValueOnce(secondSource),
    }
    axios.all = vi.fn()

    const { api } = await loadApiModule({ axiosImpl: axios })

    await api.checkVat("ES123")
    await api.checkVat("ES456")

    expect(axios).toHaveBeenNthCalledWith(1, {
      method: "GET",
      url: `${WEBFORMS_API_URL}/check/vat/exists/ES123`,
      cancelToken: "vat-token-1",
    })
    expect(firstSource.cancel).toHaveBeenCalledWith(
      "Operation canceled due to new request",
    )
    expect(axios).toHaveBeenNthCalledWith(2, {
      method: "GET",
      url: `${WEBFORMS_API_URL}/check/vat/exists/ES456`,
      cancelToken: "vat-token-2",
    })
  })

  test("checkMember cancels the previous validator request before issuing a new one", async () => {
    const firstSource = {
      token: "member-token-1",
      cancel: vi.fn(),
    }
    const secondSource = {
      token: "member-token-2",
      cancel: vi.fn(),
    }
    const axios = vi.fn().mockResolvedValue({ data: { member: true } })
    axios.CancelToken = {
      source: vi.fn().mockReturnValueOnce(firstSource).mockReturnValueOnce(secondSource),
    }
    axios.all = vi.fn()

    const { api } = await loadApiModule({ axiosImpl: axios })

    await api.checkMember("0042", "ES123")
    await api.checkMember("0043", "ES456")

    expect(axios).toHaveBeenNthCalledWith(1, {
      method: "GET",
      url: `${WEBFORMS_API_URL}/check/soci/0042/ES123`,
      cancelToken: "member-token-1",
    })
    expect(firstSource.cancel).toHaveBeenCalledWith(
      "Operation canceled due to new request",
    )
    expect(axios).toHaveBeenNthCalledWith(2, {
      method: "GET",
      url: `${WEBFORMS_API_URL}/check/soci/0043/ES456`,
      cancelToken: "member-token-2",
    })
  })

  test("checkCups cancels the previous validator request before issuing a new one", async () => {
    const firstSource = {
      token: "cups-token-1",
      cancel: vi.fn(),
    }
    const secondSource = {
      token: "cups-token-2",
      cancel: vi.fn(),
    }
    const axios = vi.fn().mockResolvedValue({ data: { active: true } })
    axios.CancelToken = {
      source: vi.fn().mockReturnValueOnce(firstSource).mockReturnValueOnce(secondSource),
    }
    axios.all = vi.fn()

    const { api } = await loadApiModule({ axiosImpl: axios })

    await api.checkCups("ES0021000000000001AB")
    await api.checkCups("ES0021000000000002CD")

    expect(axios).toHaveBeenNthCalledWith(1, {
      method: "GET",
      url: `${WEBFORMS_API_URL}/check/cups/status/ES0021000000000001AB`,
      cancelToken: "cups-token-1",
    })
    expect(firstSource.cancel).toHaveBeenCalledWith(
      "Operation canceled due to new request",
    )
    expect(axios).toHaveBeenNthCalledWith(2, {
      method: "GET",
      url: `${WEBFORMS_API_URL}/check/cups/status/ES0021000000000002CD`,
      cancelToken: "cups-token-2",
    })
  })

  test("checkCnae cancels the previous validator request before issuing a new one", async () => {
    const firstSource = {
      token: "cnae-token-1",
      cancel: vi.fn(),
    }
    const secondSource = {
      token: "cnae-token-2",
      cancel: vi.fn(),
    }
    const axios = vi.fn().mockResolvedValue({ data: { valid: true } })
    axios.CancelToken = {
      source: vi.fn().mockReturnValueOnce(firstSource).mockReturnValueOnce(secondSource),
    }
    axios.all = vi.fn()

    const { api } = await loadApiModule({ axiosImpl: axios })

    await api.checkCnae("3514")
    await api.checkCnae("4321")

    expect(axios).toHaveBeenNthCalledWith(1, {
      method: "GET",
      url: `${WEBFORMS_API_URL}/check/cnae/3514`,
      cancelToken: "cnae-token-1",
    })
    expect(firstSource.cancel).toHaveBeenCalledWith(
      "Operation canceled due to new request",
    )
    expect(axios).toHaveBeenNthCalledWith(2, {
      method: "GET",
      url: `${WEBFORMS_API_URL}/check/cnae/4321`,
      cancelToken: "cnae-token-2",
    })
  })

  test("getContractSignature builds the cups query string from URLSearchParams", async () => {
    const axios = vi.fn().mockResolvedValue({ data: { url: "signed" } })
    axios.CancelToken = { source: vi.fn() }
    axios.all = vi.fn()

    const { api } = await loadApiModule({ axiosImpl: axios })

    await expect(
      api.getContractSignature({ leadId: "lead-42", cups: "ES 123/ABC" }),
    ).resolves.toEqual({ url: "signed" })

    expect(axios).toHaveBeenCalledWith({
      method: "GET",
      url: `${WEBFORMS_API_URL}/procedures/sign/contract/lead-42?cups=ES+123%2FABC`,
    })
  })

  test("checkCadastralReference cancels the previous validator request before issuing a new one", async () => {
    const firstSource = {
      token: "cadastral-token-1",
      cancel: vi.fn(),
    }
    const secondSource = {
      token: "cadastral-token-2",
      cancel: vi.fn(),
    }
    const axios = vi.fn().mockResolvedValue({ data: { exists: true } })
    axios.CancelToken = {
      source: vi.fn().mockReturnValueOnce(firstSource).mockReturnValueOnce(secondSource),
    }
    axios.all = vi.fn()

    const { api } = await loadApiModule({ axiosImpl: axios })

    await api.checkCadastralReference("1234567DF3813C")
    await api.checkCadastralReference("7654321DF3813C")

    expect(axios).toHaveBeenNthCalledWith(1, {
      method: "GET",
      url: `${WEBFORMS_API_URL}/check/cadastral_reference/1234567DF3813C`,
      cancelToken: "cadastral-token-1",
    })
    expect(firstSource.cancel).toHaveBeenCalledWith(
      "Operation canceled due to new request",
    )
    expect(axios).toHaveBeenNthCalledWith(2, {
      method: "GET",
      url: `${WEBFORMS_API_URL}/check/cadastral_reference/7654321DF3813C`,
      cancelToken: "cadastral-token-2",
    })
  })

  test("uploadFile appends the expected FormData fields and keeps upload progress under the nested config key", async () => {
    const appendedEntries = []
    const formDataInstance = {
      append: vi.fn((key, value) => appendedEntries.push([key, value])),
    }
    global.FormData = vi.fn(function FormData() {
      return formDataInstance
    })

    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {})
    const axios = vi.fn().mockResolvedValue({ data: { uploaded: true } })
    axios.CancelToken = { source: vi.fn() }
    axios.all = vi.fn()

    const { api } = await loadApiModule({ axiosImpl: axios })
    const file = { name: "invoice.pdf", size: 128 }

    await expect(api.uploadFile("attachment", file)).resolves.toEqual({ uploaded: true })

    expect(global.FormData).toHaveBeenCalledTimes(1)
    expect(appendedEntries).toEqual([
      ["field", "attachment"],
      ["uploaded_file", file],
      ["context", ""],
    ])

    const request = axios.mock.calls[0][0]
    expect(request).toMatchObject({
      method: "POST",
      url: `${WEBFORMS_API_URL}/form/upload_attachment`,
      data: formDataInstance,
    })
    expect(request.config).toEqual({
      onUploadProgress: expect.any(Function),
    })

    request.config.onUploadProgress({ loaded: 25, total: 40 })
    expect(logSpy).toHaveBeenCalledWith(63, "%")

    logSpy.mockRestore()
  })

  test("simple GET wrappers return response data for province and self-consumption catalog endpoints", async () => {
    const axios = vi
      .fn()
      .mockResolvedValueOnce({ data: [{ id: "BCN" }] })
      .mockResolvedValueOnce({ data: [{ id: "08019" }] })
      .mockResolvedValueOnce({ data: [{ id: "roof" }] })
      .mockResolvedValueOnce({ data: [{ id: "solar" }] })
    axios.CancelToken = { source: vi.fn() }
    axios.all = vi.fn()

    const { api } = await loadApiModule({ axiosImpl: axios })

    await expect(api.getProvincies()).resolves.toEqual([{ id: "BCN" }])
    await expect(api.getMunicipis("08")).resolves.toEqual([{ id: "08019" }])
    await expect(api.getSelfConsumptionSituations()).resolves.toEqual([{ id: "roof" }])
    await expect(api.getSelfConsumptionTechnologies()).resolves.toEqual([{ id: "solar" }])

    expect(axios).toHaveBeenNthCalledWith(1, {
      method: "GET",
      url: `${WEBFORMS_API_URL}/data/provincies`,
    })
    expect(axios).toHaveBeenNthCalledWith(2, {
      method: "GET",
      url: `${WEBFORMS_API_URL}/data/municipis/08`,
    })
    expect(axios).toHaveBeenNthCalledWith(3, {
      method: "GET",
      url: `${WEBFORMS_API_URL}/data/installation_types`,
    })
    expect(axios).toHaveBeenNthCalledWith(4, {
      method: "GET",
      url: `${WEBFORMS_API_URL}/data/generator_technologies`,
    })
  })

  test("apiStatus returns the raw axios response from the ping endpoint", async () => {
    const response = { status: 204, headers: { "x-trace": "ok" } }
    const axios = vi.fn().mockResolvedValue(response)
    axios.CancelToken = { source: vi.fn() }
    axios.all = vi.fn()

    const { api } = await loadApiModule({ axiosImpl: axios })

    await expect(api.apiStatus()).resolves.toBe(response)

    expect(axios).toHaveBeenCalledWith({
      method: "GET",
      url: `${WEBFORMS_API_URL}/ping`,
    })
  })

  test("simple POST wrappers preserve their auth and path parameter request shapes", async () => {
    const axios = vi
      .fn()
      .mockResolvedValueOnce({ data: { id: "lead-99" } })
      .mockResolvedValueOnce({ data: { modified: true } })
      .mockResolvedValueOnce({ data: { confirmed: true } })
    axios.CancelToken = { source: vi.fn() }
    axios.all = vi.fn()

    const { api } = await loadApiModule({ axiosImpl: axios })
    const leadPayload = { vat: "ES123", cups: "ES002" }
    const modificationPayload = { field: "value" }
    const d1Payload = { accepted: true }

    await expect(api.createContractLead(leadPayload)).resolves.toEqual({ id: "lead-99" })
    await expect(api.modifyContract(modificationPayload, "Bearer mod-token")).resolves.toEqual({
      modified: true,
    })
    await expect(api.confirmD1Case(d1Payload, "case-7", "Bearer d1-token")).resolves.toEqual({
      confirmed: true,
    })

    expect(axios).toHaveBeenNthCalledWith(1, {
      method: "POST",
      url: `${WEBFORMS_API_URL}/procedures/contract`,
      data: leadPayload,
    })
    expect(axios).toHaveBeenNthCalledWith(2, {
      method: "POST",
      url: `${WEBFORMS_API_URL}/procedures/contract_modification`,
      headers: { Authorization: "Bearer mod-token" },
      data: modificationPayload,
    })
    expect(axios).toHaveBeenNthCalledWith(3, {
      method: "POST",
      url: `${WEBFORMS_API_URL}/procedures/d1_confirmation/case-7`,
      headers: { Authorization: "Bearer d1-token" },
      data: d1Payload,
    })
  })

  test("holderChange and modify_tariff POST their payloads while preserving the current auth shape", async () => {
    const axios = vi
      .fn()
      .mockResolvedValueOnce({ data: { changed: true } })
      .mockResolvedValueOnce({ data: { indexed: true } })
    axios.CancelToken = { source: vi.fn() }
    axios.all = vi.fn()

    const { api } = await loadApiModule({ axiosImpl: axios })
    const holderChangePayload = { contract_id: 10, holder_name: "Ada Lovelace" }
    const modifyTariffPayload = { token: "Bearer indexed-token", tariff: "2.0TD" }

    await expect(api.holderChange(holderChangePayload)).resolves.toEqual({ changed: true })
    await expect(api.modify_tariff(modifyTariffPayload)).resolves.toEqual({ indexed: true })

    expect(axios).toHaveBeenNthCalledWith(1, {
      method: "POST",
      url: `${WEBFORMS_API_URL}/form/holderchange`,
      data: holderChangePayload,
    })
    expect(axios).toHaveBeenNthCalledWith(2, {
      method: "POST",
      url: `${WEBFORMS_API_URL}/procedures/contract_indexed`,
      headers: { Authorization: "Bearer indexed-token" },
      data: modifyTariffPayload,
    })
  })

  test("getIndexedTariffPrices sends geo zone params and returns nested data", async () => {
    const axios = vi.fn().mockResolvedValue({
      data: { data: [{ hour: 1, price: 0.12 }] },
    })
    axios.CancelToken = { source: vi.fn() }
    axios.all = vi.fn()

    const { api } = await loadApiModule({ axiosImpl: axios })

    await expect(
      api.getIndexedTariffPrices({ tariff: "2.0TD", geoZone: "PENINSULA" }),
    ).resolves.toEqual([{ hour: 1, price: 0.12 }])

    expect(axios).toHaveBeenCalledWith({
      method: "GET",
      url: `${WEBFORMS_API_URL}/data/indexed_prices`,
      withCredentials: false,
      params: {
        tariff: "2.0TD",
        geo_zone: "PENINSULA",
      },
    })
  })

  test("getIndexedTariffPrices throws the response object when axios resolves with an error field", async () => {
    const response = { error: { message: "bad payload" } }
    const axios = vi.fn().mockResolvedValue(response)
    axios.CancelToken = { source: vi.fn() }
    axios.all = vi.fn()

    const { api } = await loadApiModule({ axiosImpl: axios })

    await expect(
      api.getIndexedTariffPrices({ tariff: "2.0TD", geoZone: "BALEARS" }),
    ).rejects.toBe(response)
  })

  test("getIndexedTariffPrices rethrows rejected axios errors", async () => {
    const error = new Error("indexed request failed")
    const axios = vi.fn().mockRejectedValue(error)
    axios.CancelToken = { source: vi.fn() }
    axios.all = vi.fn()

    const { api } = await loadApiModule({ axiosImpl: axios })

    await expect(
      api.getIndexedTariffPrices({ tariff: "3.0TD", geoZone: "CANARIAS" }),
    ).rejects.toBe(error)
  })

  test("getCompensationIndexedPrices sends only the geo zone param and returns nested data", async () => {
    const axios = vi.fn().mockResolvedValue({
      data: { data: [{ hour: 2, price: 0.08 }] },
    })
    axios.CancelToken = { source: vi.fn() }
    axios.all = vi.fn()

    const { api } = await loadApiModule({ axiosImpl: axios })

    await expect(
      api.getCompensationIndexedPrices({ geoZone: "CANARIAS" }),
    ).resolves.toEqual([{ hour: 2, price: 0.08 }])

    expect(axios).toHaveBeenCalledWith({
      method: "GET",
      url: `${WEBFORMS_API_URL}/data/compensation_indexed_prices`,
      withCredentials: false,
      params: {
        geo_zone: "CANARIAS",
      },
    })
  })

  test("getCompensationIndexedPrices throws the resolved response when it contains an error field", async () => {
    const response = { error: { message: "bad payload" } }
    const axios = vi.fn().mockResolvedValue(response)
    axios.CancelToken = { source: vi.fn() }
    axios.all = vi.fn()

    const { api } = await loadApiModule({ axiosImpl: axios })

    await expect(api.getCompensationIndexedPrices({ geoZone: "PENINSULA" })).rejects.toBe(
      response,
    )
  })

  test("getCompensationIndexedPrices rethrows rejected axios errors", async () => {
    const error = new Error("compensation request failed")
    const axios = vi.fn().mockRejectedValue(error)
    axios.CancelToken = { source: vi.fn() }
    axios.all = vi.fn()

    const { api } = await loadApiModule({ axiosImpl: axios })

    await expect(api.getCompensationIndexedPrices({ geoZone: "BALEARS" })).rejects.toBe(
      error,
    )
  })

  test("can_modify_tariff sends the authorization header on the indexed eligibility endpoint", async () => {
    const axios = vi.fn().mockResolvedValue({ data: { allowed: true } })
    axios.CancelToken = { source: vi.fn() }
    axios.all = vi.fn()

    const { api } = await loadApiModule({ axiosImpl: axios })

    await expect(api.can_modify_tariff("Bearer abc")).resolves.toEqual({ allowed: true })

    expect(axios).toHaveBeenCalledWith({
      method: "GET",
      url: `${WEBFORMS_API_URL}/procedures/can_turn_contract_indexed`,
      headers: { Authorization: "Bearer abc" },
    })
  })

  test("cancelContract posts to the local OV endpoint with csrf header and full payload", async () => {
    const axios = vi.fn().mockResolvedValue({ data: { cancelled: true } })
    axios.CancelToken = { source: vi.fn() }
    axios.all = vi.fn()

    const { api } = await loadApiModule({ axiosImpl: axios })
    const payload = { contract_id: 77, csrfToken: "csrf-123", reason: "user-request" }

    await expect(api.cancelContract(payload)).resolves.toEqual({ cancelled: true })

    expect(axios).toHaveBeenCalledWith({
      method: "POST",
      url: "/contract/77/cancel",
      data: payload,
      headers: {
        "X-CSRFToken": "csrf-123",
      },
    })
  })

  test("confirmCancelContract posts to the tokenized local OV endpoint with only the csrf header", async () => {
    const axios = vi.fn().mockResolvedValue({ data: { confirmed: true } })
    axios.CancelToken = { source: vi.fn() }
    axios.all = vi.fn()

    const { api } = await loadApiModule({ axiosImpl: axios })

    await expect(
      api.confirmCancelContract({
        contract_id: 88,
        csrfToken: "csrf-456",
        token: "confirm-token",
      }),
    ).resolves.toEqual({ confirmed: true })

    expect(axios).toHaveBeenCalledWith({
      method: "POST",
      url: "/contract/88/confirm_cancellation/confirm-token",
      headers: {
        "X-CSRFToken": "csrf-456",
      },
    })
  })

  test("generationChangeContractPriority PUTs the full payload to the local assignment ordering endpoint", async () => {
    const axios = vi.fn().mockResolvedValue({ data: { reordered: true } })
    axios.CancelToken = { source: vi.fn() }
    axios.all = vi.fn()

    const { api } = await loadApiModule({ axiosImpl: axios })
    const payload = { assignment_id: 9, contract_ids: [3, 1, 2] }

    await expect(api.generationChangeContractPriority(payload)).resolves.toEqual({
      reordered: true,
    })

    expect(axios).toHaveBeenCalledWith({
      method: "PUT",
      url: "/api/investments/change-assignment-order/",
      data: payload,
    })
  })

  test("assignment endpoints use their expected local urls and payload shapes", async () => {
    const axios = vi
      .fn()
      .mockResolvedValueOnce({ data: [{ id: "unassigned-1" }] })
      .mockResolvedValueOnce({ data: [{ id: "assignment-1" }] })
      .mockResolvedValueOnce({ data: { created: 2 } })
      .mockResolvedValueOnce({ data: { deleted: true } })
    axios.CancelToken = { source: vi.fn() }
    axios.all = vi.fn()

    const { api } = await loadApiModule({ axiosImpl: axios })
    const addPayload = { assignment_id: 4, contract_ids: [11, 12] }

    await expect(api.getNoAssignmentContracts()).resolves.toEqual([{ id: "unassigned-1" }])
    await expect(api.getAssignmentContracts()).resolves.toEqual([{ id: "assignment-1" }])
    await expect(api.addContractsToAssignments(addPayload)).resolves.toEqual({ created: 2 })
    await expect(api.deleteContractsFromAssignments(12)).resolves.toEqual({ deleted: true })

    expect(axios).toHaveBeenNthCalledWith(1, {
      method: "GET",
      url: "/api/investments/unassigned-contracts",
    })
    expect(axios).toHaveBeenNthCalledWith(2, {
      method: "GET",
      url: "/api/investments/assignments/",
    })
    expect(axios).toHaveBeenNthCalledWith(3, {
      method: "POST",
      url: "/api/investments/assignments/",
      data: addPayload,
    })
    expect(axios).toHaveBeenNthCalledWith(4, {
      method: "DELETE",
      url: "/api/investments/assignments/12",
    })
  })

  test("getPowers builds the gurb and tariff path segments directly into the request url", async () => {
    const axios = vi.fn().mockResolvedValue({ data: { p1: 5.75, p2: 4.6 } })
    axios.CancelToken = { source: vi.fn() }
    axios.all = vi.fn()

    const { api } = await loadApiModule({ axiosImpl: axios })

    await expect(api.getPowers("GKWH-001", "2.0TD")).resolves.toEqual({ p1: 5.75, p2: 4.6 })

    expect(axios).toHaveBeenCalledWith({
      method: "GET",
      url: `${WEBFORMS_API_URL}/data/gurb/GKWH-001/2.0TD`,
    })
  })

  test("activateLead returns response data on success and rethrows axios errors", async () => {
    const axios = vi
      .fn()
      .mockResolvedValueOnce({ data: { activated: true } })
      .mockRejectedValueOnce(new Error("network down"))
    axios.CancelToken = { source: vi.fn() }
    axios.all = vi.fn()

    const { api } = await loadApiModule({ axiosImpl: axios })

    await expect(api.activateLead("lead-1")).resolves.toEqual({ activated: true })
    await expect(api.activateLead("lead-2")).rejects.toThrow("network down")

    expect(axios).toHaveBeenNthCalledWith(1, {
      method: "POST",
      url: `${WEBFORMS_API_URL}/procedures/leads/lead-1/activate`,
    })
    expect(axios).toHaveBeenNthCalledWith(2, {
      method: "POST",
      url: `${WEBFORMS_API_URL}/procedures/leads/lead-2/activate`,
    })
  })

  test("activateLead throws a resolved response when it contains an error flag", async () => {
    const response = { error: true, data: { activated: false } }
    const axios = vi.fn().mockResolvedValue(response)
    axios.CancelToken = { source: vi.fn() }
    axios.all = vi.fn()

    const { api } = await loadApiModule({ axiosImpl: axios })

    await expect(api.activateLead("lead-3")).rejects.toBe(response)
  })
})
