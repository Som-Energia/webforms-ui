import React from "react"

import {
  fireEvent,
  queryByAttribute,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { vi } from "vitest"

import GenerationNoMemberIdFields from "./GenerationNoMemberIdFields"

import {
  checkIsPostalCodeFromGenerationEnabledZone,
  checkVat,
} from "../../../services/api"
import { checkPhisicalVAT } from "../../../services/utils"

vi.mock("react-i18next", async () => import("../../../tests/__mocks__/i18n.js"))

vi.mock("../../../services/api", () => ({
  checkIsPostalCodeFromGenerationEnabledZone: vi.fn(),
  checkVat: vi.fn(),
}))

vi.mock("../../../services/utils", () => ({
  checkPhisicalVAT: vi.fn(),
}))

describe("Generation Form Review", () => {
  const mockValuesPostalCode = {
    member: {
      is_member: true,
      has_generation_enabled_zone: false,
      postal_code: "25225",
    },
  }

  const mockValuesEnabeldAndCheckedZone = {
    member: {
      exists: undefined,
      has_generation_enabled_zone: true,
      is_member: false,
      isphisical: false,
      postal_code_checked: true,
      vat: "",
    },
  }

  const VAT = "40323835M"
  const POSTAL_CODE = "25290"

  const mockExpect = {
    member: {
      ...mockValuesEnabeldAndCheckedZone.member,
      vat: VAT,
      vatvalid: false,
    },
  }
  const getById = queryByAttribute.bind(null, "id")
  const mockSetFieldValue = vi.fn()
  const mocksetFieldTouched = vi.fn()
  const mockSetValues = vi.fn()
  const mockSetErrors = vi.fn()

  const renderComponent = (props = {}) =>
    render(
      <GenerationNoMemberIdFields
        values={mockValuesPostalCode}
        setFieldValue={mockSetFieldValue}
        setFieldTouched={mocksetFieldTouched}
        setValues={mockSetValues}
        setErrors={mockSetErrors}
        {...props}
      />,
    )

  beforeEach(() => {
    vi.clearAllMocks()
    checkIsPostalCodeFromGenerationEnabledZone.mockResolvedValue({ data: true })
    checkVat.mockResolvedValue({
      data: { valid: false, is_member: undefined, exists: undefined },
    })
    checkPhisicalVAT.mockReturnValue(false)
  })

  test("Should call setFieldValue when change postal code", async () => {
    const dom = renderComponent({ isTesting: true })

    const postalCodeTextField = getById(dom.container, "input_postalcode")
    React.act(() => {
      fireEvent.change(postalCodeTextField, { target: { value: POSTAL_CODE } })
    })

    expect(mockSetFieldValue).toHaveBeenCalledWith(
      "member.postal_code",
      POSTAL_CODE,
    )
  })

  test("Should call setFieldValue when change vat", async () => {
    const dom = renderComponent({
      values: mockValuesEnabeldAndCheckedZone,
      isTesting: true,
    })

    const vatTextField = getById(dom.container, "vat")
    await React.act(async () => {
      fireEvent.change(vatTextField, { target: { value: VAT } })
    })

    await waitFor(() => {
      expect(checkVat).toHaveBeenCalledWith(VAT)
    })

    expect(mockSetValues).toHaveBeenLastCalledWith(mockExpect)
  })

  test("Should reset checked postal code before applying the new value", () => {
    const dom = renderComponent({
      isTesting: true,
      values: {
        member: {
          ...mockValuesPostalCode.member,
          postal_code_checked: true,
        },
      },
    })

    const postalCodeTextField = getById(dom.container, "input_postalcode")
    React.act(() => {
      fireEvent.change(postalCodeTextField, { target: { value: POSTAL_CODE } })
    })

    expect(mockSetFieldValue).toHaveBeenNthCalledWith(
      1,
      "member.postal_code_checked",
      false,
    )
    expect(mockSetFieldValue).toHaveBeenNthCalledWith(
      2,
      "member.postal_code",
      POSTAL_CODE,
    )
  })

  test("Should hide the VAT section until the postal code is validated", () => {
    renderComponent({ isTesting: true })

    expect(
      screen.queryByText("GENERATION_FORM_CONTRIBUTION_MEMBER_VAT"),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByText("GENERATION_CONTRIBUTION_MEMBER_WARNING"),
    ).not.toBeInTheDocument()
  })

  test("Should validate postal code and show VAT section when zone is enabled", async () => {
    renderComponent({
      values: {
        member: {
          ...mockValuesPostalCode.member,
          postal_code: POSTAL_CODE,
          postal_code_checked: false,
        },
      },
    })

    await waitFor(() => {
      expect(checkIsPostalCodeFromGenerationEnabledZone).toHaveBeenCalledWith({
        postalCode: POSTAL_CODE,
      })
    })

    expect(mockSetValues).toHaveBeenCalledWith({
      member: {
        ...mockValuesPostalCode.member,
        postal_code: POSTAL_CODE,
        generation_zone_checked: true,
        has_generation_enabled_zone: true,
        postal_code_checked: true,
      },
    })
  })

  test("Should surface postal code validation errors when the zone request fails", async () => {
    checkIsPostalCodeFromGenerationEnabledZone.mockRejectedValue(new Error())

    renderComponent({
      values: {
        member: {
          ...mockValuesPostalCode.member,
          postal_code: POSTAL_CODE,
        },
      },
    })

    await waitFor(() => {
      expect(mockSetErrors).toHaveBeenCalledWith({
        member: {
          postal_code: "GENERATION_FORM_DATA_COULD_NOT_BE_VALIDATED",
        },
      })
    })
  })

  test("Should render field errors when postal code and VAT are touched", () => {
    renderComponent({
      isTesting: true,
      values: mockValuesEnabeldAndCheckedZone,
      errors: {
        member: {
          postal_code: "POSTAL_CODE_ERROR",
          vat: "VAT_ERROR",
        },
      },
      touched: {
        member: {
          postal_code: true,
          vat: true,
        },
      },
    })

    expect(screen.getByText("POSTAL_CODE_ERROR")).toBeInTheDocument()
    expect(screen.getByText("VAT_ERROR")).toBeInTheDocument()
  })
})
