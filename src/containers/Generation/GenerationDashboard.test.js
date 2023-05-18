import React from 'react'
import GenerationDashboard from './GenerationDashboard'
import { render, queryByAttribute } from '@testing-library/react'
import { GenerationContextProvider } from './context/GenerationContext'
import userEvent from '@testing-library/user-event'

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {})
      }
    }
  }
}))

describe('Generation Dashboard', () => {
  const getById = queryByAttribute.bind(null, 'id')
  const mockAssignmentRows = JSON.parse(
    '[{"contract": "ES0031405524755001RN0F - 0010777","contract_address": "Major, 22, 3º 08970 (Sant Joan Despí)","priority": 0,"contract_last_invoiced": "2023-01-08","annual_use_kwh": "7105.0"},{"contract": "ES0031405524910014WM0F - 0013117","contract_address": ". Jacint Verdaguer, 42, 3er 1a 8970 (Sant Joan Despí)","priority": 1,"contract_last_invoiced": "2023-01-04","annual_use_kwh": "115.0"}]'
  )
  const mockInvestmentRows = JSON.parse(
    '[{"name": "GKWH05844","nominal_amount": "2000.0","nshares": 20,"purchase_date": "2020-01-01","first_effective_date": "2021-01-01","amortized_amount": "160.0","last_effective_date": "2045-01-01"}]'
  )

  const mockHandleCancelButtonClick = jest.fn()
  const mockhandleClick = jest.fn()
  const mockValidateChanges = jest.fn()
  test('The component render properly the prop data', () => {
    const dom = render(
      <GenerationContextProvider
        assignmentsJSON={mockAssignmentRows}
        investmentsJSON={mockInvestmentRows}>
        <GenerationDashboard data={mockAssignmentRows} />
      </GenerationContextProvider>
    )

    const assignmentTable = getById(dom.container,'assignment-table')
    expect(assignmentTable).toBeInTheDocument()

    const investmentTable = getById(dom.container,'investment-table')
    expect(investmentTable).toBeInTheDocument()
  })


  test('should call the change priority button', async () => {
    const dom = render(
      <GenerationContextProvider
        assignmentsJSON={mockAssignmentRows}
        investmentsJSON={mockInvestmentRows}>
        <GenerationDashboard handleClick={mockhandleClick} data={mockAssignmentRows} />
      </GenerationContextProvider>
    )
    const changeButton = getById(dom.container,'change-priority-btn')
    await userEvent.click(changeButton)
    expect(mockhandleClick).toBeCalledTimes(1)

  })

  test('should show cancel and validate button when editing', async () => {
    const dom = render(
      <GenerationContextProvider
        assignmentsJSON={mockAssignmentRows}
        investmentsJSON={mockInvestmentRows}>
        <GenerationDashboard editing={true} handleClick={mockhandleClick} data={mockAssignmentRows} />
      </GenerationContextProvider>
    )

    const cancelButton = getById(dom.container,'cancel-action-btn')
    const validateButton = getById(dom.container,'validation-action-btn')
    expect(cancelButton).toBeInTheDocument()
    expect(validateButton).toBeInTheDocument()
  })

  test('should call cancel function when click cancel button', async () => {
    const dom = render(
      <GenerationContextProvider
        assignmentsJSON={mockAssignmentRows}
        investmentsJSON={mockInvestmentRows}>
        <GenerationDashboard editing={true} handleCancelButtonClick={mockHandleCancelButtonClick} data={mockAssignmentRows} />
      </GenerationContextProvider>
    )

    const cancelButton = getById(dom.container,'cancel-action-btn')
    
    await userEvent.click(cancelButton)
    expect(mockHandleCancelButtonClick).toBeCalledTimes(1)
  })

  test('should call validate function when click validate button', async () => {
    const dom = render(
      <GenerationContextProvider
        assignmentsJSON={mockAssignmentRows}
        investmentsJSON={mockInvestmentRows}>
        <GenerationDashboard editing={true} validateChanges={mockValidateChanges} data={mockAssignmentRows} />
      </GenerationContextProvider>
    )

    const validateButton = getById(dom.container,'validation-action-btn')
    
    await userEvent.click(validateButton)
    expect(mockValidateChanges).toBeCalledTimes(1)
  })

})
