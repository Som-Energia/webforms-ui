import React, { useCallback, useContext, useMemo } from 'react'
import GenerationContext from '../context/GenerationContext'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import GenerationTable from './GenerationTable'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import Box from '@material-ui/core/Box'
import DragIndicatorIcon from '@material-ui/icons/DragIndicator'

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

const useStyles = makeStyles({
  dragger: {
    display: 'flex',
    alignItems: 'center',
    gap: 15
  }
})

const StyledTableCell = withStyles(() => ({
  body: {
    fontSize: 14
  }
}))(TableCell)

export default function GenerationAssigmentSection({ data }) {
  const classes = useStyles()
  const rows = data.map((element) => createData(...Object.values(element)))
  const { t } = useTranslation()
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

  const handleChangeSort = useCallback(
    (indexSource, indexDest) => {
      setEditingPriority(true)
      changeAssigmentPriority(rows[indexSource], rows[indexDest])
    },
    [changeAssigmentPriority, rows, setEditingPriority]
  )

  return (
    <DragDropContext
      onDragEnd={(result) => {
        handleChangeSort(result.source.index, result.destination.index)
      }}
      onBeforeDragStart={(result) => {
        const elements = document.getElementsByClassName(
          result.draggableId + 'styled-cell'
        )
        Object.values(elements).forEach((element) => {
          const style = window.getComputedStyle(element)
          element.style.width = style.width
        })
      }}>
      <Droppable droppableId="assignments">
        {(droppableProvided) => (
          <GenerationTable id="assignment-table" columns={columns}>
            <TableBody
              {...droppableProvided.droppableProps}
              ref={droppableProvided.innerRef}>
              {rows.map((row, index) => (
                <Draggable
                  key={row.contract}
                  draggableId={row.contract}
                  index={index}>
                  {(draggableProvided, snapshot) => (
                    <TableRow
                      {...draggableProvided.draggableProps}
                      ref={draggableProvided.innerRef}
                      id={row.contract}>
                      <StyledTableCell
                        className={row.contract + 'styled-cell'}
                        size="small"
                        {...draggableProvided.dragHandleProps}>
                        <Box className={classes.dragger}>
                          <DragIndicatorIcon />
                          {getPriority(row.priority).value}
                        </Box>
                      </StyledTableCell>
                      <StyledTableCell className={row.contract + 'styled-cell'}>
                        {row.contract}
                      </StyledTableCell>
                      <StyledTableCell className={row.contract + 'styled-cell'}>
                        {row.contractAddress}
                      </StyledTableCell>
                      <StyledTableCell className={row.contract + 'styled-cell'}>
                        {dayjs(
                          row.contractLastInvoiced.replaceAll('"', '')
                        ).format('DD/MM/YYYY')}
                      </StyledTableCell>
                      <StyledTableCell className={row.contract + 'styled-cell'}>
                        {Number(row.annualUseKwh).toLocaleString('es-ES', {
                          minimumFractionDigits: 2
                        })}
                      </StyledTableCell>
                    </TableRow>
                  )}
                </Draggable>
              ))}
              {droppableProvided.placeholder}
            </TableBody>
          </GenerationTable>
        )}
      </Droppable>
    </DragDropContext>
  )
}
