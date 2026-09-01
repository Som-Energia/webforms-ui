import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { vi } from "vitest"

import PersonalData from "./PersonalData"

vi.mock("react-i18next", async () => import("../../tests/__mocks__/i18n.js"))

const apiMocks = vi.hoisted(() => ({
  checkVat: vi.fn(),
  getMunicipis: vi.fn(),
  getMunicipisByPostalCode: vi.fn(),
  getProvincies: vi.fn(),
}))

vi.mock("../../services/api", () => ({
  checkVat: apiMocks.checkVat,
  getMunicipis: apiMocks.getMunicipis,
  getMunicipisByPostalCode: apiMocks.getMunicipisByPostalCode,
  getProvincies: apiMocks.getProvincies,
}))

describe("PersonalData", () => {
  const buildEntityValues = (overrides = {}) => ({
    address: "",
    city: { id: "", name: "" },
    door: "",
    email: "",
    email2: "",
    floor: "",
    ismember: false,
    isphisical: true,
    language: "es_ES",
    name: "Alice",
    number: "12",
    phone1: "",
    phone2: "",
    postal_code: "",
    proxyname: "",
    proxynif: "",
    proxynif_valid: false,
    proxynif_phisical: false,
    state: { id: "", name: "" },
    surname1: "Holder",
    surname2: "Change",
    vatvalid: false,
    ...overrides,
  })

  const buildValues = (overrides = {}) => ({
    ...overrides,
    holder: buildEntityValues(overrides.holder),
    member: {
      ...buildEntityValues(),
      become_member: false,
      link_member: false,
      ...overrides.member,
    },
    privacy_policy_accepted: false,
    legal_person_accepted: false,
  })

  const renderPersonalData = async (overrides = {}, propsOverrides = {}) => {
    const setFieldValue = vi.fn()
    const setValues = vi.fn()

    const result = render(
      <PersonalData
        errors={{ holder: {} }}
        handleBlur={vi.fn()}
        handleChange={vi.fn()}
        setFieldTouched={vi.fn()}
        setFieldValue={setFieldValue}
        setValues={setValues}
        touched={{ holder: {} }}
        values={buildValues(overrides)}
        {...propsOverrides}
      />,
    )

    await waitFor(() => {
      expect(apiMocks.getProvincies).toHaveBeenCalled()
    })

    return { ...result, setFieldValue, setValues }
  }

  beforeEach(() => {
    apiMocks.getMunicipisByPostalCode.mockResolvedValue([])
    apiMocks.getProvincies.mockResolvedValue({ data: { provincies: [] } })
    apiMocks.getMunicipis.mockResolvedValue({ data: { municipis: [] } })
    apiMocks.checkVat.mockResolvedValue({ data: { valid: false } })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  test("trims leading and trailing spaces from both email fields", async () => {
    const { container, setFieldValue } = await renderPersonalData()

    fireEvent.change(container.querySelector("#holder_email"), {
      target: { name: "holder.email", value: " alice@example.org " },
    })
    fireEvent.change(container.querySelector("#holder_email2"), {
      target: { name: "holder.email2", value: " alice@example.org " },
    })

    expect(setFieldValue).toHaveBeenCalledWith(
      "holder.email",
      "alice@example.org",
    )
    expect(setFieldValue).toHaveBeenCalledWith(
      "holder.email2",
      "alice@example.org",
    )
  })

  test("limits phone input to the first 14 digits", async () => {
    const { container, setFieldValue } = await renderPersonalData()

    fireEvent.change(container.querySelector("#holder_phone"), {
      target: { name: "holder.phone1", value: "1234567890123456" },
    })

    expect(setFieldValue).toHaveBeenCalledWith(
      "holder.phone1",
      "12345678901234",
    )
  })

  test("toggles privacy policy acceptance through the real checkbox", async () => {
    const user = userEvent.setup()
    const { container, setFieldValue } = await renderPersonalData()

    await user.click(container.querySelector("#privacy_policy_accepted"))

    expect(setFieldValue).toHaveBeenCalledWith("privacy_policy_accepted", true)
  })

  test("accepts the legal person dialog and stores the confirmation", async () => {
    const user = userEvent.setup()
    const { container, setFieldValue } = await renderPersonalData({
      holder: { isphisical: false, vatvalid: true },
    })

    await user.click(container.querySelector("#legal_person_accepted"))
    await user.click(screen.getByRole("button", { name: "I_ACCEPT" }))

    expect(setFieldValue).toHaveBeenCalledWith("legal_person_accepted", true)
  })

  test("declines the legal person dialog and clears the confirmation", async () => {
    const user = userEvent.setup()
    const { container, setFieldValue } = await renderPersonalData({
      holder: { isphisical: false, vatvalid: true },
    })

    await user.click(container.querySelector("#legal_person_accepted"))
    await user.click(screen.getByRole("button", { name: "I_DECLINE" }))

    expect(setFieldValue).toHaveBeenCalledWith("legal_person_accepted", false)
  })

  test("autofills state and city from the postal code lookup when city is empty", async () => {
    apiMocks.getMunicipisByPostalCode.mockResolvedValue([
      [
        {
          provincia: { id: "08", name: "Barcelona" },
          municipi: { id: "080", name: "Barcelona" },
        },
      ],
    ])

    const { setFieldValue } = await renderPersonalData({
      holder: {
        postal_code: "08001",
      },
    })

    await waitFor(() => {
      expect(apiMocks.getMunicipisByPostalCode).toHaveBeenCalledWith("08001")
    })

    await waitFor(() => {
      expect(setFieldValue).toHaveBeenCalledWith("holder.state", {
        id: "08",
        name: "Barcelona",
      })
      expect(setFieldValue).toHaveBeenCalledWith("holder.city", {
        id: "080",
        name: "Barcelona",
      })
    })
  })

  test("does not look up postal code data when the city is already selected", async () => {
    const { setFieldValue } = await renderPersonalData({
      holder: {
        postal_code: "08001",
        city: { id: "080", name: "Barcelona" },
        state: { id: "08", name: "Barcelona" },
      },
    })

    await waitFor(() => {
      expect(apiMocks.getMunicipisByPostalCode).not.toHaveBeenCalled()
    })
    expect(setFieldValue).not.toHaveBeenCalledWith(
      "holder.state",
      expect.anything(),
    )
    expect(setFieldValue).not.toHaveBeenCalledWith(
      "holder.city",
      expect.anything(),
    )
  })

  test("uses contract privacy copy without the holderchange note when the flow has a service", async () => {
    await renderPersonalData({ contract: { has_service: true } })

    expect(screen.getByText("PRIVACY_POLICY_CONTRACT")).toBeInTheDocument()
    expect(
      screen.queryByText("PRIVACY_POLICY_HOLDERCHANGE_NOTE"),
    ).not.toBeInTheDocument()
  })

  test("renders the member legal person dialog copy", async () => {
    const user = userEvent.setup()
    const { container } = await renderPersonalData(
      {
        member: { isphisical: false, vatvalid: true },
      },
      { entity: "member" },
    )

    await user.click(container.querySelector("#legal_person_accepted"))

    expect(
      screen.getByText("PRIVACY_POLICY_LEGAL_PERSON_NEW_MEMBER"),
    ).toBeInTheDocument()
  })
})
