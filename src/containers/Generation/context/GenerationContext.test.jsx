import { screen, render, queryByAttribute } from '@testing-library/react'
import GenerationContext, {
  GenerationContextProvider
} from './GenerationContext'
import React, { useContext } from 'react'
import Button from '@mui/material/Button'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest';

vi.mock('react-i18next', () => require('../../../tests/__mocks__/i18n'));


const ContextConsumer = () => {
  const { assignments, investments, changeAssigmentPriority, resetAssignments, getPriority  } = useContext(GenerationContext)
  return (
    <>
      {assignments.map((assignment) => (
        <li id={assignment.contract} key={assignment.contract} ><p>{assignment.contract} - {assignment.priority}</p></li>
      ))}
      {investments.map((investment) => (
        <li id={investment.name} key={investment.name} >{investment.contract}</li>
      ))}

      <p id={'first-priority'}>{getPriority(0).value}</p>
      
      {/*CAHNGE 0 FOR 1 ASSIGNMENTS OF mockAssignmentRows*/}
      <Button id={'change-priority-btn'} onClick={() => changeAssigmentPriority(assignments[0],assignments[1])} />
      <Button id={'reset-priority-btn'} onClick={() => resetAssignments()} />
      
    </>
  )
}


describe('Generation Context', () => {
  const getById = queryByAttribute.bind(null, 'id')
  const mockAssignmentRows = JSON.parse(
    '[{"contract": "ES0031405524755001RN0F - 0010777","contract_address": "Major, 22, 3º 08970 (Sant Joan Despí)","priority": 0,"contract_last_invoiced": "2023-01-08","annual_use_kwh": "7105.0"},{"contract": "ES0031405524910014WM0F - 0013117","contract_address": ". Jacint Verdaguer, 42, 3er 1a 8970 (Sant Joan Despí)","priority": 1,"contract_last_invoiced": "2023-01-04","annual_use_kwh": "115.0"}]'
  )
  const mockOutsideAssignmentRows = JSON.parse(
    '[{"contract": "ES0031405524755001RN0F - 0010777","contract_address": "Major, 22, 3º 08970 (Sant Joan Despí)","priority": 0,"contract_last_invoiced": "2023-01-08","annual_use_kwh": "7105.0"},{"contract": "ES0031405524910014WM0F - 0013117","contract_address": ". Jacint Verdaguer, 42, 3er 1a 8970 (Sant Joan Despí)","priority": 1,"contract_last_invoiced": "2023-01-04","annual_use_kwh": "115.0"}]'
  )
  const mockInvestmentRows = JSON.parse(
    '[{"name": "GKWH05844","nominal_amount": "2000.0","nshares": 20,"purchase_date": "2020-01-01","first_effective_date": "2021-01-01","amortized_amount": "160.0","last_effective_date": "2045-01-01"}]'
  )

  test('should provide GenerationContext values to child elements', () => {
    const dom = render(
      <GenerationContextProvider
        assignmentsJSON={mockAssignmentRows}
        investmentsJSON={mockInvestmentRows}
        outsideAssignmentsJSON={mockOutsideAssignmentRows}>
          <ContextConsumer />
        </GenerationContextProvider>
    )

    const assignmentElement = getById(dom.container, mockAssignmentRows[0].contract)
    expect(assignmentElement).toBeInTheDocument()

  })

  test('should change the priority of one assignment', async () => {
    const dom = render(
      <GenerationContextProvider
        assignmentsJSON={mockAssignmentRows}
        investmentsJSON={mockInvestmentRows}
        outsideAssignmentsJSON={mockOutsideAssignmentRows}>
          <ContextConsumer />
        </GenerationContextProvider>
    )

    const changeButton = getById(dom.container, "change-priority-btn")
    await userEvent.click(changeButton)
    expect(screen.getByText(mockAssignmentRows[0].contract + " - " +  mockAssignmentRows[1].priority)).toBeInTheDocument()
    expect(screen.getByText(mockAssignmentRows[1].contract + " - " +  mockAssignmentRows[0].priority)).toBeInTheDocument()
  })

  test('should change the priority of one assignment and then reset', async () => {
    const dom = render(
      <GenerationContextProvider
        assignmentsJSON={mockAssignmentRows}
        investmentsJSON={mockInvestmentRows}
        outsideAssignmentsJSON={mockOutsideAssignmentRows}>
          <ContextConsumer />
        </GenerationContextProvider>
    )

    const changeButton = getById(dom.container, "change-priority-btn")
    await userEvent.click(changeButton)
    expect(screen.getByText(mockAssignmentRows[0].contract + " - " +  mockAssignmentRows[1].priority)).toBeInTheDocument()
    expect(screen.getByText(mockAssignmentRows[1].contract + " - " +  mockAssignmentRows[0].priority)).toBeInTheDocument()

    const resetButton = getById(dom.container, "reset-priority-btn")
    await userEvent.click(resetButton)
    expect(screen.getByText(mockAssignmentRows[0].contract + " - " +  mockAssignmentRows[0].priority)).toBeInTheDocument()
    expect(screen.getByText(mockAssignmentRows[1].contract + " - " +  mockAssignmentRows[1].priority)).toBeInTheDocument()

  })

  test('should get the priority from first assignment as priority', async () => {
    render(
      <GenerationContextProvider
        assignmentsJSON={mockAssignmentRows}
        investmentsJSON={mockInvestmentRows}
        outsideAssignmentsJSON={mockOutsideAssignmentRows}>
          <ContextConsumer />
        </GenerationContextProvider>
    )

    expect(screen.getByText("GENERATION_MAIN_PRIORITY")).toBeInTheDocument()

  })

})
