import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Header from 'components/oficinavirtual/Header'
import Card from 'components/oficinavirtual/Card'

const IndexedInfo = ({ title, desc }) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      {title ? <Header>{title}</Header> : null}
      {desc ? (
        <Card>
          <div
            dangerouslySetInnerHTML={{
              __html: desc
            }}
          />
        </Card>
      ) : null}
    </div>
  )
}

export default IndexedInfo

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    color: theme.palette.text.primary
  }
}))
