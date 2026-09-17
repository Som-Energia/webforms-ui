import { useCallback, useState } from "react"

import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { vi } from "vitest"

import PersonDataPhysical from "./PersonDataPhysical"

const translationState = vi.hoisted(() => ({
  language: "ca",
}))

const apiMocks = vi.hoisted(() => ({
  getMunicipis: vi.fn(),
  getMunicipisByPostalCode: vi.fn(),
  getProvincies: vi.fn(),
}))

const googleApiMocks = vi.hoisted(() => ({
  getPlaceDetails: vi.fn(),
  searchPlace: vi.fn(),
}))

const phoneMocks = vi.hoisted(() => ({
  isValidPhoneNumber: vi.fn(),
}))

vi.mock("react-i18next", async () => {
  const actual = await import("../tests/__mocks__/i18n.js")
  const translation = actual.useTranslation()

  return {
    ...actual,
    useTranslation: () => ({
      ...translation,
      i18n: {
        ...translation.i18n,
        language: translationState.language,
      },
    }),
  }
})

vi.mock("../services/api", () => ({
  getMunicipis: apiMocks.getMunicipis,
  getMunicipisByPostalCode: apiMocks.getMunicipisByPostalCode,
  getProvincies: apiMocks.getProvincies,
}))

vi.mock("../services/googleApiClient", () => ({
  getPlaceDetails: googleApiMocks.getPlaceDetails,
  searchPlace: googleApiMocks.searchPlace,
}))

vi.mock("libphonenumber-js", async () => {
  const actual = await vi.importActual("libphonenumber-js")

  return {
    ...actual,
    isValidPhoneNumber: phoneMocks.isValidPhoneNumber,
  }
})

const createAddress = () => ({
  street: "",
  postal_code: "",
  state: { id: "", name: "" },
  city: { id: "", name: "" },
  number: "",
  bloc: "",
  stairs: "",
  floor: "",
  door: "",
})

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

const buildRenderProps = (overrides = {}) => ({
  entity: "new_member",
  title: true,
  initialValues: {
    new_member: {
      name: "",
      surname1: "",
      surname2: "",
      gender: "",
      birthdate: null,
      email: "",
      email2: "",
      phone: "",
      phone_code: "",
      referral_source: "",
      language: "",
    },
    address: createAddress(),
  },
  initialErrors: {
    new_member: {},
    address: {},
  },
  initialTouched: {
    new_member: {},
    address: {},
  },
  setFieldValueSpy: vi.fn(),
  setFieldTouchedSpy: vi.fn(),
  setValuesSpy: vi.fn(),
  ...overrides,
})

