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

const App = (props) => {
  const { d1 = "" } = props
  let d1_token = ""
  const classes = useStyles()

  const loadModifyContract = (props) => {
    const ModifyContract = lazy(() => import('./containers/ModifyContract'))
    return <ModifyContract {...props} token={d1_token} />
  }

  const loadD1Detail = (props) => {
    const D1Detail = lazy(() => import('./containers/D1Detail'))

    let d1_data = {}
    if (typeof d1 === "string" && d1 !== "") {
      d1_data = JSON.parse(d1)
    }

    d1_token = d1_data?.token

    var templateProps = {
      token: d1_data?.token,
      installed_power: d1_data?.installed_power,
      cil: d1_data?.cil,
      installation_type: d1_data?.installation_type,
      subsection: d1_data?.subsection,
      cau: d1_data?.cau,
      collective: d1_data?.collective === "true",
      generator_technology: d1_data?.generator_technology,
      ssaa: d1_data?.ssaa === "true",
      register_section: d1_data?.register_section,
      to_validate: d1_data?.to_validate === "true",
      case_id: d1_data?.case_id,
    }

    return <D1Detail {...props} templateProps={templateProps} />
  }

  return (
    <ThemeProvider theme={theme}>
      <GlobalHotKeys keyMap={keyMap}>
        <div className={classes.root}>
          <Grid container>
            <Grid item xs={12}>
              <Suspense fallback ={<Loading />}>
                <Router>
                  <Switch>
                    <Route exact path="/" component={ lazy(() => import('./containers/Contract')) } />
                    <Route exact path="/modify-contract" render={loadModifyContract} />
                    <Route path="/:language/contract/modification/" render={loadModifyContract} />
                    <Route path="/holder-change" component={lazy(() => import('./containers/HolderChange'))} />
                    <Route path="/:language/change-ownership/" component={lazy(() => import('./containers/HolderChange'))} />
                    <Route exact path="/contract" component={ lazy(() => import('./containers/Contract')) } />
                    <Route path="/somsolet" component={lazy(() => import('./containers/SomSolet'))} />
                    <Route path="/d1-detail" render={loadD1Detail} />
                  </Switch>
                </Router>
              </Suspense>
            </Grid>
          </Grid>
        </div>
      </GlobalHotKeys>
    </ThemeProvider>
  )
}

export default App
