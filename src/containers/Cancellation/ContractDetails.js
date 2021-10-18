import React from 'react'

import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'

import LabelFieldRow from '../../components/oficinavirtual/LabelFieldRow'

const ContractDetails = (props) => {
  const { t } = useTranslation()
  const classes = useStyles()

  const { contract_number, cups_address } = props

  return (
    <div className={classes.root}>
      <LabelFieldRow label={t('CONTRACT')}>
        <p>{contract_number}</p>
      </LabelFieldRow>
      <LabelFieldRow label={t('ADDRESS')}>
        <p>{cups_address}</p>
      </LabelFieldRow>
    </div>
  )
}

export default ContractDetails

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginBottom: '0.5rem'
  }
}))
