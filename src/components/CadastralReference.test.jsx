import { useCallback, useState } from "react"

import { ThemeProvider } from "@mui/material/styles"

import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { beforeEach, vi } from "vitest"

import LoadingContext from "../context/LoadingContext"
import { checkCadastralReference } from "../services/api"
import WebFormsTheme from "../themes/webforms"
import CadastralReference from "./CadastralReference"

vi.mock("react-i18next", async () => import("../tests/__mocks__/i18n.js"))

vi.mock("../services/api", () => ({
  checkCadastralReference: vi.fn(),
}))

const webFormsTheme = WebFormsTheme()

const FULL_CADASTRAL_REFERENCE = "8277124 YR8968U 5098 BP"

const createDeferred = () => {
  let resolve
  let reject

  const promise = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })

  return { promise, resolve, reject }
}

const renderComponent = ({
  initialValues = {
    cadastral_reference: "",
    cadastral_reference_valid: false,
  },
  initialTouched = { cadastral_reference: false },
  initialErrors = {},
  setFieldValueSpy = vi.fn(),
  setFieldErrorSpy = vi.fn(),
  setFieldTouchedSpy = vi.fn(),
  setLoadingSpy = vi.fn(),
} = {}) => {
  const Wrapper = () => {
    const [values, setValues] = useState(initialValues)
    const [errors, setErrors] = useState(initialErrors)
    const [touched, setTouched] = useState(initialTouched)
    const [loading, setLoadingState] = useState(false)

    const setFieldValue = useCallback(
      (fieldName, value) => {
        setFieldValueSpy(fieldName, value)
        setValues((currentValues) => ({
          ...currentValues,
          [fieldName]: value,
        }))
      },
      [setFieldValueSpy],
    )

    const setFieldError = useCallback(
      (fieldName, error) => {
        setFieldErrorSpy(fieldName, error)
        setErrors((currentErrors) => ({
          ...currentErrors,
          [fieldName]: error,
        }))
      },
      [setFieldErrorSpy],
    )

    const setFieldTouched = useCallback(
      (fieldName, isTouched) => {
        setFieldTouchedSpy(fieldName, isTouched)
        setTouched((currentTouched) => ({
          ...currentTouched,
          [fieldName]: isTouched,
        }))
      },
      [setFieldTouchedSpy],
    )

    const setLoading = useCallback(
      (nextValue) => {
        setLoadingSpy(nextValue)
        setLoadingState(nextValue)
      },
      [setLoadingSpy],
    )

    return (
      <ThemeProvider theme={webFormsTheme}>
        <LoadingContext.Provider value={{ loading, setLoading }}>
          <CadastralReference
            values={values}
            errors={errors}
            touched={touched}
            setFieldValue={setFieldValue}
            setFieldError={setFieldError}
            setFieldTouched={setFieldTouched}
          />
        </LoadingContext.Provider>
      </ThemeProvider>
    )
  }

  return render(<Wrapper />)
}

