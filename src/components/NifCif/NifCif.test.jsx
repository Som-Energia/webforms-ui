import { useEffect, useState } from "react"

import { ThemeProvider } from "@mui/material/styles"

import {
  queryByAttribute,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { vi } from "vitest"

import { LoadingContextProvider } from "../../context/LoadingContext"
import { checkVat } from "../../services/api"
import WebFormsTheme from "../../themes/webforms"
import NifCif from "./NifCif"

vi.mock("react-i18next", async () => import("../../tests/__mocks__/i18n.js"))

// Mock the checkVat function
vi.mock("../../services/api", () => ({
  checkVat: vi.fn(),
}))

const webFormsTheme = WebFormsTheme()

const renderComponent = async (nifCifNumber, useEffectHandler) => {
  return render(
    <NifCifWrapperComponent
      nifCifNumber={nifCifNumber}
      onChange={useEffectHandler}
    />,
  )
}

const NifCifWrapperComponent = ({ nifCifNumber, onChange = () => {} }) => {
  const [values, setValues] = useState({ owner: { nif: nifCifNumber } })
  const [errors, setError] = useState({ nifcif: null })
  const setFieldError = (fieldName, error) => {
    // This input has namespaced field names like 'owner.nif'
    // but InputField shows errors as { owner: { nif: 'error message' } }
    const [namespace, key] = fieldName.split(".")
    const finalError = { [namespace]: { [key]: error } }
    setError(finalError)
  }

  useEffect(() => {
    onChange(values)
  }, [values])

  return (
    <ThemeProvider theme={webFormsTheme}>
      <LoadingContextProvider>
        <NifCif
          textFieldNameKey="GURB_PARTICIPATION_NIF_TITLE"
          entity="owner"
          setValues={setValues}
          helperText={false}
          values={values}
          errors={errors}
          touched={{ owner: { nif: true } }}
          setFieldError={setFieldError}
        />
      </LoadingContextProvider>
    </ThemeProvider>
  )
}

describe("NifCif component ", () => {
  describe("Nif tests", () => {
    test("Nif renders without crashing and correct value", async () => {
      vi.mocked(checkVat).mockResolvedValue({})

      const nif = "12345678Z"
      const dom = await renderComponent(nif)

      await waitFor(() => {
        const getByDataCy = queryByAttribute.bind(null, "data-cy")
        const input = getByDataCy(dom.container, "owner.nif-input")
        expect(input).toBeInTheDocument()
        expect(input).toHaveValue(nif)
      })
    })

    test("Nif renders with is not valid error", async () => {
      vi.mocked(checkVat).mockResolvedValue({
        data: { valid: false },
      })

      const invalidNif = "12345678Z"
      await renderComponent(invalidNif)
      const errorMessage = await screen.findByText("FILL_NIF")
      expect(errorMessage).toBeInTheDocument()
    })

    test("Nif renders with exists error", async () => {
      vi.mocked(checkVat).mockResolvedValue({
        data: { is_member: true },
      })

      const invalidNif = "12345678Z"
      await renderComponent(invalidNif)
      const errorMessage = await screen.findByText("DNI_EXIST")
      expect(errorMessage).toBeInTheDocument()
    })

    test('Nif renders with person_type equals "physic-person"', async () => {
      vi.mocked(checkVat).mockResolvedValue({})
      const setValuesSpy = vi.fn()

      const validNif = "12345678Z"
      await renderComponent(validNif, setValuesSpy)
      await waitFor(() => {
        expect(setValuesSpy).toHaveBeenLastCalledWith(
          expect.objectContaining({
            owner: {
              nif: "12345678Z",
              nif_valid: true,
              person_type: "physic-person",
            },
          }),
        )
      })
    })

    test("Nif renders and checkVat resolves a nif invalid response value", async () => {
      vi.mocked(checkVat).mockResolvedValue({})
      const setValuesSpy = vi.fn()

      const validNif = "12345678XX"
      await renderComponent(validNif, setValuesSpy)
      await waitFor(() => {
        expect(setValuesSpy).toHaveBeenLastCalledWith(
          expect.objectContaining({
            owner: {
              nif: "12345678XX",
              nif_valid: false, // Component not throw error and set nif_valid to false
              person_type: "physic-person",
            },
          }),
        )
      })
    })
  })
  describe("Cif tests", () => {
    test('Cif renders and set person_type equals "legal-person"', async () => {
      vi.mocked(checkVat).mockResolvedValue({})
      const setValuesSpy = vi.fn()

      const validNif = "P7784683J"
      await renderComponent(validNif, setValuesSpy)
      await waitFor(() => {
        expect(setValuesSpy).toHaveBeenLastCalledWith(
          expect.objectContaining({
            owner: {
              nif: "P7784683J",
              nif_valid: true,
              person_type: "legal-person",
            },
          }),
        )
      })
    })
  })
})
