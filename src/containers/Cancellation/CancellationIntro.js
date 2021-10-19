import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'

import Header from '../../components/oficinavirtual/Header'
import Card from '../../components/oficinavirtual/Card'

const CancellationIntro = () => {
  const classes = useStyles()
  const { t } = useTranslation()
  return (
    <div className={classes.root}>
      <Header>{t('CANCELLATION_INTRO_TITLE')}</Header>
      <Card>
        <div
          dangerouslySetInnerHTML={{
            __html: t('CANCELLATION_INTRO_BODY', {
              url_new: t('FAQ_ALTA_SUMINISTRAMENT_URL'),
              url_holderchange: t('FAQ_HOLDERCHANGE_URL')
            })
          }}
        />
      </Card>
    </div>
  )
}

export default CancellationIntro

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    color: theme.palette.text.primary
  },
  actionsContainer: {
    display: 'flex',
    justifyContent: 'space-between'
  }
}))
