import React, { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import {
  createMuiTheme,
  ThemeProvider,
  makeStyles
} from '@material-ui/core/styles'

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
    backgroundColor: '#ffffff',
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

const App = (props) => {
  const classes = useStyles()
  const { d1 = '', token = '', cups = '' } = props

  const loadModifyContract = (props) => {
    const ModifyContract = lazy(() => import('./containers/ModifyContract'))
    return <ModifyContract {...props} token={token} />
  }

  const loadD1Detail = (props) => {
    const D1Detail = lazy(() => import('./containers/D1Detail'))

    const d1Data =
      typeof d1 === 'string' && d1 !== '' ? JSON.parse(d1) : undefined
    const cupsData =
      typeof cups === 'string' && cups !== '' ? JSON.parse(cups) : undefined
    const templateData =
      d1Data || cupsData ? { ...d1Data, ...cupsData } : undefined
    return <D1Detail {...props} templateProps={templateData} />
  }

  const loadSuccess = (props) => {
    const Success = lazy(() => import('./containers/Success'))
    return <Success {...props} description={'NEWMEMBER_OK_DESCRIPTION'} />
  }

  const loadFailure = (props) => {
    const Failure = lazy(() => import('./containers/Failure'))
    return <Failure {...props} />
  }

  const loadHome = () => {
    const Home = lazy(() => import('./containers/Home'))
    return <Home {...props} />
  }

  const loadTariff = (compProps) => {
    const Tariff = lazy(() => import('./containers/Tariff'))
    return <Tariff {...props} {...compProps} />
  }

  const loadCancellation = (compProps) => {
    const Cancellation = lazy(() => import('./containers/Cancellation'))
    return <Cancellation {...props} {...compProps} />
  }

  const loadContribution = (compProps) => {
    const Contribution = lazy(() => import('./containers/Contribution'))
    return <Contribution {...props} {...compProps} />
  }

  const loadMailSubscriptions = (props) => {
    const MailSubscriptions = lazy(() =>
      import('./containers/MailSubscriptions')
    )

    const mailListsData =
      typeof props.mailLists === 'string' && props.mailLists !== ''
        ? JSON.parse(props.mailLists)
        : []

    return <MailSubscriptions {...props} mailLists={mailListsData} />
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className={classes.root}>
        <Suspense fallback={<Loading />}>
          <Router>
            <Switch>
              <Route exact path="/" render={loadHome} />

              <Route
                exact
                path="/modify-contract"
                render={loadModifyContract}
              />
              <Route
                path="/:language/contract/modification/"
                render={loadModifyContract}
              />

              <Route
                path="/holder-change"
                component={lazy(() => import('./containers/HolderChange'))}
              />
              <Route
                path="/:language/change-ownership/"
                component={lazy(() => import('./containers/HolderChange'))}
              />

              <Route
                exact
                path="/contract"
                component={lazy(() => import('./containers/Contract'))}
              />
              <Route
                path="/:language/contracta-la-llum/"
                component={lazy(() => import('./containers/Contract'))}
              />
              <Route
                path="/:language/contrata-la-luz/"
                component={lazy(() => import('./containers/Contract'))}
              />
              <Route
                path="/:language/kontrata-ezazu-argia/"
                component={lazy(() => import('./containers/Contract'))}
              />
              <Route
                path="/:language/contrata-a-luz/"
                component={lazy(() => import('./containers/Contract'))}
              />

              <Route
                path="/new-member"
                component={lazy(() => import('./containers/Member'))}
              />
              <Route
                path="/:language/fes-te-n-soci-a/"
                component={lazy(() => import('./containers/Member'))}
              />
              <Route
                path="/:language/hazte-socio-a/"
                component={lazy(() => import('./containers/Member'))}
              />
              <Route
                path="/:language/izan-zaitez-bazkide/"
                component={lazy(() => import('./containers/Member'))}
              />
              <Route
                path="/:language/faite-socio-a/"
                component={lazy(() => import('./containers/Member'))}
              />

              <Route
                path="/somsolet"
                component={lazy(() => import('./containers/SomSolet'))}
              />
              <Route
                path="/:language/collective-purchases/"
                component={lazy(() => import('./containers/SomSolet'))}
              />

              <Route path="/d1-detail" render={loadD1Detail} />
              <Route path="/:language/d1-detail" render={loadD1Detail} />

              <Route
                path="/:language/pagament-realitzat"
                render={loadSuccess}
              />
              <Route path="/:language/pago-realizado" render={loadSuccess} />

              <Route
                path="/:language/pagament-cancellat"
                render={loadFailure}
              />
              <Route path="/:language/pago-cancelado" render={loadFailure} />

              <Route
                path="/:language/mail-subscriptions"
                render={loadMailSubscriptions}
              />

              <Route path="/cancellation" render={loadCancellation} />

              <Route path="/contribution" render={loadContribution} />

              <Route exact path="/tariff" render={loadTariff} />
              <Route
                path="/:language/tarifes-d-electricitat"
                render={loadTariff}
              />
              <Route
                path="/:language/tarifas-de-electricidad"
                render={loadTariff}
              />
              <Route
                path="/:language/elektrizitate-tarifak"
                render={loadTariff}
              />
              <Route
                path="/:language/tarifas-de-electricidade"
                render={loadTariff}
              />
            </Switch>
          </Router>
        </Suspense>
        <ApiStatus />
      </div>
    </ThemeProvider>
  )
}

export default App
