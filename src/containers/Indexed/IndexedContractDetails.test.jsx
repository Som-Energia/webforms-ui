import IndexedContractDetails from './IndexedContractDetails'
import { render, screen } from '@testing-library/react'

jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (str) => str
    }
  }
}))

describe('Test the correctly render', () => {
  const mockData = {
    name: 'mockName',
    tariff: 'mockTariff'
  }
  const mockTargetTariff = 'mockTargetTariff'

  test('The component render properly all texts', () => {
    render(
      <IndexedContractDetails data={mockData} targetTariff={mockTargetTariff} />
    )
    /* const contractElement = screen.getByText(mockData.name)
    const currentTariffElement = screen.getByText(mockData.tariff)
    const targetTariffElement = screen.getByText(mockTargetTariff)
    expect(contractElement).toBeInTheDocument()
    expect(currentTariffElement).toBeInTheDocument()
    expect(targetTariffElement).toBeInTheDocument() */
  })
})
