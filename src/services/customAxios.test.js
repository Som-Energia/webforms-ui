import { afterEach, describe, expect, test, vi } from "vitest"

const loadModule = async ({ createImpl } = {}) => {
  vi.resetModules()

  const fallbackAxios = {
    defaults: {},
    CancelToken: { source: vi.fn() },
    all: vi.fn(),
  }

  const createdInstance = {
    defaults: {},
  }

  fallbackAxios.create = createImpl || vi.fn(() => createdInstance)

  vi.doMock("axios", () => ({
    default: fallbackAxios,
  }))

  const module = await import("./customAxios")

  return {
    module,
    fallbackAxios,
    createdInstance,
  }
}

const loadModuleWithCreatedInstance = async (createdInstance) =>
  loadModule({ createImpl: vi.fn(() => createdInstance) })

afterEach(() => {
  vi.resetModules()
  vi.doUnmock("axios")
  vi.clearAllMocks()
})

describe("customAxios", () => {
  test("creates an axios instance and seeds the default language header", async () => {
    const { module, fallbackAxios, createdInstance } = await loadModule()

    expect(fallbackAxios.create).toHaveBeenCalledTimes(1)
    expect(module.default).toBe(createdInstance)
    expect(createdInstance.defaults.headers.common["X-Language"]).toBe("es_ES")
  })

  test("falls back to the base axios object when create throws", async () => {
    const error = new Error("no create")
    const { module, fallbackAxios } = await loadModule({
      createImpl: vi.fn(() => {
        throw error
      }),
    })

    expect(module.default).toBe(fallbackAxios)
    expect(fallbackAxios.defaults.headers.common["X-Language"]).toBe("es_ES")
  })

  test("addLanguageHeader overrides the default language and restores es_ES on falsy input", async () => {
    const { module, createdInstance } = await loadModule()

    module.addLanguageHeader("ca_ES")
    expect(createdInstance.defaults.headers.common["X-Language"]).toBe("ca_ES")

    module.addLanguageHeader("")
    expect(createdInstance.defaults.headers.common["X-Language"]).toBe("es_ES")
  })

  test("re-exports CancelToken and all from axios", async () => {
    const { module, fallbackAxios } = await loadModule()

    expect(module.default.CancelToken).toBe(fallbackAxios.CancelToken)
    expect(module.default.all).toBe(fallbackAxios.all)
  })

  test("preserves existing defaults containers while updating the language header", async () => {
    const commonHeaders = { Authorization: "Bearer token" }
    const existingInstance = {
      defaults: {
        headers: {
          common: commonHeaders,
        },
      },
    }

    const { module } = await loadModuleWithCreatedInstance(existingInstance)

    expect(module.default.defaults.headers.common).toBe(commonHeaders)
    expect(module.default.defaults.headers.common.Authorization).toBe(
      "Bearer token",
    )
    expect(module.default.defaults.headers.common["X-Language"]).toBe("es_ES")
  })

  test("creates missing defaults containers when the axios instance has none", async () => {
    const { module } = await loadModuleWithCreatedInstance({})

    expect(module.default.defaults.headers.common["X-Language"]).toBe("es_ES")
  })
})
