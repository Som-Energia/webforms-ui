import React, { useMemo } from 'react'
import GenerationTable from './GenerationTable'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'

function createData(
  name,
  nominal_amount,
  nshares,
  purchase_date,
  first_effective_date,
  amortized_amount,
  last_effective_date
) {
  return {
    name,
    nominal_amount: Number(nominal_amount).toLocaleString('es-ES') + '€',
    nshares,
    purchase_date: dayjs(purchase_date.replaceAll('"', '')).format(
      'DD/MM/YYYY'
    ),
    first_effective_date: dayjs(
      first_effective_date.replaceAll('"', '')
    ).format('DD/MM/YYYY'),
    amortized_amount: Number(amortized_amount).toLocaleString('es-ES') + '€',
    last_effective_date: dayjs(last_effective_date.replaceAll('"', '')).format(
      'DD/MM/YYYY'
    )
  }
}

export default function GenerationInvestmentSection({ data }) {
  const { t } = useTranslation()

  const rows = useMemo(
    () => data.map((element) => createData(...Object.values(element))),
    [data]
  )
  const columns = useMemo(
    () => [
      t('GENERATION_INVESTMENTS_TABLE_TTILE_N_INVESTMENT'),
      t('GENERATION_INVESTMENTS_TABLE_TTILE_INVESTED_AMOUNT'),
      t('GENERATION_INVESTMENTS_TABLE_TTILE_ENERGY_ACTIONS'),
      t('GENERATION_INVESTMENTS_TABLE_TITLE_PURCHASE_DATE '),
      t('GENERATION_INVESTMENTS_TABLE_TITLE_ACTIVATION_DATE '),
      t('GENERATION_INVESTMENTS_TABLE_TITLE_AMORTIZED_AMOUNT '),
      t('GENERATION_INVESTMENTS_TABLE_TITLE_END_DATE ')
    ],
    [t]
  )

  return <GenerationTable id="investment-table" columns={columns} rows={rows} />
}
