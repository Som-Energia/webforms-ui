import IndexedInfo from './IndexedInfo'
import { render, screen } from '@testing-library/react'
import { vi } from 'vitest';

vi.mock('react-i18next', async () => {
  const i18n = await import('../../../tests/__mocks__/i18n')
  return i18n.default
});

describe('Test the correctly render', () => {
  const mockTitle = 'MOCK TITLE'
  const mockDescription = 'MOCK DESCRIPTION'

  test('The component render properly all texts', () => {
    render(<IndexedInfo title={mockTitle} desc={mockDescription} />)
    const titleElement = screen.getByText(mockTitle)
    const descElement = screen.getByText(mockDescription)
    expect(descElement).toBeInTheDocument()
    expect(titleElement).toBeInTheDocument()
  })

  test('The component render properly without title', () => {
    render(<IndexedInfo desc={mockDescription} />)
    const descElement = screen.getByText(mockDescription)
    const titleElement = screen.queryByText(mockTitle)
    expect(descElement).toBeInTheDocument()
    expect(titleElement).toBeNull()
  })

  test('The component render properly without desc', () => {
    render(<IndexedInfo title={mockTitle} />)
    const descElement = screen.queryByText(mockDescription)
    const titleElement = screen.getByText(mockTitle)
    expect(descElement).toBeNull()
    expect(titleElement).toBeInTheDocument()
  })
})
