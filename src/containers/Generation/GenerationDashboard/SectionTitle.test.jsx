import React from 'react'
import SectionTitle from './SectionTitle'
import { render, screen } from '@testing-library/react'

describe('Section Title', () => {
  const mockText = 'mockText'

  test('The component render properly the prop text', () => {
    render(<SectionTitle text={mockText} />)
    const textElement = screen.getByText(mockText)
    expect(textElement).toBeInTheDocument()
  })

  test('The component render properly the prop text', () => {
    render(<SectionTitle  />)
    const textElement = screen.queryByText(mockText)
    expect(textElement).toBeNull()
  })
})
