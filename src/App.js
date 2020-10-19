import React, { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { GlobalHotKeys } from 'react-hotkeys'

import { createMuiTheme, ThemeProvider, makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'

import Loading from './components/Loading'

import './i18n/i18n'

import './App.css'

// import HolderChange from './containers/HolderChange'
// import ModifyContract from './containers/ModifyContract'

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

  const loadModifyContract = (props) => {
    const ModifyContract = lazy(() => import('./containers/ModifyContract'))
    return <ModifyContract {...props} token={token} />
  }

  return (
    <ThemeProvider theme={theme}>
      <GlobalHotKeys keyMap={keyMap}>
        <div className={classes.root}>
          <Suspense fallback ={<Loading />}>
            <Router>
              <Switch>
                <Route exact path="/" component={ lazy(() => import('./containers/Contract')) } />

                <Route exact path="/modify-contract" render={loadModifyContract} />
                <Route path="/:language/contract/modification/" render={loadModifyContract} />

                <Route path="/holder-change" component={lazy(() => import('./containers/HolderChange'))} />
                <Route path="/:language/change-ownership/" component={lazy(() => import('./containers/HolderChange'))} />

                <Route exact path="/contract" component={ lazy(() => import('./containers/Contract')) } />
                <Route path="/:language/contracta-la-llum/" component={lazy(() => import('./containers/Contract'))} />

                <Route path="/new-member" component={lazy(() => import('./containers/Member'))} />
                <Route path="/:language/fes-te-n-soci-a/" component={lazy(() => import('./containers/Member'))} />
                <Route path="/:language/hazte-socio-a/" component={lazy(() => import('./containers/Member'))} />
                <Route path="/:language/izan-zaitez-bazkide/" component={lazy(() => import('./containers/Member'))} />
                <Route path="/:language/faite-socio-a/" component={lazy(() => import('./containers/Member'))} />
              </Switch>
            </Router>
          </Suspense>
        </div>
      </GlobalHotKeys>
    </ThemeProvider>
  )
}

export default App
