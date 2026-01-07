import { useContext } from 'react'
import GenerationContext from '../context/GenerationContext'
import GenerationTable from './GenerationTable'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import DeleteIcon from '@mui/icons-material/Delete'
import dayjs from 'dayjs'
import { styled } from '@mui/material/styles'
import PopUpContext from '../../../context/PopUpContext'
import SimpleDialog from '../../../components/OldComponents/SimpleDialog';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography'
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useTranslation } from 'react-i18next'

const StyledTableCell = styled(TableCell)(() => ({
  body: {
    fontSize: 14
  }
}))

const DraggableRow = ({ row, handleDelete, loading }) => {
  const { setContent } = useContext(PopUpContext)
  const {t} = useTranslation()
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: row.contract
    })

  const { getPriority } = useContext(GenerationContext)
  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  return (
    <TableRow ref={setNodeRef} style={style} id={row.contract} {...attributes}>
      <StyledTableCell
        className={row.contract + 'styled-cell'}
        size="small"
        {...listeners}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 15 }}>
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
        {dayjs(row.contractLastInvoiced.replaceAll('"', '')).format(
          'DD/MM/YYYY'
        )}
      </StyledTableCell>
      <StyledTableCell className={row.contract + 'styled-cell'}>
        {Number(row.annualUseKwh).toLocaleString('es-ES', {
          minimumFractionDigits: 2
        })}
      </StyledTableCell>
      <StyledTableCell className={row.contract + 'styled-cell'}>
        <IconButton
          id={`delete-button-${row.id}`}
          disabled={loading}
          onClick={() =>
            setContent(
              <SimpleDialog
                title={t('GENERATION_ASSIGNMENTS_CONFIRM_TITLE')}
                text={
                  <Alert severity="warning">
                    <Typography
                      dangerouslySetInnerHTML={{
                        __html: t('GENERATION_REMOVE_ASSIGNMENTS_ALERT_MSG')
                      }}
                    />
                  </Alert>
                }
                acceptFunction={() => handleDelete(row.id)}
                cancelFunction={() => setContent(undefined)}
              />
            )
          }>
          <DeleteIcon />
        </IconButton>
      </StyledTableCell>
    </TableRow>
  )
}

const DraggableTable = ({
  rows,
  handleChangeSort,
  handleDelete,
  loading,
  columns
}) => {
  const sensors = useSensors(useSensor(PointerSensor))

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (active.id !== over.id) {
      const oldIndex = rows.findIndex((row) => row.contract === active.id)
      const newIndex = rows.findIndex((row) => row.contract === over.id)
      handleChangeSort(oldIndex, newIndex)
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}>
      <SortableContext
        items={rows.map((row) => row.contract)}
        strategy={verticalListSortingStrategy}>
        <GenerationTable id="assignment-table" columns={columns}>
          <TableBody>
            {rows.map((row, index) => (
              <DraggableRow
                key={row.contract}
                row={row}
                index={index}
                handleDelete={handleDelete}
                loading={loading}
              />
            ))}
          </TableBody>
        </GenerationTable>
      </SortableContext>
    </DndContext>
  )
}
export default DraggableTable
