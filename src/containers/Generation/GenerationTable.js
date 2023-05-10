import React from 'react'
import { makeStyles,withStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'

const useStyles = makeStyles({
  table: {
    minWidth: 650
  },
  tableHeader: {
    background: '#e6e6e6'
  }
})

const StyledTableCell = withStyles((theme) => ({
    body: {
      fontSize: 14,
    },
  }))(TableCell);


export default function BasicTable({ columns, rows, children }) {
  const classes = useStyles()

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead className={classes.tableHeader}>
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
              <TableRow key={row}>
                {Object.keys(row).map((key) => <StyledTableCell key={row[key]} >{row[key]}</StyledTableCell>)}
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
    </TableContainer>
  )
}
