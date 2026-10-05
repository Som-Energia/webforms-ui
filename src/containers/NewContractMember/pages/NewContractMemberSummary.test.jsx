import { initReactI18next } from "react-i18next"

import { ThemeProvider } from "@mui/material/styles"

import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import i18n from "i18next"
import { beforeEach, describe, expect, test, vi } from "vitest"

import { SummaryContextProvider } from "../../../context/SummaryContext"
import localeEs from "../../../i18n/locale-es.json"
import { getPrices } from "../../../services/api"
import WebFormsTheme from "../../../themes/webforms"
import { buildInitialValues } from "../newContractMember.values"
import NewContractMemberSummary from "./NewContractMemberSummary"

vi.mock("../../../services/api", () => ({
  getPrices: vi.fn(),
}))

i18n.use(initReactI18next).init({
  resources: { es: { translation: localeEs } },
  fallbackLng: "es",
  lng: "es",
  keySeparator: false,
  interpolation: { escapeValue: false },
})

const webFormsTheme = WebFormsTheme()
const sendEmailLabel =
  "Enviar al correo electrónico del cliente la firma de la documentación del contrato."

const createValues = () => ({
  ...buildInitialValues("es", { tariff_mode: "periods" }),
  has_member: "member-off",
  has_light: "light-on",
  previous_holder: "previous-holder-yes",
  voluntary_donation: false,
  supply_point: {
    cnae: "9820",
  },
  supply_point_address: {
    city: { id: "1", name: "Barcelona" },
  },
  new_member: {
    ...buildInitialValues("es", { tariff_mode: "periods" }).new_member,
    nif: "12345678Z",
    person_type: "physical-person",
    payment_method: "iban",
  },
  contract: {
    tariff_mode: "periods",
    power_type: "power-lower-15kw",
    power: {
      power1: "2",
      power2: "2",
    },
  },
})

const renderSummary = ({ enableSendMailCheckbox = false } = {}) => {
  const setFieldValue = vi.fn()
  const setFieldTouched = vi.fn()

  render(
    <ThemeProvider theme={webFormsTheme}>
      <SummaryContextProvider>
        <NewContractMemberSummary
          values={createValues()}
          setFieldValue={setFieldValue}
          setFieldTouched={setFieldTouched}
          sendTrackEvent={vi.fn()}
          enableSendMailCheckbox={enableSendMailCheckbox}
        />
      </SummaryContextProvider>
    </ThemeProvider>,
  )

  return { setFieldTouched, setFieldValue }
}

const waitForSummary = () =>
  screen.findByRole("button", { name: "Editar datos" })

describe("NewContractMemberSummary", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getPrices).mockResolvedValue({ data: { current: {} } })
  })

  test("does not show the send email checkbox when the feature is disabled", async () => {
    renderSummary()

    await waitForSummary()

    expect(
      screen.queryByRole("checkbox", { name: sendEmailLabel }),
    ).not.toBeInTheDocument()
  })

  test("shows the production send email value as unchecked when the feature is enabled", async () => {
    renderSummary({ enableSendMailCheckbox: true })

    const checkbox = await screen.findByRole("checkbox", {
      name: sendEmailLabel,
    })

    expect(checkbox).not.toBeChecked()
  })

  test("updates and touches send email when the user selects it", async () => {
    const user = userEvent.setup()
    const { setFieldTouched, setFieldValue } = renderSummary({
      enableSendMailCheckbox: true,
    })

    await user.click(
      await screen.findByRole("checkbox", { name: sendEmailLabel }),
    )

    expect(setFieldValue).toHaveBeenCalledWith("send_email", true)
    expect(setFieldTouched).toHaveBeenCalledWith("send_email", true)
  })
})
