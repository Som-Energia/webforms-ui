import React from 'react'
import GenerationAssignmentSection from './GenerationAssignmentSection'
import { render, screen, queryByAttribute, waitFor } from '@testing-library/react'
import GenerationContext  from './context/GenerationContext'
import userEvent from '@testing-library/user-event'

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


describe('Generation Assignment Section', () => {
  
    const getById = queryByAttribute.bind(null, 'id')  
    const assignments = JSON.parse('[{"id":"00001","contract": "ES0031405524755001RN0F - 0010777","contractAddress": "Major, 22, 3º 08970 (Sant Joan Despí)","priority": 0,"contractLastInvoiced": "2023-01-08","annualUseKwh": "7105.0"},{"id":"00002","contract": "ES0031405524910014WM0F - 0013117","contractAddress": ". Jacint Verdaguer, 42, 3er 1a 8970 (Sant Joan Despí)","priority": 1,"contractLastInvoiced": "2023-01-04","annualUseKwh": "115.0"}]')
    const changeAssigmentPriority = jest.fn()
    const setEditingPriority = jest.fn()
    const getPriority = () => ({value:"mocKPriority"})
    const editingPriority = true


    const contextValue = {
      assignments,
      changeAssigmentPriority,
      setEditingPriority,
      getPriority,
      editingPriority
    }


    test('The component render properly', () => {
      render(
        <GenerationContext.Provider value={contextValue}>
            <GenerationAssignmentSection data={assignments}/>
        </GenerationContext.Provider>)

        const textElement0 = screen.getByText(assignments[0].contract)
        const textElement1 = screen.getByText(assignments[1].contract)
        expect(textElement0).toBeInTheDocument()
        expect(textElement1).toBeInTheDocument()
    })


    test('Should call the function to change to lower priority', async () => {
      const dom = render(
        <GenerationContext.Provider value={contextValue}>
            <GenerationAssignmentSection data={assignments} />
        </GenerationContext.Provider>)
    
      const changePriorityDownButton = getById(dom.container,'change-priority-down ' + assignments[0].contract)
      await userEvent.click(changePriorityDownButton)
      await waitFor(() => expect(changeAssigmentPriority).toBeCalledWith(assignments[0],assignments[1]))

    })

    test('Should call the function to change to higher priority', async () => {
      const dom = render(
        <GenerationContext.Provider value={contextValue}>
            <GenerationAssignmentSection data={assignments} />
        </GenerationContext.Provider>)
    
      const changePriorityUpButton = getById(dom.container,'change-priority-up ' + assignments[1].contract)
      await userEvent.click(changePriorityUpButton)
      await waitFor(() => expect(changeAssigmentPriority).toBeCalledWith(assignments[1],assignments[0]))

    })

    test('Should not call the function to change to higher priority', async () => {
      const dom = render(
        <GenerationContext.Provider value={contextValue}>
            <GenerationAssignmentSection data={assignments} editing={true}/>
        </GenerationContext.Provider>)
    
      const changePriorityUpButton = getById(dom.container,'change-priority-up ' + assignments[0].contract)
      await userEvent.click(changePriorityUpButton)
      expect(changeAssigmentPriority).toBeCalledTimes(0)

    })
  })

