import React, { lazy, Suspense, useMemo, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Box from '@mui/material/Box'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

import SomEnergiaTheme from './components/SomenergiaTheme'
import WebFormsTheme from './themes/webforms'
import { Example as ComponentTest } from './components/ApiValidatedField.example'
import Loading from './components/NewLoading'
import ApiStatus from './components/ApiStatus'

import './i18n/i18n'
import './App.css'
import { GenerationContextProvider } from './containers/Generation/context/GenerationContext'
import { PopUpContextProvider } from './context/PopUpContext'
import { MatomoProvider } from './trackers/matomo/MatomoProvider'
import { GurbErrorContextProvider } from './context/GurbErrorContext'
import { GurbLoadingContextProvider } from './context/GurbLoadingContext'
import { SummaryContextProvider } from './context/SummaryContext'
import { AvailabilityContextProvider } from './context/AvailabilityContext'
import { useTranslation } from 'react-i18next'

import Typography from '@mui/material/Typography'

const App = (props) => {
  const { token = '', isIndexedPilotOngoing = undefined } = props
  const { t } = useTranslation()

  const Home = lazy(() => import('./containers/Home'))
  const Contribution = lazy(() => import('./containers/Contribution'))
  const Cancellation = lazy(() => import('./containers/Cancellation'))
  const CancellationConfirm = lazy(() =>
    import('./containers/CancellationConfirm')
  )
  const D1Detail = lazy(() => import('./containers/D1Detail'))
  const HolderChange = lazy(() => import('./containers/HolderChange'))
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
  const GurbForm = lazy(() => import('./containers/GurbForm'))
  const GurbFormValidations = lazy(() => import('./containers/GurbFormValidations'))
  const GurbFormJoin = lazy(() => import('./containers/GurbFormJoin'))
  const NewContractMemberForm = lazy(() =>
    import('./containers/NewContractMember/NewContractMember')
  )
  const NewMemberForm = lazy(() => import('./containers/NewMember'))
  const Result = lazy(() => import('./containers/Result'))

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
  const outsideAssignmentsJSON = useMemo(() => {
    const outsideAssignments = document.getElementById(
      'outside-assignments-data'
    )
    return outsideAssignments ? JSON.parse(outsideAssignments.textContent) : {}
  }, [])

  const webFormsTheme = React.useMemo(() => WebFormsTheme(), [])

  return (
    <>
      <AvailabilityContextProvider>
        <MatomoProvider>
          <Box sx={{ flexGrow: 1 }}>
            <ThemeProvider theme={webFormsTheme}>
              <Suspense fallback={<Loading />}>
                <Router>
                  <CssBaseline />
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
                      path="/:language/investments/investments-kwh/"
                      element={
                        <PopUpContextProvider>
                          <GenerationContextProvider
                            assignmentsJSON={assignmentsJSON}
                            investmentsJSON={investmentsJSON}
                            outsideAssignmentsJSON={outsideAssignmentsJSON}>
                            <Generation {...props} token={token} />
                          </GenerationContextProvider>
                        </PopUpContextProvider>
                      }
                    />

                    <Route
                      path="/d1-detail"
                      element={
                        <D1Detail {...props} templateProps={loadD1Data} />
                      }
                    />
                    <Route
                      path="/:language/d1-detail"
                      element={
                        <D1Detail {...props} templateProps={loadD1Data} />
                      }
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
                        <MailSubscriptions
                          {...props}
                          mailLists={loadMailLists}
                        />
                      }
                    />

                    <Route
                      path="/cancellation"
                      element={
                        <Cancellation
                          {...props}
                          contract={loadContractData()}
                        />
                      }
                    />

                    <Route
                      path="/:language/cancellation"
                      element={
                        <Cancellation
                          {...props}
                          contract={loadContractData()}
                        />
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
                        <Cancellation
                          {...props}
                          contract={loadContractData()}
                        />
                      }
                    />

                    {[
                      "/:language/aportaciones-capital-social/formulario",
                      "/:language/aportacions-capital-social/formulari",
                      "/:language/achegar-ao-capital-social/formulario",
                      "/:language/kapital-sozialerako-ekarpenak/formularioa"
                    ].map((path) => (
                      <Route
                        path={path}
                        element={<Contribution {...props} />}
                      />))}

                    <Route
                      exact
                      path="/tariff"
                      element={<Tariff {...props} />}
                    />
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
                            investmentsJSON={investmentsJSON}
                            outsideAssignmentsJSON={outsideAssignmentsJSON}>
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
                            investmentsJSON={investmentsJSON}
                            outsideAssignmentsJSON={outsideAssignmentsJSON}>
                            <Generation {...props} token={token} />
                          </GenerationContextProvider>
                        </PopUpContextProvider>
                      }
                    />

                    <Route
                      path="/:language/servicios/produccion/generation-kwh-aportaciones/"
                      element={
                        <GenerationContribution
                          {...props}
                          limitAmount={true}
                          token={token}
                        />
                      }
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
                    {[
                      '/:language/serveis/produccio/generation-kwh-aportacions',
                      '/:language/servicios/produccion/generation-kwh-aportaciones',
                      '/:language/servizos/producion/generation-kwh-achegar',
                      '/:language/zerbitzuak/ekoizpena/generation-kwh-formularioa'
                    ].map((path) => (
                      <Route
                        path={path}
                        element={
                          <GenerationContribution
                            {...props}
                            limitAmount={true}
                            token={token}
                          />
                        }
                      />
                    ))}
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
                      element={
                        <GenerationContribution {...props} token={token} />
                      }
                    />
                    {props?.isGurbEnabled && (
                      <Route
                        path="/:language/gurb/:id/deprecated/"
                        element={
                          <GurbErrorContextProvider>
                            <GurbLoadingContextProvider>
                              <SummaryContextProvider>
                                <GurbForm {...props} />
                              </SummaryContextProvider>
                            </GurbLoadingContextProvider>
                          </GurbErrorContextProvider>
                        }
                      />
                    )}
                    {props?.isGurbEnabled && (
                      <Route
                        path="/:language/gurb/:id/validations/"
                        element={
                          <GurbErrorContextProvider>
                            <GurbLoadingContextProvider>
                              <SummaryContextProvider>
                                <GurbFormValidations {...props} />
                              </SummaryContextProvider>
                            </GurbLoadingContextProvider>
                          </GurbErrorContextProvider>
                        }
                      />
                    )}
                    {props?.isGurbEnabled && (
                      <Route
                        path="/:language/gurb/:id/join/"
                        element={
                          <GurbErrorContextProvider>
                            <GurbLoadingContextProvider>
                              <SummaryContextProvider>
                                <GurbFormJoin {...props} />
                              </SummaryContextProvider>
                            </GurbLoadingContextProvider>
                          </GurbErrorContextProvider>
                        }
                      />
                    )}
                    {[
                      '/:language/new-pagament-realitzat',
                      '/:language/new-pago-realizado'
                    ].map((path) => (
                      <Route
                        key={path}
                        path={path}
                        element={
                          <Result
                            mode={'success'}
                            {...props}
                            title={t('SUCCESS_TEXT')}
                            description={t('NEWMEMBER_OK_DESCRIPTION')}
                          />
                        }
                      />
                    ))}

                    {[
                      '/:language/new-pagament-cancellat',
                      '/:language/new-pago-cancelado'
                    ].map((path) => (
                      <Route
                        key={path}
                        path={path}
                        element={
                          <Result
                            mode="failure"
                            title={t('FAILURE_TEXT')}
                            {...props}>
                            <Typography
                              sx={{ color: 'secondary.extraDark' }}
                              dangerouslySetInnerHTML={{
                                __html: t('NEWMEMBER_KO_DESCRIPTION', {
                                  url: t('CONTACT_HELP_URL')
                                })
                              }}
                            />
                          </Result>
                        }
                      />
                    ))}

                    {[
                      '/:language/formulario-contratacion-periodos',
                      '/:language/formulari-contractacio-periodes',
                      '/:language/formulario-contrato-periodos',
                      '/:language/kontratazio-formularioa-ordutegitarteak'
                    ].map((path) => (
                      <Route
                        path={path}
                        element={
                          <GurbLoadingContextProvider>
                            <SummaryContextProvider>
                              <NewContractMemberForm
                                {...props}
                                tariff={'periods'}
                              />
                            </SummaryContextProvider>
                          </GurbLoadingContextProvider>
                        }
                      />
                    ))}
                    {[
                      '/:language/formulario-contratacion-indexada',
                      '/:language/formulari-contractacio-indexada',
                      '/:language/formulario-contrato-indexada',
                      '/:language/kontratazio-formularioa-indexatua'
                    ].map((path) => (
                      <Route
                        path={path}
                        element={
                          <GurbLoadingContextProvider>
                            <SummaryContextProvider>
                              <NewContractMemberForm
                                {...props}
                                tariff={'indexed'}
                              />
                            </SummaryContextProvider>
                          </GurbLoadingContextProvider>
                        }
                      />
                    ))}

                    {[
                      '/:language/cooperativa/formulari-associar-se',
                      '/:language/cooperativa/formulario-asociarse',
                      '/:language/kooperatiba/bazkidetu-formularioa'
                    ].map((path) => (
                      <Route
                        path={path}
                        element={
                          <GurbErrorContextProvider>
                            <GurbLoadingContextProvider>
                              <SummaryContextProvider>
                                <NewMemberForm {...props} />
                              </SummaryContextProvider>
                            </GurbLoadingContextProvider>
                          </GurbErrorContextProvider>
                        }
                      />
                    ))}
                  </Routes>
                </Router>
              </Suspense>
            </ThemeProvider>
            <ApiStatus />
          </Box>
        </MatomoProvider>
      </AvailabilityContextProvider>
    </>
  )
}

export default App
