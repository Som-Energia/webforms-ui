import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'

import Card from 'components/oficinavirtual/Card'

const IndexadaIntro = () => {
  const classes = useStyles()
  const { t } = useTranslation()
  return (
    <div className={classes.root}>
      <Card>
        <div
          dangerouslySetInnerHTML={{
            __html: t('INDEXADA_INTRO_BODY', {
              url_general_conditions: t('GENERAL_CONDITIONS_URL')
            })
          }}
        />
      </Card>
    </div>
  )
}

export default IndexadaIntro

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    color: theme.palette.text.primary
  }
}))
