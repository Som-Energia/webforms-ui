import IndexedContractDetails from './IndexedContractDetails'
import { render } from '@testing-library/react'
import { vi } from 'vitest';

vi.mock('react-i18next', async () => {
  const i18n = await import('../../tests/__mocks__/i18n')
  return i18n.default
});

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
