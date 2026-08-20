import React from "react"
import { MemoryRouter } from "react-router-dom"

import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { vi } from "vitest"

import GenerationMemberIdFields from "./GenerationMemberIdFields"

import {
  checkIsFromGenerationEnabledZone,
  checkMember,
} from "../../../services/api"
import { checkVatFormat } from "../../../services/utils"

vi.mock("react-i18next", async () =>
  import("../../../tests/__mocks__/i18n.js"),
)

vi.mock("../../../services/api", () => ({
  checkIsFromGenerationEnabledZone: vi.fn(),
  checkMember: vi.fn(),
}))

vi.mock("../../../services/utils", () => ({
  checkVatFormat: vi.fn(),
}))

const buildValues = (overrides = {}) => ({
  member: {
    partner_number: "",
    vat: "",
    checked: false,
    generation_zone_checked: false,
    has_generation_enabled_zone: true,
    ...overrides,
  },
})

const buildErrors = (overrides = {}) => ({
  member: {
    partner_number: false,
    vat: false,
    ...overrides,
  },
})

const buildTouched = (overrides = {}) => ({
  member: {
    partner_number: false,
    vat: false,
    ...overrides,
  },
})

const getMemberNumberInput = () =>
  screen.getByRole("textbox", { name: /MEMBER_NUMBER/i })

const getVatInput = () => screen.getByRole("textbox", { name: /NIF_LABEL/i })

const renderComponent = ({
  initialValues = buildValues(),
  route = "/",
  errors = buildErrors(),
  touched = buildTouched(),
  isTesting = false,
} = {}) => {
  const setFieldValueSpy = vi.fn()
  const setErrorsSpy = vi.fn()
  const setValuesSpy = vi.fn()
  const handleBlurSpy = vi.fn()

  function Harness() {
    const [values, setValues] = React.useState(initialValues)
    const [currentErrors, setCurrentErrors] = React.useState(errors)

    const setFieldValue = React.useCallback((field, value) => {
      setFieldValueSpy(field, value)

      const memberField = field.replace("member.", "")

      setValues((currentValues) => ({
        ...currentValues,
        member: {
          ...currentValues.member,
          [memberField]: value,
        },
      }))
    }, [])

    const setErrors = React.useCallback((nextErrors) => {
      setErrorsSpy(nextErrors)
      setCurrentErrors(nextErrors)
    }, [])

    const setHarnessValues = React.useCallback((nextValues) => {
      setValuesSpy(nextValues)
      setValues((currentValues) => {
        // Guard against re-applying identical values in the harness because the
        // production hash-prefill effect depends on `values` and also calls
        // `setValues`, which can otherwise loop forever during coverage runs.
        if (JSON.stringify(currentValues) === JSON.stringify(nextValues)) {
          return currentValues
        }

        return nextValues
      })
    }, [])

    return (
      <MemoryRouter
        initialEntries={[route]}
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}>
        <GenerationMemberIdFields
          values={values}
          handleBlur={handleBlurSpy}
          errors={currentErrors}
          setErrors={setErrors}
          touched={touched}
          setFieldValue={setFieldValue}
          setValues={setHarnessValues}
          isTesting={isTesting}
        />
      </MemoryRouter>
    )
  }

  return {
    user: userEvent.setup(),
    setErrorsSpy,
    setFieldValueSpy,
    setValuesSpy,
    handleBlurSpy,
    ...render(<Harness />),
  }
}

