import { beforeAll } from 'vitest'
import { render, queryByAttribute, fireEvent, screen } from '@testing-library/react'
import TariffNameContext, { TariffNameContextProvider } from '../../context/TariffNameContext'
import TariffSelector from './TariffSelector'
import { initI18n } from '../../tests/i18n.mock'
import { Tariffs } from '../../data/tariff'

describe('TariffSelector component', () => {

  beforeAll(async () => {
    await initI18n()
  })

  // Dummy component to debug context changes!
  const ContextDebugger = () => {
    return (
      <TariffNameContext.Consumer>
        {(value) => <div data-testid="current-tariff">{value.tariffName}</div>}
      </TariffNameContext.Consumer>
    )
  }

  const renderComponent = () => {
    return render(
      <TariffNameContextProvider>
        <ContextDebugger />
        <TariffSelector />
      </TariffNameContextProvider>
    )
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
      test(`Check context when click ${tariffName}`, async () => {
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
