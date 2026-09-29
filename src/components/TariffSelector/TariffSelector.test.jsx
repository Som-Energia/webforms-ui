import { useState } from "react"

import {
  fireEvent,
  queryByAttribute,
  render,
  screen,
} from "@testing-library/react"
import { vi } from "vitest"

import { DefaultTariff, Tariffs } from "../../data/tariff"
import TariffSelector from "./TariffSelector"

vi.mock("react-i18next", async () => import("../../tests/__mocks__/i18n.js"))

describe("TariffSelector component", () => {
  const TariffSelectorWrapper = () => {
    const [tariff, setTariff] = useState(DefaultTariff)

    const onChangeTariff = (tariff) => {
      setTariff(tariff)
    }

    return (
      <div>
        <div data-testid="current-tariff">{tariff}</div>
        <TariffSelector tariff={tariff} onSelectTariff={onChangeTariff} />
      </div>
    )
  }

  const renderComponent = () => {
    return render(<TariffSelectorWrapper />)
  }

  test("TariffSelector renders correctly with available tariffs", () => {
    const dom = renderComponent()
    const getByDataCy = queryByAttribute.bind(null, "data-cy")
    Object.values(Tariffs).forEach((tariffName) => {
      const button = getByDataCy(dom.container, `button-${tariffName}`)
      expect(button).toBeInTheDocument()
    })
  })

  test("uses the default tariff when no tariff prop is provided", () => {
    const dom = render(<TariffSelector />)
    const getByDataCy = queryByAttribute.bind(null, "data-cy")

    expect(
      getByDataCy(dom.container, `button-${DefaultTariff}`),
    ).toBeInTheDocument()
  })

  describe("TariffSelector available tariffs", () => {
    Object.values(Tariffs).forEach(async (tariffName) => {
      test(`Check value is ${tariffName} when click ${tariffName}`, async () => {
        const dom = renderComponent()
        const getByDataCy = queryByAttribute.bind(null, "data-cy")
        const button = getByDataCy(dom.container, `button-${tariffName}`)
        fireEvent.click(button)
        const display = screen.getByTestId("current-tariff")
        expect(display.textContent).toBe(tariffName)
      })
    })
  })
})
