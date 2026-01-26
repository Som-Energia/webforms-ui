import React from 'react'
import TextRecommendation from './TextRecommendation'
import { render, screen } from '@testing-library/react'

describe('TextRecommendation component', () => {
  test('TextRecommendation renders without crashing with title and text', async () => {
    render(<TextRecommendation title="TITLE" text="TEXT" />)

    const title = await screen.findByText('TITLE')
    expect(title).toBeInTheDocument()
    const text = await screen.findByText('TEXT')
    expect(text).toBeInTheDocument()
  })

  test('TextRecommendation renders with required character in title', async () => {
    render(<TextRecommendation title="TITLE" required={true} />)

    const title = await screen.findByText('TITLE')
    expect(title).toBeInTheDocument()
    const asterisk = await screen.findByText('*')
    expect(asterisk).toBeInTheDocument()
  })
})
