import React from 'react'
import GenerationReview from './GenerationReview'
import { render, queryByAttribute, fireEvent, getByText } from '@testing-library/react'


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

describe('Generation Form Review', () => {

    const mockSetFieldValue = jest.fn()
    const getById = queryByAttribute.bind(null, 'id')  

    const mockValuesIsMember = {
      member:{
        is_member: true
      }
    }

    test('Should call setFieldValue when check is clicked', () => {
      const dom = render(<GenerationReview setFieldValue={mockSetFieldValue} />)

      const checkbox = getById(dom.container,"privacy_plicy_check")
      fireEvent.click(checkbox)
      expect(mockSetFieldValue).toBeCalledTimes(1)
    })

   /*  test('Should show review personal data', () => {
      render(<GenerationReview values={mockValuesIsMember} setFieldValue={mockSetFieldValue} />)

      const checkbox = getByText("REVIEW_PERSONAL_DATA")
      expect(checkbox).toBeInTheDocument()
    }) */

  })