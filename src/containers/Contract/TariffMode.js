import React from 'react'

import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'

import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

import Chooser from '../../components/Chooser'
import StepHeader from '../../components/StepHeader'
import { FormHelperText } from '@material-ui/core'

const TariffMode = (props) => {
  const classes = useStyles()
  const { t } = useTranslation()

  const handleChange = ({ option }) => {
    props.setFieldValue('contract.isIndexed', option)
  }

  return (
    <>
      <StepHeader title={t('TARIFF_MODE_TITLE')} />
      <Box mt={3} mb={2}>
        <Chooser
          className={classes.chooserQuestion}
          question={t('TARIFF_MODE_QUESTION')}
          onChange={handleChange}
          value={props.values.contract.isIndexed}
          canBeEmpty={false}
          options={[
            {
              value: false,
              label: t('TARIFF_MODE_PERIODS_LABEL'),
              description: t('TARIFF_MODE_PERIODS_DESC')
            },
            {
              value: true,
              label: t('TARIFF_MODE_INDEXED_LABEL'),
              description: t('TARIFF_MODE_INDEXED_DESC')
            }
          ]}
        />
      </Box>
    </>
  )
}

export default TariffMode

const useStyles = makeStyles((theme) => ({
  chooserQuestion: {
    '& h6': {
      fontWeight: 400
    },
    '& label': {
      minHeight: '80px'
    }
  }
}))
