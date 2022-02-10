import React, { lazy, Suspense } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from 'react-router-dom'

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
    background: { default: 'transparent', paper: '#ffffff' },
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
  const { token = '' } = props

  const Home = lazy(() => import('./containers/Home'))
  const Contract = lazy(() => import('./containers/Contract'))
  const Contribution = lazy(() => import('./containers/Contribution'))
  const Cancellation = lazy(() => import('./containers/Cancellation'))
  const D1Detail = lazy(() => import('./containers/D1Detail'))
  const HolderChange = lazy(() => import('./containers/HolderChange'))
  const Member = lazy(() => import('./containers/Member'))
  const Failure = lazy(() => import('./containers/Failure'))
  const Success = lazy(() => import('./containers/Success'))
  const ModifyContract = lazy(() => import('./containers/ModifyContract'))
  const Tariff = lazy(() => import('./containers/Tariff'))
  const MailSubscriptions = lazy(() => import('./containers/MailSubscriptions'))
  const SomSolet = lazy(() => import('./containers/SomSolet'))

  const loadContractData = () => {
    const contractData =
      typeof props.contract === 'string' && props.contract !== ''
        ? JSON.parse(props.contract)
        : []

    return contractData
  }

  const loadD1Data = () => {
    const d1Data =
      typeof props.d1 === 'string' && props.d1 !== ''
        ? JSON.parse(props.d1)
        : {}
    const cupsData =
      typeof props.cups === 'string' && props.cups !== ''
        ? JSON.parse(props.cups)
        : {}
    return { ...d1Data, ...cupsData }
  }

  const loadMailLists = () => {
    const mailListsData =
      typeof props.mailLists === 'string' && props.mailLists !== ''
        ? JSON.parse(props.mailLists)
        : []

    return mailListsData
  }

  const loadInvoicePaymentData = () => {
    const data =
      typeof props.invoicePayment === 'string' && props.invoicePayment !== ''
        ? JSON.parse(props.invoicePayment)
        : {}
    return data
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
                  element={<HolderChange {...props} />}
                />
                <Route
                  path="/:language/change-ownership/"
                  element={<HolderChange {...props} />}
                />

                <Route
                  exact
                  path="/contract"
                  element={<Contract {...props} />}
                />
                <Route
                  path="/:language/contracta-la-llum/"
                  element={<Contract {...props} />}
                />
                <Route
                  path="/:language/contrata-la-luz/"
                  element={<Contract {...props} />}
                />
                <Route
                  path="/:language/kontrata-ezazu-argia/"
                  element={<Contract {...props} />}
                />
                <Route
                  path="/:language/contrata-a-luz/"
                  element={<Contract {...props} />}
                />

                <Route
                  path="/:language/contract-30/"
                  element={<Contract is30ContractEnabled={true} {...props} />}
                />

                <Route path="/new-member" element={<Member {...props} />} />

                <Route
                  path="/:language/fes-te-n-soci-a/"
                  element={<Member {...props} />}
                />
                <Route
                  path="/:language/hazte-socio-a/"
                  element={<Member {...props} />}
                />
                <Route
                  path="/:language/izan-zaitez-bazkide/"
                  element={<Member {...props} />}
                />
                <Route
                  path="/:language/faite-socio-a/"
                  element={<Member {...props} />}
                />

                <Route path="/somsolet" element={<SomSolet {...props} />} />
                <Route
                  path="/:language/collective-purchases/"
                  element={<SomSolet {...props} />}
                />

                <Route
                  path="/d1-detail"
                  element={<D1Detail {...props} templateProps={loadD1Data} />}
                />
                <Route
                  path="/:language/d1-detail"
                  element={<D1Detail {...props} templateProps={loadD1Data} />}
                />

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
                  element={
                    <MailSubscriptions {...props} mailLists={loadMailLists} />
                  }
                />

                <Route
                  path="/cancellation"
                  element={
                    <Cancellation {...props} contract={loadContractData} />
                  }
                />
                <Route
                  path="/:language/cancel"
                  element={
                    <Cancellation {...props} contract={loadContractData} />
                  }
                />

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
                <Route
                  path="/:language/invoices/:invoice_id/payment_ko"
                  element={
                    <Failure
                      showTitle={false}
                      {...props}
                      error={loadInvoicePaymentData()}
                    />
                  }
                />
                <Route
                  path="/:language/invoices/:invoice_id/payment_ok"
                  element={
                    <Success
                      showTitle={false}
                      {...props}
                      {...loadInvoicePaymentData()}
                    />
                  }
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
