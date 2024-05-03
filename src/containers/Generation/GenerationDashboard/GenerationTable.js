import React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles';

const StyledTableCell = styled(TableCell)(() => ({
  body: {
    fontSize: 14
  }
}))

export default function GenerationTable({ columns, rows, children, id }) {

  return (
    <TableContainer component={Paper}>
      <Table id={id} sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead sx={{ background: '#e6e6e6' }} >
          <TableRow>
            {columns.map((column) => (
              <StyledTableCell key={column}>{column}</StyledTableCell>
            ))}
          </TableRow>
        </TableHead>

        {children ? (
          children
        ) : (
          <TableBody>
            {rows.map((row) => (
              <TableRow id={row.name} key={row.name}>
                {Object.keys(row).map((key, index) => <StyledTableCell key={row[key] + index} >{row[key]}</StyledTableCell>)}
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
    </TableContainer>
  )
}
