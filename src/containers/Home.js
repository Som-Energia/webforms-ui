import React from 'react'
import { useNavigate } from 'react-router-dom'
import preval from 'preval.macro'

import AppBar from '@material-ui/core/AppBar'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'

import i18n from 'i18n/i18n'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    backgroundColor: '#f2f2f2'
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
  },
  subtitle: {
    fontSize: '0.9rem',
    textTransform: 'uppercase',
    paddingLeft: '10px'
  }
}))

let language = navigator.language
const availableLanguages = Object.keys(i18n?.options?.resources)
if (!availableLanguages.includes(language)) {
  language = 'ca'
}

const options = [
  { title: 'Acceptació/Rebuig D1', href: '/d1-detail' },
  { title: 'Component Testing', href:`/${language}/component-testing` },
  { title: 'Alta persona socia', href: '/new-member' },
  { title: 'Aportació al capital social', href: '/contribution' },
  { title: 'Baixa punt de suministrament', href: '/cancellation' },
  { title: 'Confirmament de baixa', href: '/cancellation/confirm' },
  { title: 'Canvi de titular', href: '/holder-change' },
  { title: 'Contractació', href: '/contract' },
  { title: 'Contractació 20', href: `${language}/contract-20` },
  { title: 'Contractació 30', href: '/contract-30' },
  { title: 'Modificació contractual', href: '/modify-contract' },
  { title: 'Modificació Tarifa Indexada', href: '/contract/indexed' },
]

const Home = (props) => {
  const { version } = props
  const classes = useStyles()
  const navigate = useNavigate()

  const dateTimeStamp = preval`module.exports = new Date().toLocaleString();`

  return (
    <Box className={classes.root}>
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
              navigate(option.href)
            }}>
            <Typography variant="h6">{option.title}</Typography>
            <ArrowForwardIosIcon />
          </Paper>
        ))}
      </Container>
    </Box>
  )
}

export default Home
