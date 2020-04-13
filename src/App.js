import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import { createMuiTheme, ThemeProvider, makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'

import './i18n/i18n'

import './App.css'
import 'typeface-roboto'

import Contract from './containers/Contract'
import HolderChange from './containers/HolderChange'
import ModifyContract from './containers/ModifyContract'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#bac92a'
    },
    secondary: {
      main: '#8a8990'
    },
    contrastThreshold: 3,
    tonalOffset: 0.2
  }
})

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary
  }
}))

const App = () => {
  const classes = useStyles()

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <Grid container>
          <Grid item xs={12}>
            <Router>
              <Switch>
                <Route exact path="/" component={Contract} />
                <Route path="/new-contract" component={Contract} />
                <Route path="/modify-contract" component={ModifyContract} />
                <Route path="/holder-change" component={HolderChange} />
              </Switch>
            </Router>
          </Grid>
        </Grid>
      </div>
    </ThemeProvider>
  )
}

export default App
