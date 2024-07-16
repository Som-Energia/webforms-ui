import React, { useCallback, useContext, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Box from '@mui/material/Box'
import DragIndicatorIcon from '@mui/icons-material//DragIndicator'
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles';
import GenerationTable from './GenerationTable'
import GenerationContext from '../context/GenerationContext'
import PopUpContext from '../../../context/PopUpContext';
import SimpleDialog from '../../../components/SimpleDialog';
import { deleteContractsFromAssignments } from '../../../services/api'
import CustomDialog from '../../../components/CustomDialog'
import Loading from '../../../components/Loading'


const StyledTableCell = styled(TableCell)(() => ({
  body: {
    fontSize: 14
  }
}))


function createData(
  id,
  contract,
  contractAddress,
  contractTariff,
  priority,
  contractLastInvoiced,
  annualUseKwh
) {
  return {
    id,
    contract,
    contractAddress,
    contractTariff,
    priority,
    contractLastInvoiced,
    annualUseKwh
  }
}



export default function GenerationAssigmentSection({ data }) {
  const rows = data.map((element) => createData(...Object.values(element)))
  const { t } = useTranslation()
  const { getPriority, setEditingPriority, changeAssigmentPriority, getAssingments, getContractsToAssign } =
    useContext(GenerationContext)
  const [loading, setLoading] = useState(false)

  const { setContent } = useContext(PopUpContext)

  const columns = useMemo(
    () => [
      t('GENERATION_ASSIGNMENTS_TABLE_TTILE_PRIORITY'),
      t('GENERATION_ASSIGNMENTS_TABLE_TTILE_N_CONTRACT'),
      t('ADDRESS'),
      t('GENERATION_ASSIGNMENTS_TABLE_TTILE_LAST_DATE'),
      t('GENERATION_ASSIGNMENTS_TABLE_TITLE_ANNUAL_USE_KWH'),
      ''
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

  const handleDelete = async (id) => {
    try {
      setLoading(true)
      setContent(<CustomDialog withBackground={false} blockHandleClose={true} ><Loading /></CustomDialog>)
      await deleteContractsFromAssignments(id)
      await getContractsToAssign()
      setLoading(false)
      getAssingments()
    }
    catch (e) {
      console.error(e)
      setLoading(false)
    }
    setContent(undefined)
  }

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
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 15
                        }} >
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
                      <StyledTableCell className={row.contract + 'styled-cell'}>
                        <IconButton id={`delete-button-${row.id}`} disabled={loading} onClick={() => setContent(
                          <SimpleDialog
                            title={t('GENERATION_ASSIGNMENTS_CONFIRM_TITLE')}
                            text={<Alert severity="warning" ><Typography dangerouslySetInnerHTML={{ __html: t('GENERATION_REMOVE_ASSIGNMENTS_ALERT_MSG') }} /></Alert>}
                            acceptFunction={() => handleDelete(row.id)}
                            cancelFunction={() => setContent(undefined)} />
                        )}>
                          <DeleteIcon />
                        </IconButton>
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
