import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'

import Header from 'components/oficinavirtual/Header'
import Card from 'components/oficinavirtual/Card'

const IndexadaImportantInfo = () => {
  const classes = useStyles()
  const { t } = useTranslation()

  return (
    <div className={classes.root}>
      <Header>{t('INDEXADA_INTRO_TITLE')}</Header>
      <div className={classes.root}>
        <Card>
          <div
            dangerouslySetInnerHTML={{
              __html: t('INDEXADA_IMPORTANT_INFO_BODY', {
                url_indexada_help: t('TARIFF_INDEXADA_HELP_URL')
              })
            }}
          />
        </Card>
      </div>
    </div>
  )
}

export default IndexadaImportantInfo

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    color: theme.palette.text.primary
  }
}))
