import React from 'react'

import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'

import LabelFieldRow from '../../components/oficinavirtual/LabelFieldRow'

const IndexedContractDetails = (props) => {
  const { t } = useTranslation()
  const classes = useStyles()

  const { contract, originTariff, targetTariff } = props

  return (
    <div className={classes.root}>
      <LabelFieldRow label={t('CONTRACT')}>
        <p>{contract}</p>
      </LabelFieldRow>
      <LabelFieldRow label={t('CURRENT_TARIFF')}>{originTariff}</LabelFieldRow>
      <LabelFieldRow isHighlight={true} label={t('TARIFF_TO_CONTRACT')}>
        {targetTariff || t('TARIFF_CHANGE_NOT_AVAILABLE')}
      </LabelFieldRow>
    </div>
  )
}

export default IndexedContractDetails

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginBottom: '0.5rem'
  },
  highlight: {
    color: theme.palette.text.primary
  }
}))
