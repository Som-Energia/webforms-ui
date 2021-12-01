import React, { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import {
  createTheme,
  ThemeProvider,
  makeStyles
} from '@material-ui/core/styles'

import ScopedCssBaseline from '@material-ui/core/ScopedCssBaseline'

import Loading from './components/Loading'
import ApiStatus from './components/ApiStatus'

import './i18n/i18n'
import './App.css'

const theme = createTheme({
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

  const Home = lazy(() => import('./containers/Home'))

  const Contribution = lazy(() => import('./containers/Contribution'))
  const Failure = lazy(() => import('./containers/Failure'))
  const Success = lazy(() => import('./containers/Success'))
  const ModifyContract = lazy(() => import('./containers/ModifyContract'))
  const Tariff = lazy(() => import('./containers/Tariff'))

  const loadCancellation = (compProps) => {
    const Cancellation = lazy(() => import('./containers/Cancellation'))
    const contractData =
      typeof props.contract === 'string' && props.contract !== ''
        ? JSON.parse(props.contract)
        : []

    return <Cancellation {...props} {...compProps} contract={contractData} />
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
      <ScopedCssBaseline>
        <div className={classes.root}>
          <Suspense fallback={<Loading />}>
            <Router>
              <Routes>
                <Route exact path="/" element={<Home {...props} />} />

                <Route
                  exact
                  path="/modify-contract"
                  element={<ModifyContract {...props} token={token} />}
                />
                <Route
                  path="/:language/contract/modification/"
                  element={<ModifyContract {...props} token={token} />}
                />

                <Route
                  path="/holder-change"
                  element={lazy(() => import('./containers/HolderChange'))}
                />
                <Route
                  path="/:language/change-ownership/"
                  element={lazy(() => import('./containers/HolderChange'))}
                />

                <Route
                  exact
                  path="/contract"
                  element={lazy(() => import('./containers/Contract'))}
                />
                <Route
                  path="/:language/contracta-la-llum/"
                  element={lazy(() => import('./containers/Contract'))}
                />
                <Route
                  path="/:language/contrata-la-luz/"
                  element={lazy(() => import('./containers/Contract'))}
                />
                <Route
                  path="/:language/kontrata-ezazu-argia/"
                  element={lazy(() => import('./containers/Contract'))}
                />
                <Route
                  path="/:language/contrata-a-luz/"
                  element={lazy(() => import('./containers/Contract'))}
                />

                <Route
                  path="/new-member"
                  element={lazy(() => import('./containers/Member'))}
                />
                <Route
                  path="/:language/fes-te-n-soci-a/"
                  element={lazy(() => import('./containers/Member'))}
                />
                <Route
                  path="/:language/hazte-socio-a/"
                  element={lazy(() => import('./containers/Member'))}
                />
                <Route
                  path="/:language/izan-zaitez-bazkide/"
                  element={lazy(() => import('./containers/Member'))}
                />
                <Route
                  path="/:language/faite-socio-a/"
                  element={lazy(() => import('./containers/Member'))}
                />

                <Route
                  path="/somsolet"
                  element={lazy(() => import('./containers/SomSolet'))}
                />
                <Route
                  path="/:language/collective-purchases/"
                  element={lazy(() => import('./containers/SomSolet'))}
                />

                <Route path="/d1-detail" render={loadD1Detail} />
                <Route path="/:language/d1-detail" render={loadD1Detail} />

                <Route
                  path="/:language/pagament-realitzat"
                  element={
                    <Success
                      {...props}
                      description={'NEWMEMBER_OK_DESCRIPTION'}
                    />
                  }
                />
                <Route
                  path="/:language/pago-realizado"
                  element={
                    <Success
                      {...props}
                      description={'NEWMEMBER_OK_DESCRIPTION'}
                    />
                  }
                />

                <Route
                  path="/:language/pagament-cancellat"
                  element={<Failure {...props} />}
                />
                <Route
                  path="/:language/pago-cancelado"
                  element={<Failure {...props} />}
                />

                <Route
                  path="/:language/mail-subscriptions"
                  render={loadMailSubscriptions}
                />

                <Route path="/cancellation" render={loadCancellation} />
                <Route path="/:language/cancel" render={loadCancellation} />

                <Route
                  path="/contribution"
                  element={<Contribution {...props} />}
                />
                <Route
                  path="/:language/contribution"
                  element={<Contribution {...props} />}
                />
                <Route
                  path="/:language/produeix-energia-renovable/aporta-al-capital-social"
                  element={<Contribution {...props} />}
                />
                <Route
                  path="/:language/produce-energia-renovable/aporta-al-capital-social"
                  element={<Contribution {...props} />}
                />
                <Route
                  path="/:language/produce-energia-renovable/egin-zure-ekarpena-kapital-sozialean"
                  element={<Contribution {...props} />}
                />
                <Route
                  path="/:language/produce-energia-renovable/achegar-ao-capital-social"
                  element={<Contribution {...props} />}
                />

                <Route exact path="/tariff" element={<Tariff {...props} />} />
                <Route
                  path="/:language/tarifes-d-electricitat"
                  element={<Tariff {...props} />}
                />
                <Route
                  path="/:language/tarifas-de-electricidad"
                  element={<Tariff {...props} />}
                />
                <Route
                  path="/:language/elektrizitate-tarifak"
                  element={<Tariff {...props} />}
                />
                <Route
                  path="/:language/tarifas-de-electricidade"
                  element={<Tariff {...props} />}
                />
              </Routes>
            </Router>
          </Suspense>
          <ApiStatus />
        </div>
      </ScopedCssBaseline>
    </ThemeProvider>
  )
}

export default App
