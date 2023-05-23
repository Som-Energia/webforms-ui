import React from 'react'

import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'

import Box from '@material-ui/core/Box'

import Chooser from '../../components/Chooser'
import StepHeader from '../../components/StepHeader'
import Typography from '@material-ui/core/Typography'

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
              label: props.values.contract.moreThan15Kw?
                t('TARIFF_MODE_PERIODS_30TD_LABEL') : t('TARIFF_MODE_PERIODS_20TD_LABEL'),
              description: props.values.contract.moreThan15Kw?
                t('TARIFF_MODE_PERIODS_30TD_DESC', {
                  prices_url: t(
                    'TARIFF_MODE_30TD_PRICES_URL'
                  ),
                  periods_url: t(
                    'TARIFF_MODE_30TD_PERIODS_URL'
                  )
                })
                :
                t('TARIFF_MODE_PERIODS_20TD_DESC', {
                  prices_url: t(
                    'TARIFF_MODE_20TD_PRICES_URL'
                  ),
                  periods_url: t(
                    'TARIFF_MODE_20TD_PERIODS_URL'
                  )
                })
            },
            {
              value: true,
              label: props.values.contract.moreThan15Kw?
                t('TARIFF_MODE_INDEXED_30TD_LABEL') : t('TARIFF_MODE_INDEXED_20TD_LABEL'),
              description: t('TARIFF_MODE_INDEXED_DESC', {
                indexed_url: t(
                  'TARIFF_MODE_INDEXED_URL'
                )
              })
            }
          ]}
        />
      </Box>
      <Typography
        variant="body1"
        dangerouslySetInnerHTML={{ __html: t('TARIFF_MODE_TARIFF_COMPARISON', {
          tariff_comparison_url: t(
            'TARIFF_MODE_TARIFF_COMPARISON_URL'
          )})
        }}
      />
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
