import React, { useEffect, useRef, useState } from "react"

import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, test, vi } from "vitest"

import IBANField from "./IBANField"

vi.mock("react-i18next", async () => import("../../tests/__mocks__/i18n.js"))

const renderField = (props = {}) => {
  const defaultProps = {
    name: "iban",
    id: "iban",
    label: "IBAN",
    variant: "outlined",
    value: "",
    onChange: vi.fn(),
    onBlur: vi.fn(),
    error: false,
    helperText: "Helper text",
  }

  const finalProps = { ...defaultProps, ...props }

  const view = render(<IBANField {...finalProps} />)

  return {
    ...view,
    props: finalProps,
    rerenderField: (nextProps = {}) => {
      const updatedProps = { ...finalProps, ...nextProps }
      view.rerender(<IBANField {...updatedProps} />)
      return updatedProps
    },
  }
}

const renderControlledField = (props = {}) => {
  const onChange = vi.fn()

  function ControlledField() {
    const [value, setValue] = useState(props.value ?? "")
    const isMountedRef = useRef(false)

    useEffect(() => {
      isMountedRef.current = true
    }, [])

    return (
      <IBANField
        name="iban"
        id="iban"
        label="IBAN"
        variant="outlined"
        value={value}
        onBlur={vi.fn()}
        error={false}
        helperText="Helper text"
        {...props}
        onChange={(nextValue) => {
          onChange(nextValue)
          if (isMountedRef.current) {
            setValue(
              nextValue.IBAN ?? nextValue.value ?? nextValue.valueToCheck ?? "",
            )
          }
        }}
      />
    )
  }

  return {
    ...render(<ControlledField />),
    onChange,
  }
}

describe("IBANField", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test("renders the labeled textbox and leading bank icon", () => {
    renderField()

    expect(screen.getByRole("textbox", { name: "IBAN" })).toBeInTheDocument()
    expect(screen.getByText("Helper text")).toBeInTheDocument()
    expect(screen.getByTestId("AccountBalanceOutlinedIcon")).toBeInTheDocument()
  })

  test("sanitizes, formats and reports a valid IBAN", () => {
    const { onChange } = renderControlledField()

    onChange.mockClear()

    fireEvent.change(screen.getByRole("textbox", { name: "IBAN" }), {
      target: { value: "  es91-2100.0418 4502 0005 1332xx!!" },
    })

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenLastCalledWith({
      value: "ES91 2100 0418 4502 0005 1332",
      valid: true,
      IBAN: "ES91 2100 0418 4502 0005 1332",
      IBANValid: true,
    })

    expect(screen.getByRole("textbox", { name: "IBAN" })).toHaveValue(
      "ES91 2100 0418 4502 0005 1332",
    )
  })

  test("reports an invalid IBAN after local validation fails", () => {
    const { onChange } = renderControlledField()

    onChange.mockClear()

    fireEvent.change(screen.getByRole("textbox", { name: "IBAN" }), {
      target: { value: "es00 2100 0418 4502 0005 1332" },
    })

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenLastCalledWith({
      value: "ES00 2100 0418 4502 0005 1332",
      valid: false,
      IBAN: "ES00 2100 0418 4502 0005 1332",
      IBANValid: false,
    })

    expect(screen.getByRole("textbox", { name: "IBAN" })).toHaveValue(
      "ES00 2100 0418 4502 0005 1332",
    )
  })
})
