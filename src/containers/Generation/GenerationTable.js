import React, { useCallback, useContext, useMemo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import GenerationContext from './context/GenerationContext'

const useStyles = makeStyles({
  table: {
    minWidth: 650
  },
  tableHeader:{
    background: "#e6e6e6"
  }
})

const columns = ['Contract', 'Address', 'Priority', 'LastDate', 'Use']

function createData(Contract, Address, Priority, LastDate, Use) {
  return { Contract, Address, Priority, LastDate, Use }
}

const SelectComponent = ({ data, numContracts }) => {
  const { modifyPriorityContract } = useContext(GenerationContext)

  const priorityList = useMemo(
    () =>
      Array.from({ length: numContracts }, (value, index) => ({
        name: index === 0 ? 'Prioritari' : 'Secundari' + index,
        value: index
      })),
    [numContracts]
  )

  const currentPriority = {
    name: data.Priority === 0 ? 'Prioritari' : 'Secundari' + data.Priority,
    value: data.Priority
  }

  const handleChange = useCallback(
    (event) => {
      modifyPriorityContract(data.Contract, event.target.value)
    },
    [data, modifyPriorityContract]
  )

  return (
    <Select value={currentPriority.value} onChange={handleChange}>
      {priorityList.map((element) => (
        <MenuItem key={element.value} value={element.value}>
          {element.name}
        </MenuItem>
      ))}
    </Select>
  )
}

export default function BasicTable({ data, editing }) {
  const classes = useStyles()
  const rows = data.map((element) => createData(...Object.values(element)))

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead className={classes.tableHeader} >
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column}>{column}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name}>
              <TableCell>{row.Contract}</TableCell>
              <TableCell>{row.Address}</TableCell>
              {editing ? (
                <TableCell>
                  <SelectComponent data={row} numContracts={rows.length} />
                </TableCell>
              ) : (
                <TableCell>{row.Priority}</TableCell>
              )}
              <TableCell>{row.LastDate}</TableCell>
              <TableCell>{row.Use}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
