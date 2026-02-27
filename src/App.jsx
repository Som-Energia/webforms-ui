import React, { lazy, useMemo } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Box from '@mui/material/Box'

import OldWebFormsTheme from './themes/webforms_old'
import WebFormsTheme from './themes/webforms'
import ApiStatus from './components/ApiStatus'

import './i18n/i18n'
import './App.css'
import { GenerationContextProvider } from './containers/Generation/context/GenerationContext'
import { PopUpContextProvider } from './context/PopUpContext'
import { MatomoProvider } from './trackers/matomo/MatomoProvider'
import { LoadingContextProvider } from './context/LoadingContext'
import { SummaryContextProvider } from './context/SummaryContext'
import { AvailabilityContextProvider } from './context/AvailabilityContext'
import { useTranslation } from 'react-i18next'

import Typography from '@mui/material/Typography'
import UnifiedContractForm from './containers/UnifiedContractForm'
import ThemeWrapper from './themes/ThemeWrapper'

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
  const IndexedDailyPrices = lazy(() => import('./containers/IndexedDailyPrices'))
  const Generation = lazy(() => import('./containers/Generation'))
  const GenerationContribution = lazy(() =>
    import('./containers/Generation/GenerationForm/GenerationForm')
  )
  const GurbFormRequirements = lazy(() => import('./containers/Gurb/GurbFormRequirements'))
  const GurbFormJoin = lazy(() => import('./containers/Gurb/GurbFormJoin'))
  const NewContractMemberForm = lazy(() =>
    import('./containers/NewContractMember/NewContractMember')
  )
  const NewMemberForm = lazy(() => import('./containers/NewMember/NewMember'))
  const Result = lazy(() => import('./containers/Result'))
  const GurbContractPaymentSuccessful = lazy(() => import('./containers/Gurb/pages/Gurb/GurbContractPaymentSuccessful'))

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

  const oldWebFormsTheme = React.useMemo(() => OldWebFormsTheme(), [])
  const webFormsTheme = React.useMemo(() => WebFormsTheme(), [])

  return (
    <>
      <AvailabilityContextProvider>
        <MatomoProvider>
          <Box sx={{ flexGrow: 1 }}>
            <Router future={{
              v7_startTransition: true,
            }}>
              <Routes>
                <Route exact path="/" element={
                  <ThemeWrapper theme={oldWebFormsTheme}>
                    <Home {...props} />
                  </ThemeWrapper>
                } />

                <Route exact path="/tariff" element={<Tariff {...props} />} />

                <Route
                  exact
                  path="/modify-contract"
                  element={
                    <ThemeWrapper theme={oldWebFormsTheme}>
                      <ModifyContract {...props} token={token} />
                    </ThemeWrapper>
                  }
                />
                <Route
                  path="/:language/contract/modification/"
                  element={
                    <ThemeWrapper theme={oldWebFormsTheme}>
                      <ModifyContract {...props} token={token} />
                    </ThemeWrapper>
                  }
                />

                <Route
                  path="/holder-change"
                  element={
                    <ThemeWrapper theme={oldWebFormsTheme}>
                      <HolderChange {...props} />
                    </ThemeWrapper>
                  }
                />
                <Route
                  path="/:language/change-ownership/"
                  element={
                    <ThemeWrapper theme={oldWebFormsTheme}>
                      <HolderChange {...props} />
                    </ThemeWrapper>
                  }
                />

                {
                  [
                    "/:language/serveis/tendencia-dels-preus",
                    "/:language/servicios/tendencia-de-los-precios",
                    "/:language/zerbitzuak/prezioen-joera",
                  ].map((url) =>
                    <Route
                      key={url}
                      path={url}
                      element={
                        <ThemeWrapper theme={webFormsTheme}>
                          <IndexedDailyPrices />
                        </ThemeWrapper>
                      }
                    />
                  )
                }


                <Route
                  path="/:language/investments/investments-kwh/"
                  element={
                    <ThemeWrapper theme={oldWebFormsTheme}>
                      <PopUpContextProvider>
                        <GenerationContextProvider
                          assignmentsJSON={assignmentsJSON}
                          investmentsJSON={investmentsJSON}
                          outsideAssignmentsJSON={outsideAssignmentsJSON}>
                          <Generation {...props} token={token} />
                        </GenerationContextProvider>
                      </PopUpContextProvider>
                    </ThemeWrapper>
                  }
                />

                <Route
                  path="/d1-detail"
                  element={
                    <ThemeWrapper theme={oldWebFormsTheme}>
                      <D1Detail {...props} templateProps={loadD1Data} />
                    </ThemeWrapper>
                  }
                />
                <Route
                  path="/:language/d1-detail"
                  element={
                    <ThemeWrapper theme={oldWebFormsTheme}>
                      <D1Detail {...props} templateProps={loadD1Data} />
                    </ThemeWrapper>
                  }
                />

                <Route
                  path="/:language/mail-subscriptions"
                  element={
                    <ThemeWrapper theme={oldWebFormsTheme}>
                      <MailSubscriptions
                        {...props}
                        mailLists={loadMailLists}
                      />
                    </ThemeWrapper>
                  }
                />

                <Route
                  path="/cancellation"
                  element={
                    <ThemeWrapper theme={oldWebFormsTheme}>
                      <Cancellation
                        {...props}
                        contract={loadContractData()}
                      />
                    </ThemeWrapper>
                  }
                />

                <Route
                  path="/:language/cancellation"
                  element={
                    <ThemeWrapper theme={oldWebFormsTheme}>
                      <Cancellation
                        {...props}
                        contract={loadContractData()}
                      />
                    </ThemeWrapper>
                  }
                />

                <Route
                  path="/cancellation/confirm"
                  element={
                    <ThemeWrapper theme={oldWebFormsTheme}>
                      <CancellationConfirm
                        {...props}
                        contract={loadContractData()}
                      />
                    </ThemeWrapper>
                  }
                />
                <Route
                  path="/:language/contract/:contract_id/confirm_cancellation/:token"
                  element={
                    <ThemeWrapper theme={oldWebFormsTheme}>
                      <CancellationConfirm
                        {...props}
                        contract={loadContractData()}
                      />
                    </ThemeWrapper>
                  }
                />

                <Route
                  path="/:language/contract/:contract_id/cancel"
                  element={
                    <ThemeWrapper theme={oldWebFormsTheme}>
                      <Cancellation
                        {...props}
                        contract={loadContractData()}
                      />
                    </ThemeWrapper>
                  }
                />

                {[
                  "/:language/aportaciones-capital-social/formulario",
                  "/:language/aportacions-capital-social/formulari",
                  "/:language/achegar-ao-capital-social/formulario",
                  "/:language/kapital-sozialerako-ekarpenak/formularioa"
                ].map((path) => (
                  <Route
                    key={path}
                    path={path}
                    element={
                      <ThemeWrapper theme={oldWebFormsTheme}>
                        <Contribution {...props} />
                      </ThemeWrapper>
                    }
                  />))}

                <Route
                  path="/:language/invoices/:invoice_id/payment_ko"
                  element={
                    <ThemeWrapper theme={oldWebFormsTheme}>
                      <Failure
                        showHeader={false}
                        {...props}
                        error={loadInvoicePaymentData()}
                      />
                    </ThemeWrapper>
                  }
                />
                <Route
                  path="/:language/invoices/:invoice_id/payment_ok"
                  element={
                    <ThemeWrapper theme={oldWebFormsTheme}>
                      <Success
                        showHeader={false}
                        {...props}
                        {...loadInvoicePaymentData()}
                      />
                    </ThemeWrapper>
                  }
                />
                <Route
                  path="/:language/contract/indexed"
                  element={
                    <ThemeWrapper theme={oldWebFormsTheme}>
                      <Indexed
                        {...props}
                        contract={loadContractData()}
                        isIndexedPilotOngoing={
                          isIndexedPilotOngoing !== undefined
                        }
                      />
                    </ThemeWrapper>
                  }
                />
                <Route
                  path="/contract/indexed"
                  element={
                    <ThemeWrapper theme={oldWebFormsTheme}>
                      <Indexed
                        {...props}
                        contract={loadContractData()}
                        isIndexedPilotOngoing={
                          isIndexedPilotOngoing !== undefined
                        }
                        checkEnabled={false}
                      />
                    </ThemeWrapper>
                  }
                />
                <Route
                  path="/:language/investments/investments-kwh/"
                  element={
                    <ThemeWrapper theme={oldWebFormsTheme}>
                      <PopUpContextProvider>
                        <GenerationContextProvider
                          assignmentsJSON={assignmentsJSON}
                          investmentsJSON={investmentsJSON}
                          outsideAssignmentsJSON={outsideAssignmentsJSON}>
                          <Generation {...props} token={token} />
                        </GenerationContextProvider>
                      </PopUpContextProvider>
                    </ThemeWrapper>
                  }
                />
                <Route
                  path="/investments/investments-kwh/"
                  element={
                    <ThemeWrapper theme={oldWebFormsTheme}>
                      <PopUpContextProvider>
                        <GenerationContextProvider
                          assignmentsJSON={assignmentsJSON}
                          investmentsJSON={investmentsJSON}
                          outsideAssignmentsJSON={outsideAssignmentsJSON}>
                          <Generation {...props} token={token} />
                        </GenerationContextProvider>
                      </PopUpContextProvider>
                    </ThemeWrapper>
                  }
                />

                <Route
                  path="/:language/servicios/produccion/generation-kwh-aportaciones/"
                  element={
                    <ThemeWrapper theme={oldWebFormsTheme}>
                      <GenerationContribution
                        {...props}
                        limitAmount={true}
                        token={token}
                      />
                    </ThemeWrapper>
                  }
                />
                <Route
                  path="/participar/"
                  element={
                    <ThemeWrapper theme={oldWebFormsTheme}>
                      <GenerationContribution
                        {...props}
                        limitAmount={true}
                        token={token}
                      />
                    </ThemeWrapper>
                  }
                />
                {[
                  '/:language/serveis/produccio/generation-kwh-aportacions',
                  '/:language/servicios/produccion/generation-kwh-aportaciones',
                  '/:language/servizos/producion/generation-kwh-achegar',
                  '/:language/zerbitzuak/ekoizpena/generation-kwh-formularioa'
                ].map((path) => (
                  <Route
                    key={path}
                    path={path}
                    element={
                      <ThemeWrapper theme={oldWebFormsTheme}>
                        <GenerationContribution
                          {...props}
                          limitAmount={true}
                          token={token}
                        />
                      </ThemeWrapper>
                    }
                  />
                ))}
                <Route
                  path="/participar-no-limit/"
                  element={
                    <ThemeWrapper theme={oldWebFormsTheme}>
                      <GenerationContribution
                        {...props}
                        limitAmount={false}
                        token={token}
                      />
                    </ThemeWrapper>
                  }
                />
                <Route
                  path="/:language/participar-no-limit/"
                  element={
                    <ThemeWrapper theme={oldWebFormsTheme}>
                      <GenerationContribution
                        {...props}
                        limitAmount={false}
                        token={token}
                      />
                    </ThemeWrapper>
                  }
                />
                <Route
                  path="/generationkwh/contribution/"
                  element={
                    <ThemeWrapper theme={oldWebFormsTheme}>
                      <GenerationContribution {...props} token={token} />
                    </ThemeWrapper>
                  }
                />
                {[
                  '/:language/pagament-realitzat',
                  '/:language/pago-realizado'
                ].map((path) => (
                  <Route
                    key={path}
                    path={path}
                    element={
                      <ThemeWrapper theme={webFormsTheme}>
                        <Result
                          mode={'success'}
                          {...props}
                          title={t('SUCCESS_TEXT')}
                          description={t('NEWMEMBER_OK_DESCRIPTION')}
                        />
                      </ThemeWrapper>
                    }
                  />
                ))}

                {[
                  '/:language/pagament-cancellat',
                  '/:language/pago-cancelado'
                ].map((path) => (
                  <Route
                    key={path}
                    path={path}
                    element={
                      <ThemeWrapper theme={webFormsTheme}>
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
                      </ThemeWrapper>
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
                    key={path}
                    path={path}
                    element={
                      <ThemeWrapper theme={webFormsTheme}>
                        <LoadingContextProvider>
                          <SummaryContextProvider>
                            <NewContractMemberForm
                              {...props}
                              tariff={'periods'}
                            />
                          </SummaryContextProvider>
                        </LoadingContextProvider>
                      </ThemeWrapper>
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
                    key={path}
                    path={path}
                    element={
                      <ThemeWrapper theme={webFormsTheme}>
                        <LoadingContextProvider>
                          <SummaryContextProvider>
                            <NewContractMemberForm
                              {...props}
                              tariff={'indexed'}
                            />
                          </SummaryContextProvider>
                        </LoadingContextProvider>
                      </ThemeWrapper>
                    }
                  />
                ))}
                {props?.isGurbEnabled && (
                  <Route
                    path="/:language/gurb/:gurbCode/requirements/"
                    element={
                      <ThemeWrapper theme={webFormsTheme}>
                        <PopUpContextProvider>
                          <LoadingContextProvider>
                            <SummaryContextProvider>
                              <GurbFormRequirements {...props} />
                            </SummaryContextProvider>
                          </LoadingContextProvider>
                        </PopUpContextProvider>
                      </ThemeWrapper>
                    }
                  />
                )}
                {props?.isGurbEnabled && (
                  <Route
                    path="/:language/gurb/:code/join/"
                    element={
                      <ThemeWrapper theme={webFormsTheme}>
                        <LoadingContextProvider>
                          <SummaryContextProvider>
                            <GurbFormJoin {...props} />
                          </SummaryContextProvider>
                        </LoadingContextProvider>
                      </ThemeWrapper>
                    }
                  />
                )}
                {props?.isGurbEnabled && (
                  <Route
                    path="/:language/gurb/gurb-url-ok"
                    element={
                      <ThemeWrapper theme={webFormsTheme}>
                        <LoadingContextProvider>
                          <SummaryContextProvider>
                            <GurbContractPaymentSuccessful {...props} />
                          </SummaryContextProvider>
                        </LoadingContextProvider>
                      </ThemeWrapper>
                    }
                  />
                )}
                {[
                  '/:language/landing/captacio',
                  '/:language/landing/captacion'
                ].map((path) => (
                  <Route
                    key={path}
                    path={path}
                    element={
                      <ThemeWrapper theme={webFormsTheme}>
                        <LoadingContextProvider>
                          <SummaryContextProvider>
                            <UnifiedContractForm {...props} />
                          </SummaryContextProvider>
                        </LoadingContextProvider>
                      </ThemeWrapper>
                    }
                  />
                ))}

                {[
                  '/:language/cooperativa/formulari-associar-se',
                  '/:language/cooperativa/formulario-asociarse',
                  '/:language/kooperatiba/bazkidetu-formularioa'
                ].map((path) => (
                  <Route
                    key={path}
                    path={path}
                    element={
                      <ThemeWrapper theme={webFormsTheme}>
                        <LoadingContextProvider>
                          <SummaryContextProvider>
                            <NewMemberForm {...props} />
                          </SummaryContextProvider>
                        </LoadingContextProvider>
                      </ThemeWrapper>
                    }
                  />
                ))}
              </Routes>
            </Router>
            <ApiStatus />
          </Box>
        </MatomoProvider>
      </AvailabilityContextProvider >
    </>
  )
}

export default App
