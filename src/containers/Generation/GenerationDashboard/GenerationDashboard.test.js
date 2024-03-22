import React from 'react'
import GenerationDashboard from './GenerationDashboard'
import { render, queryByAttribute, screen, within } from '@testing-library/react'
import { GenerationContextProvider } from '../context/GenerationContext'
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
  const mockValidationConfirm = {finished:false,completed:false}
  const mockValidationConfirmSuccess = {finished:true,completed:true}
  const mockValidationConfirmFailure = {finished:true,completed:false}
  const mockAssignmentRows = JSON.parse(
    '[{"id":"0001","contract": "ES0031405524755001RN0F - 0010777","contract_address": "Major, 22, 3º 08970 (Sant Joan Despí)","priority": 0,"contract_last_invoiced": "2023-01-08","annual_use_kwh": "7105.0"},{"id":"0002","contract": "ES0031405524910014WM0F - 0013117","contract_address": ". Jacint Verdaguer, 42, 3er 1a 8970 (Sant Joan Despí)","priority": 1,"contract_last_invoiced": "2023-01-04","annual_use_kwh": "115.0"}]'
  )
  const mockInvestmentRows = JSON.parse(
    '[{"name": "GKWH05844","nominal_amount": "2000.0","nshares": 20,"purchase_date": "2020-01-01","first_effective_date": "2021-01-01","amortized_amount": "160.0","last_effective_date": "2045-01-01"}]'
  )

  const mockHandleCancelButtonClick = jest.fn()
  const mockhandleClick = jest.fn()
  const mockValidateChanges = jest.fn()
  const mockSetValidationConfirm = jest.fn()
  
  test('The component render properly the prop data', () => {
    const dom = render(
      <GenerationContextProvider
        assignmentsJSON={mockAssignmentRows}
        investmentsJSON={mockInvestmentRows}>
        <GenerationDashboard validationConfirm={mockValidationConfirm}/>
      </GenerationContextProvider>
    )

    const assignmentTable = getById(dom.container,'assignment-table')
    expect(assignmentTable).toBeInTheDocument()

    const investmentTable = getById(dom.container,'investment-table')
    expect(investmentTable).toBeInTheDocument()
  })


  test('should show cancel and validate button when editing', async () => {
    const dom = render(
      <GenerationContextProvider
        assignmentsJSON={mockAssignmentRows}
        investmentsJSON={mockInvestmentRows}
        propEditingPriority={true}
        >
        <GenerationDashboard handleClick={mockhandleClick} validationConfirm={mockValidationConfirm}/>
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
        investmentsJSON={mockInvestmentRows}
        propEditingPriority={true}
        >
        <GenerationDashboard handleCancelButtonClick={mockHandleCancelButtonClick} validationConfirm={mockValidationConfirm}/>
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
        investmentsJSON={mockInvestmentRows}
        propEditingPriority={true}
        >
        <GenerationDashboard validateChanges={mockValidateChanges} validationConfirm={mockValidationConfirm}/>
      </GenerationContextProvider>
    )    
    const validateButton = getById(dom.container,'validation-action-btn')
    await userEvent.click(validateButton)
    expect(mockValidateChanges).toBeCalledTimes(1)
  })

  test('should show the info text', async () => {

    const mockAssignmentSamePriorityRows = JSON.parse(
      '[{"id":"0001","contract": "ES0031405524755001RN0F - 0010777","contract_address": "Major, 22, 3º 08970 (Sant Joan Despí)","priority": 0,"contract_last_invoiced": "2023-01-08","annual_use_kwh": "7105.0"},{"id":"0002","contract": "ES0031405524910014WM0F - 0013117","contract_address": ". Jacint Verdaguer, 42, 3er 1a 8970 (Sant Joan Despí)","priority": 0,"contract_last_invoiced": "2023-01-04","annual_use_kwh": "115.0"}]'
    )
    const dom = render(
      <GenerationContextProvider
        assignmentsJSON={mockAssignmentSamePriorityRows}
        investmentsJSON={mockInvestmentRows}
        propEditingPriority={true}
        >
        <GenerationDashboard validationConfirm={mockValidationConfirm}/>
      </GenerationContextProvider>
    )    
    const infoText = getById(dom.container,'info-text-section')
    expect(infoText).toBeInTheDocument()
  })

  test('should show the success text', async () => {
    const dom = render(
      <GenerationContextProvider
        assignmentsJSON={mockAssignmentRows}
        investmentsJSON={mockInvestmentRows}
        >
        <GenerationDashboard validationConfirm={mockValidationConfirmSuccess}/>
      </GenerationContextProvider>
    )    
    const alertComponent = getById(dom.container,'alert-success-message')
    expect(alertComponent).toBeInTheDocument()
    expect(screen.getByText("GENERATION_INVESTMENTS_ASSIGNMENT_VALIDATION_SUCCESS")).toBeInTheDocument()
  })

  test('should call the function to close the success message', async () => {
    const dom = render(
      <GenerationContextProvider
        assignmentsJSON={mockAssignmentRows}
        investmentsJSON={mockInvestmentRows}
        >
        <GenerationDashboard validationConfirm={mockValidationConfirmSuccess} setValidationConfirm={mockSetValidationConfirm}/>
      </GenerationContextProvider>
    )    
    const alertComponent = getById(dom.container,'alert-success-message')
    const closeBtn = within(alertComponent).getByRole('button')
    expect(alertComponent).toBeInTheDocument()
    expect(closeBtn).toBeInTheDocument()
    await userEvent.click(closeBtn)
    expect(mockSetValidationConfirm).toBeCalledWith(false)
  })

  test('should show the failure component', async () => {
    render(
      <GenerationContextProvider
        assignmentsJSON={mockAssignmentRows}
        investmentsJSON={mockInvestmentRows}
        >
        <GenerationDashboard validationConfirm={mockValidationConfirmFailure} />
      </GenerationContextProvider>
    )    
    expect(screen.getByText("FAILURE_TEXT")).toBeInTheDocument()
  })

})
