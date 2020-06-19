import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { GlobalHotKeys } from 'react-hotkeys'

import { createMuiTheme, ThemeProvider, makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'

import './i18n/i18n'

import './App.css'

import HolderChange from './containers/HolderChange'
import ModifyContract from './containers/ModifyContract'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#96b633'
    },
    secondary: {
      main: '#a1a1a1'
    },
    contrastThreshold: 2,
    tonalOffset: 0.2
  },
  typography: {
    color: '#4d4d4d',
    htmlFontSize: 16
  },
  shape: {
    borderRadius: '0'
  }
})

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: '#4d4d4d'
  }
}))

const keyMap = {
  SAMPLE_DATA: 'ctrl+shift+1',
  SHOW_INSPECTOR: 'ctrl+shift+d'
}

const App = ({ token = '' }) => {
  const classes = useStyles()

  return (
    <ThemeProvider theme={theme}>
      <GlobalHotKeys keyMap={keyMap}>
        <div className={classes.root}>
          <Grid container>
            <Grid item xs={12}>
              <Router>
                <Switch>
                  <Route exact path="/" component={ModifyContract} />
                  <Route exact path="/modify-contract" render={(props) => <ModifyContract {...props} token={token} />} />
                  <Route path="/:language/contract/modification/" render={(props) => <ModifyContract {...props} token={token} />} />
                  <Route exact path="/holder-change" component={HolderChange} />
                </Switch>
              </Router>
            </Grid>
          </Grid>
        </div>
      </GlobalHotKeys>
    </ThemeProvider>
  )
}

export default App
