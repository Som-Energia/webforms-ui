import IndexedReviewData from './IndexedReviewData'
import { fireEvent, render, screen, queryByAttribute } from '@testing-library/react'

jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (str) => str
    }
  }
}))

describe('Test that it correctly renders', () => {

  const getById = queryByAttribute.bind(null,'id')

  const mockContractValues = {
    isphisical: true,
    name: '0191497',
    cups: 'ES0021000001234567EQ0F',
    address: 'Auguste Renoir , 13 03730 (Jávea/Xàbia)',
    owner_vat: 'ES00123456D',
    owner_name: 'Jose Montoro Pedrolo',
    owner_mobile_phone: '600000000',
    owner_phone: '972000000',
    owner_email: 'itcrowd@somenergia.coop',
    language: 'es',
    iban: 'ES79 2100 9015 2622 0028 ****',
    donation: true,
    tariff: '2.0TD_SOM',
    powers:
    '[{"value": "P1", "power": "\\"8.050\\""}, {"value": "P2", "power": "\\"8.050\\""}]'
  }

  let mockContractValuesNoPhisical = JSON.parse(JSON.stringify(mockContractValues))
  mockContractValuesNoPhisical.isphisical = false

  const mockSetFieldValues = jest.fn()
  const mockInitialValues = {
    terms_accepted: false,
    indexed_terms_accepted: false,
    indexed_legal_terms_accepted: false
  }

  const mockHandleClick = jest.fn()
  const mockHandleIndexadaTermsAccepted = jest.fn()
  const mockHandleIndexadaLegalTermsAccepted = jest.fn()

  test('The component render properly all texts', () => {
    render(
      <IndexedReviewData
        open={false}
        contractValues={mockContractValues}
        setFieldValues={mockSetFieldValues}
        values={mockInitialValues}
      />
    )
    const cupsElement = screen.getByText(mockContractValues.cups)
    const addressElement = screen.getByText(mockContractValues.address)
    const vatElement = screen.getByText(mockContractValues.owner_vat)
    const tariffElement = screen.getByText(mockContractValues.tariff)

    expect(cupsElement).toBeInTheDocument()
    expect(addressElement).toBeInTheDocument()
    expect(vatElement).toBeInTheDocument()
    expect(tariffElement).toBeInTheDocument()
  })

  test('The component render properly all texts when contract is not phisical', () => {
    render(
      <IndexedReviewData
        open={false}
        contractValues={mockContractValuesNoPhisical}
        setFieldValues={mockSetFieldValues}
        values={mockInitialValues}
      />
    )
    //If it is not physical, the contract number is shown
    const nameElement = screen.getByText(mockContractValues.name)
    expect(nameElement).toBeInTheDocument()
    
  })


  test('Should call the handleClick function', () => {
    const dom = render(
      <IndexedReviewData
        open={false}
        contractValues={mockContractValues}
        setFieldValues={mockSetFieldValues}
        values={mockInitialValues}
        handleClick={mockHandleClick}
      />
    )
    const acceptTermsCheck = getById(dom.container,'change-tarif-terms-check')
    fireEvent.click(acceptTermsCheck)
    expect(mockHandleClick).toBeCalledTimes(1)
  
  })

  test('Should call the handleIndexadaTermsAccepted function', () => {
    const dom = render(
      <IndexedReviewData
        open={false}
        contractValues={mockContractValues}
        setFieldValues={mockSetFieldValues}
        values={mockInitialValues}
        handleIndexadaTermsAccepted={mockHandleIndexadaTermsAccepted}
      />
    )
    const indexadaTermsCheck = getById(dom.container,'change-tariff-indexada-terms-check')
    fireEvent.click(indexadaTermsCheck)
    expect(mockHandleIndexadaTermsAccepted).toBeCalledTimes(1)
  })
  test('Should call the handleIndexadaLegalTermsAccepted function', () => {
    //TODO: click the check to accept the legal terms
    const dom = render(
      <IndexedReviewData
        open={false}
        contractValues={mockContractValues}
        setFieldValues={mockSetFieldValues}
        values={mockInitialValues}
        handleIndexadaLegalTermsAccepted={mockHandleIndexadaLegalTermsAccepted}
      />
    )
    const legalTermsCheck = getById(dom.container,'change-tariff-indexada-legal-terms-check')
    fireEvent.click(legalTermsCheck)
    expect(mockHandleIndexadaLegalTermsAccepted).toBeCalledTimes(1)
  })
})
