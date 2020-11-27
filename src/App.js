import React, { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import { createMuiTheme, ThemeProvider, makeStyles } from '@material-ui/core/styles'

import CssBaseline from '@material-ui/core/CssBaseline'

import Loading from './components/Loading'
import ApiStatus from './components/ApiStatus'

import './i18n/i18n'
import './App.css'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#96b633'
    },
    secondary: {
      main: '#a1a1a1'
    },
    backgroundColor: '#fafafa',
    contrastThreshold: 2,
    tonalOffset: 0.2
  },
  typography: {
    htmlFontSize: 16
  },
  shape: {
    borderRadius: '0'
  },
  text: {
    primary: '#4d4d4d'
  },
  zIndex: {
    modal: 1600
  }
})

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  }
}))

const App = ({ token = '' }) => {
  const classes = useStyles()

  const loadModifyContract = (props) => {
    const ModifyContract = lazy(() => import('./containers/ModifyContract'))
    return <ModifyContract {...props} token={token} />
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
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
              <Route path="/:language/contrata-la-luz/" component={lazy(() => import('./containers/Contract'))} />
              <Route path="/:language/kontrata-ezazu-argia/" component={lazy(() => import('./containers/Contract'))} />
              <Route path="/:language/contrata-a-luz/" component={lazy(() => import('./containers/Contract'))} />

              <Route path="/new-member" component={lazy(() => import('./containers/Member'))} />
              <Route path="/:language/fes-te-n-soci-a/" component={lazy(() => import('./containers/Member'))} />
              <Route path="/:language/hazte-socio-a/" component={lazy(() => import('./containers/Member'))} />
              <Route path="/:language/izan-zaitez-bazkide/" component={lazy(() => import('./containers/Member'))} />
              <Route path="/:language/faite-socio-a/" component={lazy(() => import('./containers/Member'))} />

              <Route path="/somsolet" component={lazy(() => import('./containers/SomSolet'))} />
              <Route path="/:language/collective-purchases/" component={lazy(() => import('./containers/SomSolet'))} />
            </Switch>
          </Router>
        </Suspense>
        <ApiStatus />
      </div>
    </ThemeProvider>
  )
}

export default App
