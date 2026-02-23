import { useState } from 'react'
import { beforeAll } from 'vitest'
import { render, queryByAttribute, fireEvent, screen } from '@testing-library/react'
import TariffSelector from './TariffSelector'
import { initI18n } from '../../tests/i18n.mock'
import { DefaultTariff, Tariffs } from '../../data/tariff'

describe('TariffSelector component', () => {

  beforeAll(async () => {
    await initI18n()
  })

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

  test('TariffSelector renders correctly with available tariffs', () => {
    const dom = renderComponent()
    const getByDataCy = queryByAttribute.bind(null, 'data-cy')
    Object.values(Tariffs).forEach((tariffName) => {
      const button = getByDataCy(dom.container, `button-${tariffName}`)
      expect(button).toBeInTheDocument()
    })
  })

  describe('TariffSelector available tariffs', () => {
    Object.values(Tariffs).forEach(async (tariffName) => {
      test(`Check value is ${tariffName} when click ${tariffName}`, async () => {
        const dom = renderComponent()
        const getByDataCy = queryByAttribute.bind(null, 'data-cy')
        const button = getByDataCy(dom.container, `button-${tariffName}`)
        fireEvent.click(button)
        const display = screen.getByTestId('current-tariff');
        expect(display.textContent).toBe(tariffName)
      })
    })
  })
})
