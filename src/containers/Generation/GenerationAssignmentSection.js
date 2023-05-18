import React, { useCallback, useContext, useMemo } from 'react'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import GenerationContext from './context/GenerationContext'
import GenerationTable from './GenerationTable'
import { useTranslation } from 'react-i18next'
import { withStyles } from '@material-ui/core/styles'
import dayjs from 'dayjs'
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import IconButton from '@material-ui/core/IconButton';
import { Box } from '@material-ui/core'

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

const StyledTableCell = withStyles((theme) => ({
  body: {
    fontSize: 14
  }
}))(TableCell)

export default function GenerationAssigmentSection({ data, editing }) {
  const rows = data.map((element) => createData(...Object.values(element)))
  const { t } = useTranslation()
  const { getPriority, changeAssigmentPriority } = useContext(GenerationContext)

  const columns = useMemo(
    () => [
      "",
      t('N_CONTRACT'),
      t('ADDRESS'),
      t('PRIORITY'),
      t('LAST_INVOICED'),
      t('ANNUAL_USE_KWH')
    ],
    [t]
  )

  const handleChangeSort = useCallback((index, moveAction) => {
    if((moveAction === 'up' && index - 1 < 0) || (moveAction === 'down' && index + 1 >= rows.length) ){
      return false
    } 
    const newIndex = moveAction === 'up' ? index-1 : index+1;
    changeAssigmentPriority(rows[index], rows[newIndex]) 
  },[changeAssigmentPriority,rows])


  return (
    <GenerationTable id="assignment-table" columns={columns}>
      <TableBody>
        {rows.map((row,index) => (
          <TableRow key={row.contract}>
            <StyledTableCell>
              {editing ? <Box>
                <IconButton id={'change-priority-up ' + row.contract} size='small' onClick={() => handleChangeSort(index, 'up')} ><ArrowDropUpIcon/></IconButton>
                <IconButton id={'change-priority-down ' + row.contract} size='small' onClick={() => handleChangeSort(index, 'down')} ><ArrowDropDownIcon/></IconButton>
              </Box> : null}
            </StyledTableCell>
            <StyledTableCell>{row.contract}</StyledTableCell>
            <StyledTableCell>{row.contractAddress}</StyledTableCell>
            <StyledTableCell>{getPriority(row.priority).value}</StyledTableCell>
            <StyledTableCell>
              {dayjs(row.contractLastInvoiced.replaceAll('"', '')).format(
                'DD/MM/YYYY'
              )}
            </StyledTableCell>
            <StyledTableCell>
              {Number(row.annualUseKwh).toLocaleString('es-ES', {
                minimumFractionDigits: 2
              })}
            </StyledTableCell>
          </TableRow>
        ))}
      </TableBody>
    </GenerationTable>
  )
}
