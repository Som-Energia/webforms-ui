import React from 'react'
import { useHistory } from 'react-router-dom'
import preval from 'preval.macro'

import AppBar from '@material-ui/core/AppBar'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'

import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex'
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(12)
  },
  formPaper: {
    padding: theme.spacing(3),
    marginTop: theme.spacing(3),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    '& h6': {
      fontSize: '1rem'
    }
  },
  build: {
    fontSize: '0.85rem',
    fontWeight: '500'
  }
}))

const options = [
  { title: 'Contractació', href: '/contract' },
  { title: 'Alta persona socia', href: '/new-member' },
  { title: 'Canvi de titular', href: '/holder-change' },
  { title: 'Modificació contractual', href: '/modify-contract' },
  { title: 'Acceptació/Rebuig D1', href: '/d1-detail' }
]

const Home = (props) => {
  const { version } = props
  const classes = useStyles()
  const history = useHistory()

  const dateTimeStamp = preval`module.exports = new Date().toLocaleString();`

  return (
    <>
      <AppBar position="fixed" color="inherit" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6">
            webforms-ui
            <span className={classes.subtitle}>Nous Peatges Edition</span>
          </Typography>
        </Toolbar>
      </AppBar>
      <Container className={classes.content}>
        <div className={classes.build}>Build date: {dateTimeStamp}</div>
        <div className={classes.build}>Last commit hash: {version}</div>
        {options.map((option) => (
          <Paper
            key={option.href}
            className={classes.formPaper}
            onClick={() => {
              history.push(option.href)
            }}>
            <Typography variant="h6">{option.title}</Typography>
            <ArrowForwardIosIcon />
          </Paper>
        ))}
      </Container>
    </>
  )
}

export default Home
