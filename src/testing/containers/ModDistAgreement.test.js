import { fireEvent, render, screen } from '@testing-library/react'
import ModDistAgreement from '../../containers/ModDistAgreement'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import d1 from '../mock_files/d1.json'

describe('ModDistAgreement Translations CA', () => {
  jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom')
    const returnCa = jest.fn(() => ({ language: 'ca' }))
    const returnLocation = jest.fn(() => ({ state: null }))

    return {
      __esModule: true,
      ...originalModule,
      useParams: returnCa,
      useLocation: returnLocation
    }
  })

  jest.mock('react-i18next', () => ({
    useTranslation: () => {
      return {
        t: (str) => str,
        i18n: {
          changeLanguage: jest.fn()
        }
      }
    }
  }))

  test('Es renderitza correctament en català', () => {
    render(
      <Router>
        <Routes>
          <Route
            path="/ca/contrata-la-luz/"
            element={<ModDistAgreement d1={d1} />}
          />
        </Routes>
      </Router>
    )
  
    const contentText = screen.getByText("L'empresa de distribució");
    expect(contentText).toBeInTheDocument();

    /*screen.queryByText(
      "L'empresa de distribució"
    )
    screen.debug()*/
    /* screen.getByText(
      'Per poder realitzar aquesta modificació serà necessari que ens facilitis la següent documentació:'
    ) */
  })
})