describe("GenerationMemberIdFields", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    checkVatFormat.mockReturnValue({ isValid: true })
    checkMember.mockResolvedValue({ data: true })
    checkIsFromGenerationEnabledZone.mockResolvedValue({ data: true })
  })

  test("sanitizes member number and VAT input values", async () => {
    const { user, setFieldValueSpy } = renderComponent({ isTesting: true })

    await user.type(getMemberNumberInput(), "12a3")
    await user.type(getVatInput(), "21329935f---")

    expect(setFieldValueSpy).toHaveBeenCalledWith(
      "member.partner_number",
      "123",
    )
    expect(setFieldValueSpy).toHaveBeenCalledWith("member.vat", "21329935F")
  })

  test("keeps member unchecked while testing mode bypasses async validation", () => {
    const { setFieldValueSpy } = renderComponent({
      isTesting: true,
      initialValues: buildValues({
        partner_number: "123",
        vat: "40323835M",
      }),
    })

    expect(setFieldValueSpy).toHaveBeenCalledWith("member.checked", false)
    expect(checkMember).not.toHaveBeenCalled()
    expect(checkIsFromGenerationEnabledZone).not.toHaveBeenCalled()
  })

  test("validates an existing member and marks the generation zone as checked", async () => {
    const { setErrorsSpy, setFieldValueSpy, setValuesSpy } = renderComponent({
      initialValues: buildValues({
        partner_number: "123",
        vat: "40323835M",
      }),
    })

    await waitFor(() => {
      expect(checkMember).toHaveBeenCalledWith("123", "40323835M")
    })

    expect(checkIsFromGenerationEnabledZone).toHaveBeenCalledWith({
      memberNumber: "123",
      memberVat: "40323835M",
    })

    expect(setErrorsSpy).toHaveBeenCalledWith({
      member: { has_generation_enabled_zone: false },
    })
    expect(setFieldValueSpy).not.toHaveBeenCalledWith("member.checked", false)

    await waitFor(() => {
      expect(screen.getByText("MEMBER_FOUND")).toBeInTheDocument()
    })

    expect(setValuesSpy).toHaveBeenLastCalledWith({
      member: {
        partner_number: "123",
        vat: "40323835M",
        checked: true,
        generation_zone_checked: true,
        has_generation_enabled_zone: true,
      },
    })
  })

  test("shows the not-found helper when the member lookup returns false", async () => {
    checkMember.mockResolvedValue({ data: false })

    const { setFieldValueSpy } = renderComponent({
      initialValues: buildValues({
        partner_number: "123",
        vat: "40323835M",
      }),
    })

    await waitFor(() => {
      expect(screen.getByText("MEMBER_NOT_FOUND")).toBeInTheDocument()
    })

    expect(setFieldValueSpy).toHaveBeenCalledWith("member.checked", false)
  })

  test("shows the not-found helper when VAT format is invalid", async () => {
    checkVatFormat.mockReturnValue({ isValid: false })

    renderComponent({
      initialValues: buildValues({
        partner_number: "123",
        vat: "40323835M",
      }),
    })

    await waitFor(() => {
      expect(screen.getByText("MEMBER_NOT_FOUND")).toBeInTheDocument()
    })
  })

  test("surfaces a generation zone validation error when the zone request fails", async () => {
    checkIsFromGenerationEnabledZone.mockRejectedValue(new Error("zone"))

    const { setErrorsSpy } = renderComponent({
      initialValues: buildValues({
        partner_number: "123",
        vat: "40323835M",
      }),
    })

    await waitFor(() => {
      expect(setErrorsSpy).toHaveBeenCalledWith({
        member: {
          has_generation_enabled_zone:
            "GENERATION_FORM_DATA_COULD_NOT_BE_VALIDATED",
        },
      })
    })
  })

  test("prefills member data from the hash query and disables both inputs", async () => {
    const { setValuesSpy } = renderComponent({
      route: "/?h=MTIzNDU7NDAzMjM4MzVN",
      isTesting: true,
    })

    await waitFor(() => {
      expect(getMemberNumberInput()).toHaveValue("12345")
      expect(getVatInput()).toHaveValue("40323835M")
    })

    expect(getMemberNumberInput()).toBeDisabled()
    expect(getVatInput()).toBeDisabled()
    expect(setValuesSpy).toHaveBeenCalled()
  })

  test("prioritizes touched validation messages over the default helpers", () => {
    renderComponent({
      isTesting: true,
      errors: buildErrors({
        partner_number: "NUMBER_ERROR",
        vat: "VAT_ERROR",
      }),
      touched: buildTouched({
        partner_number: true,
        vat: true,
      }),
    })

    expect(screen.getByText("NUMBER_ERROR")).toBeInTheDocument()
    expect(screen.getByText("VAT_ERROR")).toBeInTheDocument()
  })
})
