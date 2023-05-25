import React, { useCallback, useContext, useMemo, useState } from 'react'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import GenerationContext from './context/GenerationContext'
import GenerationTable from './GenerationTable'
import { useTranslation } from 'react-i18next'
import { withStyles } from '@material-ui/core/styles'
import dayjs from 'dayjs'
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import IconButton from '@material-ui/core/IconButton'
import { Box, Grow } from '@material-ui/core'

function createData(
  id,
  contract,
  contractAddress,
  priority,
  contractLastInvoiced,
  annualUseKwh
) {
  return {
    id,
    contract,
    contractAddress,
    priority,
    contractLastInvoiced,
    annualUseKwh
  }
}

const StyledTableCell = withStyles(() => ({
  body: {
    fontSize: 14
  }
}))(TableCell)

export default function GenerationAssigmentSection({ data }) {
  const rows = data.map((element) => createData(...Object.values(element)))
  const { t } = useTranslation()
  const isVisible = {}
  data.forEach((element, index) => (isVisible[index] = true))
  const [is_visible, setVisible] = useState(isVisible)
  const { getPriority, setEditingPriority, changeAssigmentPriority } =
    useContext(GenerationContext)

  const columns = useMemo(
    () => [
      t('GENERATION_ASSIGNMENTS_TABLE_TTILE_PRIORITY'),
      t('GENERATION_ASSIGNMENTS_TABLE_TTILE_N_CONTRACT'),
      t('ADDRESS'),
      t('GENERATION_ASSIGNMENTS_TABLE_TTILE_LAST_DATE'),
      t('GENERATION_ASSIGNMENTS_TABLE_TITLE_ANNUAL_USE_KWH')
    ],
    [t]
  )

  const changeIsVisible = useCallback(
    (index, newIndex, visible) => {
      let newVisible = JSON.parse(JSON.stringify(is_visible))
      newVisible[index] = visible
      newVisible[newIndex] = visible
      setVisible(newVisible)
    },
    [is_visible]
  )

  const handleChangeSort = useCallback(
    (index, moveAction) => {
      if (
        (moveAction === 'up' && index - 1 < 0) ||
        (moveAction === 'down' && index + 1 >= rows.length)
      ) {
        return false
      }
      const newIndex = moveAction === 'up' ? index - 1 : index + 1
      changeIsVisible(index, newIndex, false)

      setTimeout(() => {
        setEditingPriority(true)
        changeAssigmentPriority(rows[index], rows[newIndex])
        changeIsVisible(index, newIndex, true)
      }, 150)
    },
    [changeAssigmentPriority, rows, setEditingPriority, changeIsVisible]
  )

  return (
    <GenerationTable id="assignment-table" columns={columns}>
      <TableBody>
        {rows.map((row, index) => (
          <Grow key={row.contract} in={is_visible[index]}>
            <TableRow>
              <StyledTableCell size="small">
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center">
                  <IconButton
                    style={{ visibility: index !== 0 ? 'visible' : 'hidden' }}
                    size="small"
                    id={'change-priority-up ' + row.contract}
                    onClick={() => handleChangeSort(index, 'up')}>
                    <ArrowDropUpIcon />
                  </IconButton>
                  {getPriority(row.priority).value}
                  <IconButton
                    style={{
                      visibility:
                        index !== rows.length - 1 ? 'visible' : 'hidden'
                    }}
                    size="small"
                    id={'change-priority-down ' + row.contract}
                    onClick={() => handleChangeSort(index, 'down')}>
                    <ArrowDropDownIcon />
                  </IconButton>
                </Box>
              </StyledTableCell>
              <StyledTableCell>{row.contract}</StyledTableCell>
              <StyledTableCell>{row.contractAddress}</StyledTableCell>
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
          </Grow>
        ))}
      </TableBody>
    </GenerationTable>
  )
}
