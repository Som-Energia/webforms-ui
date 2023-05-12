import React, { useCallback, useContext, useMemo } from 'react'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import GenerationContext from './context/GenerationContext'
import GenerationTable from './GenerationTable'
import { useTranslation } from 'react-i18next'
import { withStyles } from '@material-ui/core/styles'
import dayjs from 'dayjs'

function createData(
  contract,
  contractAddress,
  priority,
  contractLastInvoiced,
  annualUseKwh
) {
  return {
    contract,
    contractAddress,
    priority,
    contractLastInvoiced,
    annualUseKwh
  }
}

const SelectComponent = ({ data }) => {
  const { priorities, modifyPriorityContract, getPriority } = useContext(GenerationContext)
  const currentPriority = getPriority(data.priority)

  const handleChange = useCallback(
    (event) => {
      modifyPriorityContract(data.contract, event.target.value)
    },
    [data, modifyPriorityContract]
  )

  return (
    <Select id={data.name} value={currentPriority.index} onChange={handleChange}>
      {priorities.map((element) => (
        <MenuItem key={element.index} value={element.index}>
          {element.value}
        </MenuItem>
      ))}
    </Select>
  )
}

const StyledTableCell = withStyles((theme) => ({
    body: {
      fontSize: 14,
    },
  }))(TableCell);


export default function GenerationAssigmentSection({ data, editing }) {
  const rows = data.map((element) => createData(...Object.values(element)))
  const {t} = useTranslation()
  const { getPriority } = useContext(GenerationContext)

  const columns = useMemo(() => [
    t('N_CONTRACT'),
    t('ADDRESS'),
    t('PRIORITY'),
    t('LAST_INVOICED'),
    t('ANNUAL_USE_KWH')
  ],[t])

  return (
    <GenerationTable  id="assignment-table" columns={columns} >
      <TableBody >
        {rows.map((row) => (
          <TableRow key={row.contract}>
            <StyledTableCell>{row.contract}</StyledTableCell>
            <StyledTableCell>{row.contractAddress}</StyledTableCell>
            {editing ? (
              <StyledTableCell>
                <SelectComponent data={row} numContracts={rows.length} />
              </StyledTableCell>
            ) : (
              <StyledTableCell >{getPriority(row.priority).value}</StyledTableCell>
            )}
            <StyledTableCell >
              {dayjs(row.contractLastInvoiced.replaceAll('"','')).format("DD/MM/YYYY")}
            </StyledTableCell>
            <StyledTableCell>{Number(row.annualUseKwh).toLocaleString("es-ES",{minimumFractionDigits:2})}</StyledTableCell>
          </TableRow>
        ))}
      </TableBody>
    </GenerationTable>
  )
}