describe("CadastralReference component", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(checkCadastralReference).mockResolvedValue({ state: true })
  })

  test("renders translated label, helper text and help link", () => {
    renderComponent()

    expect(screen.getByText("CADASTRAL_REFERENCE")).toBeInTheDocument()
    expect(screen.getByText("CADASTRAL_REFERENCE_HELPER")).toBeInTheDocument()
    expect(
      screen.getByRole("link", { name: "CADASTRAL_REFERENCE_LINK" }),
    ).toHaveAttribute("href", "HELP_CADASTRAL_REFERENCE_URL")
  })

  test("sanitizes and formats the cadastral reference before storing it", () => {
    const setFieldValueSpy = vi.fn()

    renderComponent({
      setFieldValueSpy,
    })

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "8277124yr-8968u 509??" },
    })

    expect(setFieldValueSpy).toHaveBeenLastCalledWith(
      "cadastral_reference",
      "8277124 YR8968U 509",
    )
  })

  test("marks the field as touched on blur", () => {
    const setFieldTouchedSpy = vi.fn()

    renderComponent({
      setFieldTouchedSpy,
    })

    fireEvent.blur(screen.getByRole("textbox"))

    expect(setFieldTouchedSpy).toHaveBeenCalledWith("cadastral_reference", true)
  })

  test("marks an empty cadastral reference as valid", async () => {
    const setFieldValueSpy = vi.fn()

    renderComponent({
      setFieldValueSpy,
    })

    await waitFor(() => {
      expect(setFieldValueSpy).toHaveBeenCalledWith(
        "cadastral_reference_valid",
        true,
      )
    })

    expect(checkCadastralReference).not.toHaveBeenCalled()
  })

  test("validates long values, toggles loading and marks the field as valid on success", async () => {
    const deferred = createDeferred()
    const setFieldValueSpy = vi.fn()
    const setFieldErrorSpy = vi.fn()
    const setLoadingSpy = vi.fn()

    vi.mocked(checkCadastralReference).mockReturnValue(deferred.promise)

    renderComponent({
      initialValues: {
        cadastral_reference: FULL_CADASTRAL_REFERENCE,
        cadastral_reference_valid: false,
      },
      setFieldValueSpy,
      setFieldErrorSpy,
      setLoadingSpy,
    })

    await waitFor(() => {
      expect(checkCadastralReference).toHaveBeenCalledWith(
        FULL_CADASTRAL_REFERENCE,
      )
    })

    await waitFor(() => {
      expect(setLoadingSpy).toHaveBeenCalledWith(true)
    })

    expect(screen.getByRole("progressbar")).toBeInTheDocument()

    deferred.resolve({ state: true })

    await waitFor(() => {
      expect(setFieldErrorSpy).toHaveBeenCalledWith(
        "cadastral_reference",
        undefined,
      )
      expect(setFieldValueSpy).toHaveBeenCalledWith(
        "cadastral_reference_valid",
        true,
      )
      expect(setLoadingSpy).toHaveBeenLastCalledWith(false)
    })

    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument()
    })
  })

  test("shows the translated error and marks the field invalid when validation fails", async () => {
    const setFieldValueSpy = vi.fn()
    const setFieldErrorSpy = vi.fn()

    vi.mocked(checkCadastralReference).mockResolvedValue({ state: false })

    renderComponent({
      initialValues: {
        cadastral_reference: FULL_CADASTRAL_REFERENCE,
        cadastral_reference_valid: true,
      },
      initialTouched: { cadastral_reference: true },
      setFieldValueSpy,
      setFieldErrorSpy,
    })

    await waitFor(() => {
      expect(setFieldErrorSpy).toHaveBeenCalledWith(
        "cadastral_reference",
        "INVALID_REF_CADASTRAL_CONTROL_DIGIT",
      )
      expect(setFieldValueSpy).toHaveBeenCalledWith(
        "cadastral_reference_valid",
        false,
      )
    })

    expect(
      await screen.findByText("INVALID_REF_CADASTRAL_CONTROL_DIGIT"),
    ).toBeInTheDocument()
  })

  test("shows the translated error and marks the field invalid when the API rejects", async () => {
    const setFieldValueSpy = vi.fn()
    const setFieldErrorSpy = vi.fn()

    vi.mocked(checkCadastralReference).mockRejectedValue(new Error("network"))

    renderComponent({
      initialValues: {
        cadastral_reference: FULL_CADASTRAL_REFERENCE,
        cadastral_reference_valid: true,
      },
      initialTouched: { cadastral_reference: true },
      setFieldValueSpy,
      setFieldErrorSpy,
    })

    await waitFor(() => {
      expect(setFieldErrorSpy).toHaveBeenCalledWith(
        "cadastral_reference",
        "INVALID_REF_CADASTRAL_CONTROL_DIGIT",
      )
      expect(setFieldValueSpy).toHaveBeenCalledWith(
        "cadastral_reference_valid",
        false,
      )
    })

    expect(
      await screen.findByText("INVALID_REF_CADASTRAL_CONTROL_DIGIT"),
    ).toBeInTheDocument()
  })
})
