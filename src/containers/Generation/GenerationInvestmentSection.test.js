import React from 'react'
import GenerationInvestmentSection from './GenerationInvestmentSection'
import { render,screen } from '@testing-library/react'


jest.mock('react-i18next', () => ({
    // this mock makes sure any components using the translate hook can use it without a warning being shown
    useTranslation: () => {
      return {
        t: (str) => str,
        i18n: {
          changeLanguage: () => new Promise(() => {}),
        },
      };
    }
  }));


describe('Generation Investment Section', () => {
  
    const mockRows = JSON.parse('[{"name": "GKWH05844","nominal_amount": "2000.0","nshares": 20,"purchase_date": "2020-01-01","first_effective_date": "2021-01-01","amortized_amount": "160.0","last_effective_date": "2045-01-01"}]')

    test('The component render properly', () => {
      render(<GenerationInvestmentSection data={mockRows}/>)
      const textElement = screen.getByText(mockRows[0].name)
      expect(textElement).toBeInTheDocument()
    })

  })

