import React from 'react'

import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'

import LabelFieldRow from '../../components/oficinavirtual/LabelFieldRow'

const IndexadaContractDetails = (props) => {
  const { t } = useTranslation()
  const classes = useStyles()

  const { data } = props

  return (
    <div className={classes.root}>
      <LabelFieldRow label={t('CONTRACT')}>
        <p>{data.name}</p>
      </LabelFieldRow>
      <LabelFieldRow label={t('CURRENT_TARIFF')}>
        {data.tariff}
      </LabelFieldRow>
      <LabelFieldRow isHighlight={true} label={t('TARIFF_TO_CONTRACT')}>
        {/*TODO: show tarifa a contractar */}
      </LabelFieldRow>
    </div>
  )
}

export default IndexadaContractDetails

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginBottom: '0.5rem'
  },
  highlight: {
    color:  theme.palette.text.primary
  }
}))
