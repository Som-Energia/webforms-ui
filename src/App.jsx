import React, { lazy, Suspense, useMemo } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
//import { Test as ComponentTest } from './components/TextLoader'
import { Example as ComponentTest } from './components/ApiValidatedField.example'
import SomEnergiaTheme from './components/SomenergiaTheme'
import { createTheme, ThemeProvider } from '@mui/material/styles'

import CssBaseline from '@mui/material/CssBaseline'

import Loading from './components/Loading'
import ApiStatus from './components/ApiStatus'

import './i18n/i18n'
import './App.css'
import { GenerationContextProvider } from './containers/Generation/context/GenerationContext'
import { PopUpContextProvider } from './context/PopUpContext'
import Box from '@mui/material/Box'

const theme = createTheme({
  palette: {
    primary: {
      main: '#96b633'
    },
    secondary: {
      dark: '#000',
      main: '#a1a1a1'
    },
    dark: {
      main: '#750d0d'
    },
    lightFont: {
      main: '#fff'
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


const App = (props) => {
  const { token = '', isIndexedPilotOngoing = undefined } = props

  const Home = lazy(() => import('./containers/Home'))
  const Contract = lazy(() => import('./containers/Contract'))
  const Contribution = lazy(() => import('./containers/Contribution'))
  const Cancellation = lazy(() => import('./containers/Cancellation'))
  const CancellationConfirm = lazy(() =>
    import('./containers/CancellationConfirm')
  )
  const D1Detail = lazy(() => import('./containers/D1Detail'))
  const HolderChange = lazy(() => import('./containers/HolderChange'))
  const Member = lazy(() => import('./containers/Member'))
  const Failure = lazy(() => import('./containers/Failure'))
  const Success = lazy(() => import('./containers/Success'))
  const ModifyContract = lazy(() => import('./containers/ModifyContract'))
  const Tariff = lazy(() => import('./containers/Tariff'))
  const MailSubscriptions = lazy(() => import('./containers/MailSubscriptions'))
  const Indexed = lazy(() => import('./containers/Indexed'))
  const Generation = lazy(() => import('./containers/Generation'))
  const GenerationContribution = lazy(() =>
    import('./containers/Generation/GenerationForm/GenerationForm')
  )

  console.log("CONTRACT_PROPS", props)
  const loadContractData = () => {
    const contractData =
      typeof props.contract === 'string' && props.contract !== ''
        ? JSON.parse(props.contract)
        : []

    return { ...contractData }
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

  const assignmentsJSON = useMemo(() => {
    const assignments = document.getElementById('generation-assignments-data')
    return assignments ? JSON.parse(assignments.textContent) : {}
  }, [])
  const investmentsJSON = useMemo(() => {
    const investments = document.getElementById('generation-investments-data')
    return investments ? JSON.parse(investments.textContent) : {}
  }, [])
  const somtheme = React.useMemo(() => SomEnergiaTheme(), [])

  return (
    <ThemeProvider theme={somtheme}>
      <CssBaseline />
        <Box sx={{ flexGrow: 1 }}>
          <Suspense fallback={<Loading />}>
            <Router>
              <Routes>
                <Route exact path="/" element={<Home {...props} />} />

                <Route
                  exact
                  path="/:language/component-testing"
                  element={<ComponentTest {...props} />}
                />

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
                  element={<Contract {...props} />}
                />

                <Route
                  path="/:language/contract-20/"
                  element={<Contract is30ContractEnabled={false} {...props} />}
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
                    <Cancellation {...props} contract={loadContractData()} />
                  }
                />

                <Route
                  path="/:language/cancellation"
                  element={
                    <Cancellation {...props} contract={loadContractData()} />
                  }
                />

                <Route
                  path="/cancellation/confirm"
                  element={
                    <CancellationConfirm
                      {...props}
                      contract={loadContractData()}
                    />
                  }
                />
                <Route
                  path="/:language/contract/:contract_id/confirm_cancellation/:token"
                  element={
                    <CancellationConfirm
                      {...props}
                      contract={loadContractData()}
                    />
                  }
                />

                <Route
                  path="/:language/contract/:contract_id/cancel"
                  element={
                    <Cancellation {...props} contract={loadContractData()} />
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
                      showHeader={false}
                      {...props}
                      error={loadInvoicePaymentData()}
                    />
                  }
                />
                <Route
                  path="/:language/invoices/:invoice_id/payment_ok"
                  element={
                    <Success
                      showHeader={false}
                      {...props}
                      {...loadInvoicePaymentData()}
                    />
                  }
                />
                <Route
                  path="/:language/contract/indexed"
                  element={
                    <Indexed
                      {...props}
                      contract={loadContractData()}
                      isIndexedPilotOngoing={
                        isIndexedPilotOngoing !== undefined
                      }
                    />
                  }
                />
                <Route
                  path="/contract/indexed"
                  element={
                    <Indexed
                      {...props}
                      contract={loadContractData()}
                      isIndexedPilotOngoing={
                        isIndexedPilotOngoing !== undefined
                      }
                      checkEnabled={false}
                    />
                  }
                />
                <Route
                  path="/:language/investments/investments-kwh/"
                  element={
                    <PopUpContextProvider>
                      <GenerationContextProvider
                        assignmentsJSON={assignmentsJSON}
                        investmentsJSON={investmentsJSON}>
                        <Generation {...props} token={token} />
                      </GenerationContextProvider>
                    </PopUpContextProvider>
                  }
                />
                <Route
                  path="/investments/investments-kwh/"
                  element={
                    <PopUpContextProvider>
                      <GenerationContextProvider
                        assignmentsJSON={assignmentsJSON}
                        investmentsJSON={investmentsJSON}>
                        <Generation {...props} token={token} />
                      </GenerationContextProvider>
                    </PopUpContextProvider>
                  }
                />

                <Route
                  path="/:language/generationkwh/contribution/"
                  element={<GenerationContribution {...props} token={token} />}
                />
                <Route
                  path="/participar/"
                  element={
                    <GenerationContribution
                      {...props}
                      limitAmount={true}
                      token={token}
                    />
                  }
                />
                <Route
                  path="/:language/participar/"
                  element={
                    <GenerationContribution
                      {...props}
                      limitAmount={true}
                      token={token}
                    />
                  }
                />
                <Route
                  path="/participar-no-limit/"
                  element={
                    <GenerationContribution
                      {...props}
                      limitAmount={false}
                      token={token}
                    />
                  }
                />
                <Route
                  path="/:language/participar-no-limit/"
                  element={
                    <GenerationContribution
                      {...props}
                      limitAmount={false}
                      token={token}
                    />
                  }
                />
                <Route
                  path="/generationkwh/contribution/"
                  element={<GenerationContribution {...props} token={token} />}
                />
              </Routes>
            </Router>
          </Suspense>
          <ApiStatus />
        </Box>
    </ThemeProvider>
  )
}

export default App
