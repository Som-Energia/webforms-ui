import clsx from 'clsx'
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles((theme) => ({
  field: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(0.8),
    '& .field__value': {
      flexGrow: 1
    }
  },
  label: {
    textTransform: 'uppercase',
    paddingRight: '12px',
    fontSize: '13px',
    fontWeight: 400,
    color: 'rgba(0, 0, 0, 0.54)'
  },
  value: {
    fontSize: '13px'
  }
}))



const ReviewField = ({ label, value }) => {
  const classes = useStyles()
  return (
    <div className={clsx(classes.field)} >
      {label !== false && (
        <div className="field__title">
          <Typography className={classes.label} variant="subtitle2">
            <>{label}</>
          </Typography>
        </div>
      )}
      <div className={clsx('field__value')}>
        <Typography id={label+'__value'} className={classes.value} variant="body2">
          <>{value}</>
        </Typography>
      </div>
    </div>
  )
}

export default ReviewField
