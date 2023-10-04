import React from 'react'
import GenerationTable from './GenerationTable'
import TableBody from '@material-ui/core/TableBody'
import { render, queryByAttribute } from '@testing-library/react'

describe('Generation Table', () => {


    const getById = queryByAttribute.bind(null, 'id');
    const mockColumns = [
        'N_CONTRACT',
        'ADDRESS',
        'PRIORITY',
        'LAST_INVOICED',
        'ANNUAL_USE_KWH'
      ]
    const mockRows = JSON.parse('[{"name": "GKWH99999","nominal_amount": "5000.0","nshares": 10,"purchase_date": "2022-02-01","first_effective_date": "2022-02-01","amortized_amount": "160.0","last_effective_date": "2023-01-01"},{"name": "GKWH99998","nominal_amount": "5000.0","nshares": 10,"purchase_date": "2021-02-01","first_effective_date": "2021-02-01","amortized_amount": "160.0","last_effective_date": "2022-01-01"}]')

    const MockChildren = () => <TableBody id="mockBody"></TableBody>
  
    test('The component render properly the prop text', () => {
      const dom = render(<GenerationTable columns={mockColumns} rows={mockRows} />)
      const firstRow = getById(dom.container,mockRows[0].name)
      const secondRow = getById(dom.container,mockRows[1].name)
    
      expect(firstRow).toBeInTheDocument()
      expect(secondRow).toBeInTheDocument()
    })

    test('The component render properly the prop text', () => {
        const dom = render(<GenerationTable columns={mockColumns}><MockChildren/></GenerationTable> )
        const mockBody = getById(dom.container,"mockBody")      
        expect(mockBody).toBeInTheDocument()
    })

  })

