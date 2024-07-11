import React from 'react'
import GenerationAssignmentSection from './GenerationAssignmentSection'
import { render, screen, queryByAttribute, fireEvent } from '@testing-library/react'
import GenerationContext  from '../context/GenerationContext'
import PopUpContext, {PopUpContextProvider}  from '../../../context/PopUpContext'
import { act } from 'react-dom/test-utils'
import SimpleDialog from 'components/SimpleDialog'

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
    const setContent = jest.fn()
    const setContentSimpleDialog = () => <SimpleDialog
    title={'TITLE'}
    text={'TEXT'}
    acceptFunction={() => jest.fn()}
    cancelFunction={() => jest.fn()} />

    const contextValue = {
      assignments,
      changeAssigmentPriority,
      setEditingPriority,
      getPriority,
      editingPriority
    }

    const popUpValue = {
      setContent
    }

    test('The component render properly', () => {
      render(
        <PopUpContext.Provider value={popUpValue}>
        <GenerationContext.Provider value={contextValue}>
            <GenerationAssignmentSection data={assignments}/>
        </GenerationContext.Provider>
        </PopUpContext.Provider >)

        const textElement0 = screen.getByText(assignments[0].contract)
        const textElement1 = screen.getByText(assignments[1].contract)
        expect(textElement0).toBeInTheDocument()
        expect(textElement1).toBeInTheDocument()
    })

    test('Should call the setContent fucntion', () => {
      const dom = render(
        <PopUpContext.Provider value={popUpValue}>
        <GenerationContext.Provider value={contextValue}>
            <GenerationAssignmentSection data={assignments}/>
        </GenerationContext.Provider>
        </PopUpContext.Provider >)

        const deleteButtonOfTheFirstContract = getById(dom.container,`delete-button-${assignments[0].id}`)
        act(() => {
          fireEvent.click(deleteButtonOfTheFirstContract)
        })
        expect(setContent).toBeCalled()
    })

    test('Should click accept to delete contract and show loading component', async () => {
      const dom = render(
        <PopUpContextProvider>
        <GenerationContext.Provider value={contextValue}>
            <GenerationAssignmentSection data={assignments}/>
        </GenerationContext.Provider>
        </PopUpContextProvider >)

        const deleteButtonOfTheFirstContract = getById(dom.container,`delete-button-${assignments[0].id}`)
        act(() => {
          fireEvent.click(deleteButtonOfTheFirstContract)
        })
        const acceptButtonSimpleDialog = await screen.findByTestId('simple-dialog-button-accept')
        act(() => {
          fireEvent.click(acceptButtonSimpleDialog)
        })
        const loadingComponent = await screen.findByTestId('loading-component')
        expect(loadingComponent).toBeInTheDocument()        
    })

    test('Should click cancel to delete contract remove dialog', async () => {
      const dom = render(
        <PopUpContextProvider>
        <GenerationContext.Provider value={contextValue}>
            <GenerationAssignmentSection data={assignments}/>
        </GenerationContext.Provider>
        </PopUpContextProvider >)

        const deleteButtonOfTheFirstContract = getById(dom.container,`delete-button-${assignments[0].id}`)
        act(() => {
          fireEvent.click(deleteButtonOfTheFirstContract)
        })
        const cancelButtonSimpleDialog = await screen.findByTestId('simple-dialog-button-cancel')
        act(() => {
          fireEvent.click(cancelButtonSimpleDialog)
        })
        const SimpleDialogComponent = await screen.queryByTestId('simple-dialog')
        expect(SimpleDialogComponent).toBeNull()        
    })

  })