const ControlledPersonDataPhysical = ({
  initialValues,
  initialErrors,
  initialTouched,
  setFieldValueSpy,
  setFieldTouchedSpy,
  setValuesSpy,
  ...componentProps
}) => {
  const [values, setValuesState] = useState(initialValues)
  const [errors] = useState(initialErrors)
  const [touched, setTouchedState] = useState(initialTouched)

  const setFieldValue = useCallback(
    (fieldName, value) => {
      setFieldValueSpy(fieldName, value)
      setValuesState((currentValues) => setIn(currentValues, fieldName, value))
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
    <PersonDataPhysical
      {...componentProps}
      values={values}
      errors={errors}
      touched={touched}
      setFieldValue={setFieldValue}
      setFieldTouched={setFieldTouched}
      setValues={setValues}
    />
  )
}

const renderComponent = (overrides = {}) => {
  const props = buildRenderProps(overrides)
  const result = render(<ControlledPersonDataPhysical {...props} />)

  return {
    ...result,
    props,
  }
}

const getInput = (fieldName) =>
  document.querySelector(`[data-cy="${fieldName}-input"]`)

const getSelect = (fieldName) => document.getElementById(fieldName)

const openSelect = async (user, fieldName) => {
  await user.click(getSelect(fieldName))

  return within(screen.getByRole("presentation")).getByRole("listbox")
}

describe("PersonDataPhysical", () => {
  beforeEach(() => {
    translationState.language = "ca"
    vi.clearAllMocks()

    apiMocks.getProvincies.mockImplementation(() => new Promise(() => {}))
    apiMocks.getMunicipis.mockImplementation(() => new Promise(() => {}))
    apiMocks.getMunicipisByPostalCode.mockResolvedValue([])
    googleApiMocks.searchPlace.mockResolvedValue([])
    googleApiMocks.getPlaceDetails.mockResolvedValue({ addressComponents: [] })
    phoneMocks.isValidPhoneNumber.mockReturnValue(false)
  })

  test("shows the title by default and hides it when title is false", () => {
    const { rerender, props } = renderComponent()

    expect(screen.getByText("MEMBER_PAGE_PERSONAL_DATA")).toBeInTheDocument()

    rerender(<ControlledPersonDataPhysical {...props} title={false} />)

    expect(
      screen.queryByText("MEMBER_PAGE_PERSONAL_DATA"),
    ).not.toBeInTheDocument()
  })

  test("seeds the language from i18n only once", async () => {
    const { rerender, props } = renderComponent()

    await waitFor(() => {
      expect(props.setFieldValueSpy).toHaveBeenCalledWith(
        "new_member.language",
        "ca_ES",
      )
    })

    expect(getSelect("new_member.language")).toHaveTextContent("Català")

    translationState.language = "es"
    rerender(<ControlledPersonDataPhysical {...props} />)

    await waitFor(() => {
      const languageCalls = props.setFieldValueSpy.mock.calls.filter(
        ([fieldName]) => fieldName === "new_member.language",
      )

      expect(languageCalls).toEqual([["new_member.language", "ca_ES"]])
    })

    expect(getSelect("new_member.language")).toHaveTextContent("Català")
  })

  test("wires text input change and blur through the parent paths", async () => {
    const { props } = renderComponent({
      initialErrors: {
        new_member: {
          name: "NAME_REQUIRED",
        },
        address: {},
      },
    })

    const nameInput = getInput("new_member.name")

    fireEvent.change(nameInput, {
      target: { name: "new_member.name", value: "Ada" },
    })
    fireEvent.blur(nameInput, {
      target: { name: "new_member.name" },
    })

    await waitFor(() => {
      expect(props.setFieldValueSpy).toHaveBeenCalledWith(
        "new_member.name",
        "Ada",
      )
      expect(props.setFieldTouchedSpy).toHaveBeenCalledWith(
        "new_member.name",
        true,
      )
    })

    expect(nameInput).toHaveValue("Ada")
    expect(screen.getByText("NAME_REQUIRED")).toBeInTheDocument()
  })

  test("prevents pasting into the email confirmation field", () => {
    renderComponent()

    const emailConfirmationInput = getInput("new_member.email2")
    const pasteEvent = new Event("paste", {
      bubbles: true,
      cancelable: true,
    })

    pasteEvent.preventDefault = vi.fn()

    fireEvent(emailConfirmationInput, pasteEvent)

    expect(pasteEvent.preventDefault).toHaveBeenCalled()
  })

  test("wires gender, referral source, and language selects to the parent field paths", async () => {
    const user = userEvent.setup()
    const { props } = renderComponent()

    const genderListbox = await openSelect(user, "new_member.gender")
    await user.click(
      within(genderListbox).getByRole("option", { name: "GENDER_MAN" }),
    )

    const referralListbox = await openSelect(user, "new_member.referral_source")
    await user.click(
      within(referralListbox).getByRole("option", {
        name: "HOW_MEET_US_OPTION_5",
      }),
    )

    const languageListbox = await openSelect(user, "new_member.language")
    await user.click(
      within(languageListbox).getByRole("option", { name: "Español" }),
    )

    await waitFor(() => {
      expect(props.setFieldValueSpy).toHaveBeenCalledWith(
        "new_member.gender",
        "male",
      )
      expect(props.setFieldValueSpy).toHaveBeenCalledWith(
        "new_member.referral_source",
        "O5_RECOMANAT",
      )
      expect(props.setFieldValueSpy).toHaveBeenCalledWith(
        "new_member.language",
        "es_ES",
      )
    })

    expect(getSelect("new_member.gender")).toHaveTextContent("GENDER_MAN")
    expect(getSelect("new_member.referral_source")).toHaveTextContent(
      "HOW_MEET_US_OPTION_5",
    )
    expect(getSelect("new_member.language")).toHaveTextContent("Español")
  })
})
