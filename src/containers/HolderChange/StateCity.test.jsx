import { render, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { vi } from "vitest"

import StateCity from "./StateCity"

vi.mock("react-i18next", async () => import("../../tests/__mocks__/i18n.js"))

const apiMocks = vi.hoisted(() => ({
  getMunicipis: vi.fn(),
  getProvincies: vi.fn(),
}))

vi.mock("../../services/api", () => ({
  getMunicipis: apiMocks.getMunicipis,
  getProvincies: apiMocks.getProvincies,
}))

describe("HolderChange StateCity", () => {
  const renderStateCity = (props = {}) => {
    const onChange = vi.fn()

    const result = render(
      <StateCity
        cityId="holder_city"
        cityInitial={{ id: "", name: "" }}
        cityName="holder.city"
        onBlur={vi.fn()}
        onChange={onChange}
        stateId="holder_state"
        stateInitial={{ id: "", name: "" }}
        stateName="holder.state"
        {...props}
      />,
    )

    return { ...result, onChange }
  }

  const openOptionMenu = async (name) => {
    const user = userEvent.setup()

    await user.click(screen.getByRole("combobox", { name }))

    const listbox = within(screen.getByRole("presentation")).getByRole(
      "listbox",
    )
    return { user, listbox }
  }

  beforeEach(() => {
    apiMocks.getProvincies.mockResolvedValue({
      data: {
        provincies: [
          { id: "08", name: "Barcelona" },
          { id: "17", name: "Girona" },
        ],
      },
    })
    apiMocks.getMunicipis.mockResolvedValue({ data: { municipis: [] } })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  test("loads province options and keeps city disabled until a state is selected", async () => {
    renderStateCity()

    await waitFor(() => {
      expect(apiMocks.getProvincies).toHaveBeenCalledTimes(1)
    })

    expect(screen.getByRole("combobox", { name: "CITY" })).toHaveAttribute(
      "aria-disabled",
      "true",
    )

    const { listbox } = await openOptionMenu("STATE")

    expect(
      within(listbox).getByRole("option", { name: "Barcelona" }),
    ).toBeVisible()
    expect(
      within(listbox).getByRole("option", { name: "Girona" }),
    ).toBeVisible()
  })

  test("resets the current city when the state changes", async () => {
    const { onChange } = renderStateCity({
      cityInitial: { id: "08019", name: "Barcelona" },
      stateInitial: { id: "08", name: "Barcelona" },
    })
    const user = userEvent.setup()

    await waitFor(() => {
      expect(apiMocks.getMunicipis).toHaveBeenCalledWith("08")
    })

    await user.click(screen.getByRole("combobox", { name: "STATE" }))
    await user.click(screen.getByRole("option", { name: "Girona" }))

    expect(onChange).toHaveBeenCalledWith({
      state: { id: "17", name: "Girona" },
      city: { id: "" },
    })
  })

  test("propagates the selected city after loading municipalities for the chosen state", async () => {
    apiMocks.getMunicipis.mockResolvedValue({
      data: {
        municipis: [
          { id: "17079", name: "Girona" },
          { id: "17202", name: "Salt" },
        ],
      },
    })

    const { onChange } = renderStateCity({
      stateInitial: { id: "17", name: "Girona" },
    })
    const user = userEvent.setup()

    await waitFor(() => {
      expect(apiMocks.getMunicipis).toHaveBeenCalledWith("17")
    })

    await user.click(screen.getByRole("combobox", { name: "CITY" }))
    await user.click(screen.getByRole("option", { name: "Salt" }))

    expect(onChange).toHaveBeenCalledWith({
      state: { id: "17", name: "Girona" },
      city: { id: "17202", name: "Salt" },
    })
  })

  test("keeps selectors disabled when provinces loading fails", async () => {
    const error = new Error("province request failed")
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {})

    apiMocks.getProvincies.mockRejectedValueOnce(error)

    renderStateCity()

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith(error)
    })

    expect(screen.getByRole("combobox", { name: "STATE" })).toHaveAttribute(
      "aria-disabled",
      "true",
    )
    expect(screen.getByRole("combobox", { name: "CITY" })).toHaveAttribute(
      "aria-disabled",
      "true",
    )

    consoleError.mockRestore()
  })

  test("keeps city selector disabled when municipalities loading fails", async () => {
    const error = new Error("city request failed")
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {})
    const user = userEvent.setup()

    apiMocks.getMunicipis.mockRejectedValueOnce(error)

    renderStateCity()

    await waitFor(() => {
      expect(apiMocks.getProvincies).toHaveBeenCalledTimes(1)
    })

    await user.click(screen.getByRole("combobox", { name: "STATE" }))
    await user.click(screen.getByRole("option", { name: "Girona" }))

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith(error)
    })

    expect(screen.getByRole("combobox", { name: "STATE" })).not.toHaveAttribute(
      "aria-disabled",
      "true",
    )
    expect(screen.getByRole("combobox", { name: "CITY" })).toHaveAttribute(
      "aria-disabled",
      "true",
    )

    consoleError.mockRestore()
  })
})
