import React from 'react'
import GenerationDashboard from './GenerationDashboard'
import { render, queryByAttribute, screen, within, fireEvent, waitFor } from '@testing-library/react'
import { GenerationContextProvider } from '../context/GenerationContext'
import { PopUpContextProvider } from '../../../context/PopUpContext'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest';
import * as myApi from '../../../services/api'


vi.mock('react-i18next', () => require('../../../tests/__mocks__/i18n'));
vi.mock('axios', async (importActual) => {
  const actual = await importActual();

  const mockAxios = {
    default: {
      ...actual.default,
      create: vi.fn(() => ({
        ...actual.default.create(),
        get: mocks.get,
        post: mocks.post,
        delete: mocks.delete
      })),
    },
  };

  return mockAxios;
});

describe('Generation Dashboard', () => {
  const getById = queryByAttribute.bind(null, 'id')
  const mockValidationConfirm = { finished: false, completed: false }
  const mockValidationConfirmSuccess = { finished: true, completed: true }
  const mockValidationConfirmFailure = { finished: true, completed: false }
  const mockAssignmentRows = JSON.parse('[{"id":"00001","contract": "ES0031405524755001RN0F - 0010777","contract_address": "Major, 22, 3º 08970 (Sant Joan Despí)", "contract_tariff":"2.0","priority": 0,"contract_last_invoiced": "2023-01-08","annual_use_kwh": "7105.0"},{"id":"00002","contract": "ES0031405524910014WM0F - 0013117","contract_address": ". Jacint Verdaguer, 42, 3er 1a 8970 (Sant Joan Despí)","contract_tariff":"2.0","priority": 1,"contract_last_invoiced": "2023-01-04","annual_use_kwh": "115.0"}]'
  )
  const mockContractNoAssignmentRows = JSON.parse('[{"id":"00003","contract": "ES0031405524755001WN8H - 0010243","contract_address": "Carrer Petit, 21, 2º 08880 (Sant Carles de la Ràpita)", "contract_tariff":"2.0","priority": 3,"contract_last_invoiced": "2023-01-08","annual_use_kwh": "7105.0"}]'
  )

  const mockInvestmentRows = JSON.parse(
    '[{"name": "GKWH05844","nominal_amount": "2000.0","nshares": 20,"purchase_date": "2020-01-01","first_effective_date": "2021-01-01","amortized_amount": "160.0","last_effective_date": "2045-01-01"}]'
  )

  const mockHandleCancelButtonClick = vi.fn()
  const mockhandleClick = vi.fn()
  const mockValidateChanges = vi.fn()
  const mockSetValidationConfirm = vi.fn()

  vi.spyOn(myApi,'addContractsToAssignments').mockImplementation(()=>{
    return Promise.resolve({data:"OK"})
  })

  vi.spyOn(myApi,'getAssignmentContracts').mockImplementation(()=>{
    return Promise.resolve({data:[]})
  })

  test('The component render properly the prop data', () => {
    const dom = render(
      <PopUpContextProvider>
        <GenerationContextProvider
          assignmentsJSON={mockAssignmentRows}
          investmentsJSON={mockInvestmentRows}
          testMode={true}>
          <GenerationDashboard validationConfirm={mockValidationConfirm} />
        </GenerationContextProvider>
      </PopUpContextProvider>
    )

    const assignmentTable = getById(dom.container, 'assignment-table')
    expect(assignmentTable).toBeInTheDocument()

    const investmentTable = getById(dom.container, 'investment-table')
    expect(investmentTable).toBeInTheDocument()
  })


  test('should show cancel and validate button when editing', async () => {
    const dom = render(
      <PopUpContextProvider>
        <GenerationContextProvider
          assignmentsJSON={mockAssignmentRows}
          investmentsJSON={mockInvestmentRows}
          propEditingPriority={true}
          testMode={true}
        >
          <GenerationDashboard handleClick={mockhandleClick} validationConfirm={mockValidationConfirm} />
        </GenerationContextProvider>
      </PopUpContextProvider>
    )

    const cancelButton = getById(dom.container, 'cancel-action-btn')
    const validateButton = getById(dom.container, 'validation-action-btn')
    expect(cancelButton).toBeInTheDocument()
    expect(validateButton).toBeInTheDocument()
  })

  test('should call cancel function when click cancel button', async () => {
    const dom = render(
      <PopUpContextProvider>
        <GenerationContextProvider
          assignmentsJSON={mockAssignmentRows}
          investmentsJSON={mockInvestmentRows}
          propEditingPriority={true}
          testMode={true}
        >
          <GenerationDashboard handleCancelButtonClick={mockHandleCancelButtonClick} validationConfirm={mockValidationConfirm} />
        </GenerationContextProvider>
      </PopUpContextProvider>
    )

    const cancelButton = getById(dom.container, 'cancel-action-btn')
    await userEvent.click(cancelButton)
    expect(mockHandleCancelButtonClick).toHaveBeenCalled()
  })

  test('should call validate function when click validate button', async () => {
    const dom = render(
      <PopUpContextProvider>
        <GenerationContextProvider
          assignmentsJSON={mockAssignmentRows}
          investmentsJSON={mockInvestmentRows}
          propEditingPriority={true}
          testMode={true}
        >
          <GenerationDashboard validateChanges={mockValidateChanges} validationConfirm={mockValidationConfirm} />
        </GenerationContextProvider>
      </PopUpContextProvider>
    )
    const validateButton = getById(dom.container, 'validation-action-btn')
    await userEvent.click(validateButton)
    expect(mockValidateChanges).toHaveBeenCalled()
  })

  test('should show the info text', async () => {

    const mockAssignmentSamePriorityRows = JSON.parse(
      '[{"id":"0001","contract": "ES0031405524755001RN0F - 0010777","contract_address": "Major, 22, 3º 08970 (Sant Joan Despí)","priority": 0,"contract_last_invoiced": "2023-01-08","annual_use_kwh": "7105.0"},{"id":"0002","contract": "ES0031405524910014WM0F - 0013117","contract_address": ". Jacint Verdaguer, 42, 3er 1a 8970 (Sant Joan Despí)","priority": 0,"contract_last_invoiced": "2023-01-04","annual_use_kwh": "115.0"}]'
    )
    const dom = render(
      <PopUpContextProvider>
        <GenerationContextProvider
          assignmentsJSON={mockAssignmentSamePriorityRows}
          investmentsJSON={mockInvestmentRows}
          propEditingPriority={true}
          testMode={true}
        >
          <GenerationDashboard validationConfirm={mockValidationConfirm} />
        </GenerationContextProvider>
      </PopUpContextProvider>
    )
    const infoText = getById(dom.container, 'info-text-section')
    expect(infoText).toBeInTheDocument()
  })

  test('should show the success text', async () => {
    const dom = render(
      <PopUpContextProvider>
        <GenerationContextProvider
          assignmentsJSON={mockAssignmentRows}
          investmentsJSON={mockInvestmentRows}
          testMode={true}
        >
          <GenerationDashboard validationConfirm={mockValidationConfirmSuccess} />
        </GenerationContextProvider>
      </PopUpContextProvider>
    )
    const alertComponent = getById(dom.container, 'alert-success-message')
    expect(alertComponent).toBeInTheDocument()
    expect(screen.getByText("GENERATION_INVESTMENTS_ASSIGNMENT_VALIDATION_SUCCESS")).toBeInTheDocument()
  })

  test('should call the function to close the success message', async () => {
    const dom = render(
      <PopUpContextProvider>
        <GenerationContextProvider
          assignmentsJSON={mockAssignmentRows}
          investmentsJSON={mockInvestmentRows}
          testMode={true}
        >
          <GenerationDashboard validationConfirm={mockValidationConfirmSuccess} setValidationConfirm={mockSetValidationConfirm} />
        </GenerationContextProvider>
      </PopUpContextProvider>
    )
    const alertComponent = getById(dom.container, 'alert-success-message')
    const closeBtn = within(alertComponent).getByRole('button')
    expect(alertComponent).toBeInTheDocument()
    expect(closeBtn).toBeInTheDocument()
    await userEvent.click(closeBtn)
    expect(mockSetValidationConfirm).toHaveBeenCalledWith(false)
  })

  test('should show the failure component', async () => {
    render(
      <PopUpContextProvider>
        <GenerationContextProvider
          assignmentsJSON={mockAssignmentRows}
          investmentsJSON={mockInvestmentRows}
          testMode={true}
        >
          <GenerationDashboard validationConfirm={mockValidationConfirmFailure} />
        </GenerationContextProvider>
      </PopUpContextProvider>
    )
    expect(screen.getByText("FAILURE_TEXT")).toBeInTheDocument()
  })

  test('Should call the add contract function', async () => {
    const dom = render(
      <PopUpContextProvider>
        <GenerationContextProvider
          assignmentsJSON={mockAssignmentRows}
          investmentsJSON={mockInvestmentRows}
          contractNoAssignmentsJSON={mockContractNoAssignmentRows}
          testMode={true}>
          <GenerationDashboard validationConfirm={mockValidationConfirm} />
        </GenerationContextProvider>
      </PopUpContextProvider>
    )
    const addButton = getById(dom.container, 'generationkwh-id-add-assignment')
    await userEvent.click(addButton)

    const checkbox = screen.getByTestId('checkbox-00003')
    await userEvent.click(checkbox)

    React.act(() => {
      const acceptButton = screen.getByTestId('list-accept-button')
      fireEvent.click(acceptButton)
    })

    await waitFor(() => expect(screen.getByTestId('loading-component')).toBeInTheDocument());
  })

  test('Should show info message when you can\'t add more contracts', async () => {
    const dom = render(
      <PopUpContextProvider>
        <GenerationContextProvider
          assignmentsJSON={mockAssignmentRows}
          investmentsJSON={mockInvestmentRows}
          contractNoAssignmentsJSON={[]}
          testMode={true}>
          <GenerationDashboard validationConfirm={mockValidationConfirm} />
        </GenerationContextProvider>
      </PopUpContextProvider>
    )
    const addButton = getById(dom.container, 'generationkwh-id-add-assignment')
    await userEvent.click(addButton)
       
    const infoMessage = screen.getByText('GENERATION_ADD_ASSIGNMENTS_INFO_NO_CONTRACTS_TEXT')
    expect(infoMessage).toBeInTheDocument()

  })
})
