import { useCallback, useState } from "react"

import {
  fireEvent,
  queryByAttribute,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react"
import { vi } from "vitest"

import AddressField from "./AddressField"

vi.mock("react-i18next", async () => import("../tests/__mocks__/i18n.js"))

const apiMocks = vi.hoisted(() => ({
  getMunicipis: vi.fn(),
  getMunicipisByPostalCode: vi.fn(),
  getProvincies: vi.fn(),
}))

const googleApiMocks = vi.hoisted(() => ({
  getPlaceDetails: vi.fn(),
  searchPlace: vi.fn(),
}))

vi.mock("../services/api", () => ({
  getMunicipis: apiMocks.getMunicipis,
  getMunicipisByPostalCode: apiMocks.getMunicipisByPostalCode,
  getProvincies: apiMocks.getProvincies,
}))

vi.mock("../services/googleApiClient", () => ({
  getPlaceDetails: googleApiMocks.getPlaceDetails,
  searchPlace: googleApiMocks.searchPlace,
}))

const ADDRESS_LABEL = "Supply point address"

const setIn = (source, path, value) => {
  const nextValue = structuredClone(source)
  const keys = path.split(".")
  let cursor = nextValue

  keys.slice(0, -1).forEach((key) => {
    cursor[key] ??= {}
    cursor = cursor[key]
  })

  cursor[keys.at(-1)] = value

  return nextValue
}

const renderComponent = ({
  initialValues = {
    address: {
      street: "",
      postal_code: "",
      state: { id: "", name: "" },
      city: { id: "", name: "" },
      number: "",
      bloc: "",
      stairs: "",
      floor: "",
      door: "",
    },
  },
  initialErrors = { address: {} },
  initialTouched = { address: {} },
  setFieldValueSpy = vi.fn(),
  setFieldTouchedSpy = vi.fn(),
  setValuesSpy = vi.fn(),
} = {}) => {
  const Wrapper = () => {
    const [values, setValuesState] = useState(initialValues)
    const [errors] = useState(initialErrors)
    const [touched, setTouchedState] = useState(initialTouched)

    const setFieldValue = useCallback(
      (fieldName, value) => {
        setFieldValueSpy(fieldName, value)
        setValuesState((currentValues) =>
          setIn(currentValues, fieldName, value),
        )
      },
      [setFieldValueSpy],
    )

    const setFieldTouched = useCallback(
      (fieldName, value) => {
        setFieldTouchedSpy(fieldName, value)
        setTouchedState((currentTouched) =>
          setIn(currentTouched, fieldName, value),
        )
      },
      [setFieldTouchedSpy],
    )

    const setValues = useCallback(
      (nextValues) => {
        setValuesSpy(nextValues)
        setValuesState(nextValues)
      },
      [setValuesSpy],
    )

    return (
      <AddressField
        addressLabel={ADDRESS_LABEL}
        values={values}
        errors={errors}
        touched={touched}
        setFieldValue={setFieldValue}
        setFieldTouched={setFieldTouched}
        setValues={setValues}
      />
    )
  }

  return render(<Wrapper />)
}

const getByDataCy = (container, value) =>
  queryByAttribute("data-cy", container, value)

describe("AddressField component", () => {
  beforeEach(() => {
    vi.clearAllMocks()

    apiMocks.getProvincies.mockResolvedValue({
      data: {
        provincies: [
          { id: "08", name: "Barcelona" },
          { id: "17", name: "Girona" },
        ],
      },
    })
    apiMocks.getMunicipis.mockResolvedValue({ data: { municipis: [] } })
    apiMocks.getMunicipisByPostalCode.mockResolvedValue([])

    googleApiMocks.searchPlace.mockResolvedValue([])
    googleApiMocks.getPlaceDetails.mockResolvedValue({ addressComponents: [] })
  })

  test("renders the current address values and field copy", () => {
    const { container } = renderComponent({
      initialValues: {
        address: {
          street: "Carrer Major",
          postal_code: "08001",
          state: { id: "", name: "" },
          city: { id: "", name: "" },
          number: "12",
          bloc: "B",
          stairs: "2",
          floor: "1",
          door: "3",
        },
      },
    })

    expect(screen.getByText(ADDRESS_LABEL)).toBeInTheDocument()
    expect(screen.getByText("POSTAL_CODE")).toBeInTheDocument()
    expect(screen.getByText("NUMBER")).toBeInTheDocument()
    expect(screen.getByText("HELPER_NUMBER_ADDRESS")).toBeInTheDocument()
    expect(screen.getByText("BLOCK")).toBeInTheDocument()
    expect(screen.getByText("STAIRS")).toBeInTheDocument()
    expect(screen.getByText("FLOOR")).toBeInTheDocument()
    expect(screen.getByText("DOOR")).toBeInTheDocument()

    expect(screen.getAllByRole("combobox")[0]).toHaveValue("Carrer Major")
    expect(getByDataCy(container, "address.postal_code-input")).toHaveValue(
      "08001",
    )
    expect(getByDataCy(container, "address.number-input")).toHaveValue("12")
    expect(getByDataCy(container, "address.bloc-input")).toHaveValue("B")
    expect(getByDataCy(container, "address.stairs-input")).toHaveValue("2")
    expect(getByDataCy(container, "address.door-input")).toHaveValue("3")
    expect(container.querySelector('input[name="address.floor"]')).toHaveValue(
      "1",
    )
  })

  test("stores a free-text street and marks the street as touched on blur", async () => {
    const setFieldValueSpy = vi.fn()
    const setFieldTouchedSpy = vi.fn()

    renderComponent({
      setFieldValueSpy,
      setFieldTouchedSpy,
    })

    const streetInput = screen.getAllByRole("combobox")[0]

    fireEvent.change(streetInput, { target: { value: "Manual street" } })
    fireEvent.blur(streetInput)

    await waitFor(() => {
      expect(setFieldTouchedSpy).toHaveBeenCalledWith("address.street", true)
      expect(setFieldValueSpy).toHaveBeenCalledWith(
        "address.street",
        "Manual street",
      )
    })
  })

  test("sanitizes the number, updates plain text fields, and stores floor free-solo values on blur", async () => {
    const setFieldValueSpy = vi.fn()
    const { container } = renderComponent({ setFieldValueSpy })

    fireEvent.change(getByDataCy(container, "address.number-input"), {
      target: { value: "12B" },
    })
    fireEvent.change(getByDataCy(container, "address.bloc-input"), {
      target: { name: "address.bloc", value: "B" },
    })

    const floorRoot = getByDataCy(container, "address.floor")
    const floorInput = within(floorRoot).getByRole("combobox")

    fireEvent.change(floorInput, { target: { value: "2n@" } })
    fireEvent.blur(floorInput, { target: { value: "2n@" } })

    await waitFor(() => {
      expect(setFieldValueSpy).toHaveBeenCalledWith("address.number", "12")
      expect(setFieldValueSpy).toHaveBeenCalledWith("address.bloc", "B")
      expect(setFieldValueSpy).toHaveBeenCalledWith("address.floor", "2")
    })
  })

  test("selects an address suggestion and populates normalized address data", async () => {
    const setValuesSpy = vi.fn()
    const { container } = renderComponent({
      initialValues: {
        address: {
          street: "",
          postal_code: "",
          state: { id: "", name: "" },
          city: { id: "", name: "" },
          number: "34",
          bloc: "",
          stairs: "",
          floor: "",
          door: "",
        },
      },
      setValuesSpy,
    })

    googleApiMocks.searchPlace.mockResolvedValue([
      { id: "place-1", text: "Avinguda de la Verge de Montserrat" },
    ])
    googleApiMocks.getPlaceDetails.mockResolvedValue({
      addressComponents: [
        { types: ["route"], longText: "Avinguda de la Verge de Montserrat" },
        { types: ["postal_code"], longText: "08080" },
      ],
    })
    apiMocks.getMunicipisByPostalCode.mockResolvedValue([
      [
        {
          municipi: { id: "08019", name: "Barcelona" },
          provincia: { id: "08", name: "Barcelona" },
        },
      ],
    ])

    const streetInput = screen.getAllByRole("combobox")[0]

    fireEvent.change(streetInput, {
      target: { value: "Avinguda de la Verge de Montserrat" },
    })

    fireEvent.click(
      await screen.findByRole("option", {
        name: "Avinguda de la Verge de Montserrat",
      }),
    )

    await waitFor(() => {
      expect(googleApiMocks.getPlaceDetails).toHaveBeenCalledTimes(2)
      expect(apiMocks.getMunicipisByPostalCode).toHaveBeenCalledWith("08080")
      expect(setValuesSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          address: expect.objectContaining({
            id: "place-1",
            text: "Avinguda de la Verge de Montserrat",
            number: "34",
            postal_code: "08080",
            street: "Avinguda de la Verge de Montserrat",
            state: { id: "08", name: "Barcelona" },
            city: { id: "08019", name: "Barcelona" },
            cadas_tv: "AV",
            cadas_street: ["de", "la", "Verge de Montserrat"],
          }),
        }),
      )
    })
  })

  test("falls back to the typed street and clears the postal code when place details fail", async () => {
    const error = new Error("place failed")
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {})
    const setFieldValueSpy = vi.fn()

    renderComponent({ setFieldValueSpy })

    googleApiMocks.searchPlace.mockResolvedValue([
      { id: "broken-place", text: "Broken street" },
    ])
    googleApiMocks.getPlaceDetails.mockRejectedValue(error)

    const streetInput = screen.getAllByRole("combobox")[0]

    fireEvent.change(streetInput, { target: { value: "Broken street" } })
    fireEvent.click(
      await screen.findByRole("option", { name: "Broken street" }),
    )

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith(
        "Error fetching place details:",
        error,
      )
      expect(setFieldValueSpy).toHaveBeenCalledWith(
        "address.street",
        "Broken street",
      )
      expect(setFieldValueSpy).toHaveBeenCalledWith("address.postal_code", "")
    })

    consoleError.mockRestore()
  })

  test("updates city and state from the postal code and clears them again for short values", async () => {
    const setFieldValueSpy = vi.fn()
    const { container } = renderComponent({
      initialValues: {
        address: {
          street: "",
          postal_code: "",
          state: { id: "", name: "" },
          city: { id: "", name: "" },
          number: "",
          bloc: "",
          stairs: "",
          floor: "",
          door: "",
        },
      },
      setFieldValueSpy,
    })

    apiMocks.getMunicipisByPostalCode.mockResolvedValue([
      [
        {
          municipi: { id: "17079", name: "Girona" },
          provincia: { id: "17", name: "Girona" },
        },
      ],
    ])

    const postalCodeInput = getByDataCy(container, "address.postal_code-input")

    fireEvent.change(postalCodeInput, { target: { value: "17079" } })

    await waitFor(() => {
      expect(setFieldValueSpy).toHaveBeenCalledWith("address.city", {
        id: "17079",
        name: "Girona",
      })
      expect(setFieldValueSpy).toHaveBeenCalledWith("address.state", {
        id: "17",
        name: "Girona",
      })
    })

    fireEvent.change(postalCodeInput, { target: { value: "1707" } })

    expect(setFieldValueSpy).toHaveBeenCalledWith("address.city", {
      id: "",
      name: "",
    })
    expect(setFieldValueSpy).toHaveBeenCalledWith("address.state", {
      id: "",
      name: "",
    })
  })

  test("clears city and state and shows the state error fallback when postal lookup fails", async () => {
    const error = new Error("postal lookup failed")
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {})
    const setFieldValueSpy = vi.fn()
    const { container } = renderComponent({
      initialErrors: {
        address: {
          state: { id: "INVALID_STATE" },
        },
      },
      initialTouched: {
        address: {
          postal_code: true,
        },
      },
      setFieldValueSpy,
    })

    apiMocks.getMunicipisByPostalCode.mockRejectedValue(error)

    fireEvent.change(getByDataCy(container, "address.postal_code-input"), {
      target: { value: "08080" },
    })

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith(
        "Error getting municipalities by postal code:",
        error,
      )
      expect(setFieldValueSpy).toHaveBeenCalledWith("address.city", {
        id: "",
        name: "",
      })
      expect(setFieldValueSpy).toHaveBeenCalledWith("address.state", {
        id: "",
        name: "",
      })
    })

    expect(screen.getByText("INVALID_STATE")).toBeInTheDocument()

    consoleError.mockRestore()
  })
})
