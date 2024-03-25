import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import loading from '../images/loading.svg'

const useStyles = makeStyles((theme) => ({
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
}))

const Loading = () => {
  const classes = useStyles()

  return (
    <div data-testid={'loading-component'} className={classes.loading}>
      <img alt="Loading..." src={loading} />
    </div>
  )
}

export default Loading
