import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import loading from '../images/loading.svg'

const useStyles = makeStyles((theme) => ({
  loading: {}
}))

const Loading = () => {
  const classes = useStyles()

  return (
    <>
      <img className={classes.loading} alt="Loading..." src={loading} />
    </>
  )
}

export default Loading
