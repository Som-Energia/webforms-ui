import React, { useCallback, useContext, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import GenerationContext from '../context/GenerationContext'
import PopUpContext from '../../../context/PopUpContext'
import { deleteContractsFromAssignments } from '../../../services/api'
import CustomDialog from '../../../components/CustomDialog'
import Loading from '../../../components/Loading'
import AssignmentsTable from './AssignmentsTable'

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
  const {
    setEditingPriority,
    changeAssigmentPriority,
    getAssingments,
    getContractsToAssign
  } = useContext(GenerationContext)
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
      setContent(
        <CustomDialog withBackground={false} blockHandleClose={true}>
          <Loading />
        </CustomDialog>
      )
      await deleteContractsFromAssignments(id)
      await getContractsToAssign()
      setLoading(false)
      getAssingments()
    } catch (e) {
      console.error(e)
      setLoading(false)
    }
    setContent(undefined)
  }

  return (
    <AssignmentsTable
      rows={rows}
      handleChangeSort={handleChangeSort}
      handleDelete={handleDelete}
      loading={loading}
      columns={columns}
    />
  )
}
