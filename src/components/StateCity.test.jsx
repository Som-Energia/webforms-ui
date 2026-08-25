import { render, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { vi } from "vitest"

import StateCity from "./StateCity"

vi.mock("react-i18next", async () => import("../tests/__mocks__/i18n.js"))

const apiMocks = vi.hoisted(() => ({
  getMunicipis: vi.fn(),
  getProvincies: vi.fn(),
}))

vi.mock("../services/api", () => ({
  getMunicipis: apiMocks.getMunicipis,
  getProvincies: apiMocks.getProvincies,
}))

describe("components/StateCity", () => {
  const renderStateCity = (props = {}) => {
    const onChange = vi.fn()

    const result = render(
      <StateCity
        stateName="address.state"
        state={{ id: "", name: "" }}
        cityName="address.city"
        city={{ id: "", name: "" }}
        onChange={onChange}
        {...props}
      />,
    )

    return { ...result, onChange }
  }

  const openSelect = async (name) => {
    const user = userEvent.setup()

    await user.click(getCombobox(name))

    const listbox = within(screen.getByRole("presentation")).getByRole(
      "listbox",
    )

    return { user, listbox }
  }

  const getCombobox = (name) => {
    const [stateCombobox, cityCombobox] = screen.getAllByRole("combobox", {
      name: "Without label",
    })

    return name === "STATE" ? stateCombobox : cityCombobox
  }

  beforeEach(() => {
    apiMocks.getProvincies.mockResolvedValue({
      data: {
        provincies: [
          { id: "17", name: "Girona" },
          { id: "08", name: "Barcelona" },
        ],
      },
    })
    apiMocks.getMunicipis.mockResolvedValue({ data: { municipis: [] } })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  test("loads province options on mount and keeps city disabled until there are cities", async () => {
    renderStateCity()

    await waitFor(() => {
      expect(apiMocks.getProvincies).toHaveBeenCalledTimes(1)
    })

    expect(getCombobox("CITY")).toHaveAttribute("aria-disabled", "true")

    const { listbox } = await openSelect("STATE")

    expect(
      within(listbox).getByRole("option", { name: "Barcelona" }),
    ).toBeVisible()
    expect(
      within(listbox).getByRole("option", { name: "Girona" }),
    ).toBeVisible()
  })

  test("fetches municipalities when an initial state with a non-empty id is provided", async () => {
    apiMocks.getMunicipis.mockResolvedValue({
      data: {
        municipis: [
          { id: "17202", name: "Salt" },
          { id: "17079", name: "Girona" },
        ],
      },
    })

    renderStateCity({ state: { id: "17", name: "Girona" } })

    await waitFor(() => {
      expect(apiMocks.getMunicipis).toHaveBeenCalledWith("17")
    })

    expect(getCombobox("CITY")).not.toHaveAttribute("aria-disabled", "true")

    const { listbox } = await openSelect("CITY")

    expect(
      within(listbox).getByRole("option", { name: "Girona" }),
    ).toBeVisible()
    expect(within(listbox).getByRole("option", { name: "Salt" })).toBeVisible()
  })

  test("logs province loading failures", async () => {
    const error = new Error("province request failed")
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {})

    apiMocks.getProvincies.mockRejectedValueOnce(error)

    renderStateCity()

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith(error)
    })

    consoleError.mockRestore()
  })

  test("logs municipality loading failures", async () => {
    const error = new Error("city request failed")
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {})

    apiMocks.getMunicipis.mockRejectedValueOnce(error)

    renderStateCity({ state: { id: "17", name: "Girona" } })

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith(error)
    })

    consoleError.mockRestore()
  })
})
