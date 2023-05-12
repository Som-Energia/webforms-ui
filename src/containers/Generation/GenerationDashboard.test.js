import React from 'react'
import GenerationDashboard from './GenerationDashboard'
import { render } from '@testing-library/react'
import { GenerationContextProvider } from './context/GenerationContext'

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


describe('Generation Dashboard', () => {
  
    const mockAssignmentRows = JSON.parse('[{"contract": "ES0031405524755001RN0F - 0010777","contract_address": "Major, 22, 3º 08970 (Sant Joan Despí)","priority": 0,"contract_last_invoiced": "2023-01-08","annual_use_kwh": "7105.0"},{"contract": "ES0031405524910014WM0F - 0013117","contract_address": ". Jacint Verdaguer, 42, 3er 1a 8970 (Sant Joan Despí)","priority": 1,"contract_last_invoiced": "2023-01-04","annual_use_kwh": "115.0"}]')
    const mockInvestmentRows = JSON.parse('[{"contract": "ES0031405524755001RN0F - 0010777","contract_address": "Major, 22, 3º 08970 (Sant Joan Despí)","priority": 0,"contract_last_invoiced": "2023-01-08","annual_use_kwh": "7105.0"},{"contract": "ES0031405524910014WM0F - 0013117","contract_address": ". Jacint Verdaguer, 42, 3er 1a 8970 (Sant Joan Despí)","priority": 1,"contract_last_invoiced": "2023-01-04","annual_use_kwh": "115.0"},{"contract": "ES0031405707405001AC0F - 0212400","contract_address": "CL Can Cartró , 27 27 Baix 08629 (Torrelles de Llobregat)","priority": 2,"contract_last_invoiced": "2022-11-10","annual_use_kwh": "1800.0"},{"contract": "ES0031103223192001CA0F - 0003684","contract_address": "PLAZA DE LA CONCORDIA, ,7 18518 (Lanteira)","priority": 1,"contract_last_invoiced": "2022-12-24","annual_use_kwh": "71.0"},{"contract": "ES0031408064564001YH0F - 0004438","contract_address": "FREDERIC CASAS,  Nº9 08970 (Sant Joan Despí)","priority": 0,"contract_last_invoiced": "2023-01-09","annual_use_kwh": "3537.0"}]')

    test('The component render properly', () => {
      render(
        <GenerationContextProvider assignmentsJSON={mockAssignmentRows} investmentsJSON={mockInvestmentRows}>
            <GenerationDashboard data={mockAssignmentRows}/>
        </GenerationContextProvider>)
    })

  })

