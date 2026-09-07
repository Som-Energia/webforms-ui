import { useContext, useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"

import { Grid2 as Grid } from "@mui/material"
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"

import { Formik } from "formik"

import NextButton from "../../components/Buttons/NextButton"
import PrevButton from "../../components/Buttons/PrevButton"
import SubmitButton from "../../components/Buttons/SubmitButton"
import Loading from "../../components/Loading"
import SomStepper from "../../components/SomStepper/SomStepper"
import LoadingContext from "../../context/LoadingContext"
import SummaryContext from "../../context/SummaryContext"
import useBackNavigationWarning from "../../hooks/useBackNavigationWarning"
import { useSyncLanguage } from "../../hooks/useTranslateOptions"
import { activateLead, createHolderChangeLead } from "../../services/api"
import { NEW_HOLDER_CHANGE_FORM_SUBSTEPS } from "../../services/steps"
import { newNormalizeHolderChange } from "../../services/utils"
import MatomoContext from "../../trackers/matomo/MatomoProvider"
import NewContractMemberSupplyPoint from "../NewContractMember/pages/NewContractMemberSupplyPoint"
import NewContractMemberVoluntaryDonation from "../NewContractMember/pages/NewContractMemberVoluntaryDonation"
import MemberIdentifier from "../NewMember/pages/MemberIdentifier"
import MemberPersonalData from "../NewMember/pages/MemberPersonalData"
import memberIdentifierValidations from "../NewMember/validations/memberIdentifierValidations"
import memberPersonalDataValidations from "../NewMember/validations/memberPersonalDataValidations"
import Result from "../Result"
import newHolderChangeEspecialCasesValidations from "../validations/newHolderChangeEspecialCasesValidations"
import newHolderChangeMemberInfoValidations from "../validations/newHolderChangeMemberInfoValidations"
import newHolderChangePaymentValidations from "../validations/newHolderChangePaymentValidations"
import newHolderChangeSummaryValidations from "../validations/newHolderChangeSummaryValidations"
import newHolderChangeSupplyPointValidations from "../validations/newHolderChangeSupplyPointValidations"
import newHolderChangeVoluntaryDonationValidations from "../validations/newHolderChangeVoluntaryDonationValidations"
import { NewContractMemberSignature } from "./pages/NewContractMemberSignature"
import NewHolderChangeMemberQuestion from "./pages/NewHolderChangeMemberQuestion"
import NewHolderChangeSummary from "./pages/NewHolderChangeSummary"
import PaymentMethod from "./pages/PaymentMethod"


const MAX_STEP_NUMBER = 9

const NewHolderChangeForm = () => {
  const { i18n, t } = useTranslation()
  const { language } = useParams()
  const [sending, setSending] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [error, setError] = useState(false)
  const [redsysURL, setRedsysURL] = useState("")
  const [redsysData, setRedsysData] = useState()
  const formTPV = useRef(null)
  const formContainer = useRef(null)
  const [leadId, setLeadId] = useState()
  useBackNavigationWarning(
    activeStep > 0 && !completed && redsysURL === "",
    t("LEAVE_CONTRACT_FORM_DESCRIPTION"),
  )

  const { loading } = useContext(LoadingContext)
  const [ signatureCompleted, setSignatureCompleted] = useState(false)
  const { summaryField, setSummaryField } = useContext(SummaryContext)
  const { trackEvent } = useContext(MatomoContext)

  const [activeStep, setActiveStep] = useState(0)

  useSyncLanguage(language)

  const initialValues = {
    address: {
      street: "",
      number: "",
      floor: "",
      door: "",
      stairs: "",
      bloc: "",
      postal_code: "",
      state: { id: "", name: "" },
      city: { id: "", name: "" },
    },
    new_member: {
      nif: "",
      nif_valid: false,
      person_type: "",
      proxynif_valid: false,
      proxynif: "",
      proxyname: "",
      name: "",
      surname1: "",
      surname2: "",
      gender: "",
      birthdate: undefined,
      email: "",
      email2: "",
      phone: "",
      phone_code: "+34",
      phone_valid: false,
      language: `${i18n.language}_ES`,
      referral_source: "",
      payment_method: undefined,
      sepa_accepted: false,
      payment_authorization_accepted: false,
      iban: undefined,
      legal_person_accepted: false,
    },
    privacy_policy_accepted: false,
    statutes_accepted: false,
    comercial_info_accepted: false,
    generic_especific_conditons_accepted: false,
  }

  const validationSchemas = [
    newHolderChangeSupplyPointValidations,
    memberIdentifierValidations,
    memberPersonalDataValidations,
    newHolderChangeMemberInfoValidations,
    newHolderChangeEspecialCasesValidations,
    newHolderChangeVoluntaryDonationValidations,
    newHolderChangePaymentValidations,
    newHolderChangeSummaryValidations,
  ]

  const trackSuccess = () => {
    trackEvent({
      category: "NewHolderChange",
      action: "newHolderChangeFormOk",
      name: "send-new-holder-change-ok",
    })
  }

  const nextStep = () => {
    let next
    if (
      summaryField !== undefined &&
      activeStep !== NEW_HOLDER_CHANGE_FORM_SUBSTEPS["IDENTIFY_HOLDER"]
    ) {
      next = MAX_STEP_NUMBER
      setSummaryField(undefined)
    } else {
      next = activeStep + 1
    }
    const last = MAX_STEP_NUMBER
    setActiveStep(Math.min(next, last))
  }

  const prevStep = () => {
    let prev = activeStep - 1
    setActiveStep(Math.max(0, prev))
  }

  const handleSignatureSuccess = () => {
    if (!leadId) {
      setError(true)
      setCompleted(true)
      return
    }

    setSending(true)
    activateLead(leadId)
      .then(() => {
        trackSuccess()
        setError(false)
      })
      .catch((err) => {
        setError(true)
        console.log(err)
      })
      .finally(() => {
        setCompleted(true)
        setSending(false)
      })
  }
  const handleSignatureCompleted = () => {
    trackEvent({
      category: "NewHolderChange",
      action: "signatureCompleted",
      name: "new-holder-change-signature-completed",
    })
    setSignatureCompleted(true)
    handleSignatureSuccess()
  }

  const handleCreateContract = async (values) => {
    trackEvent({
      category: "Send",
      action: "sendNewContractMemberClick",
      name: "send-new-contract-member",
    })

    formContainer.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
    setSending(true)
    setSignatureCompleted(false)

    const data = newNormalizeHolderChange(values)
    await createHolderChangeLead(data)
      .then((response) => {
        if (response?.state === true) {
          const { redsys_data, lead_id } = response?.data || {}
          const paymentData = redsys_data?.payment_data
          const redsysEndpoint = redsys_data?.redsys_endpoint

          if (redsysEndpoint && paymentData) {
            trackEvent({
              category: "NewHolderChange",
              action: "paymentCreated",
              name: "new-holder-change-payment-created",
            })
            setRedsysData({
              redsys_endpoint: redsysEndpoint,
              payment_data: paymentData,
            })
            setRedsysURL(redsysEndpoint)
            setError(false)
          } else if (lead_id && NEW_HOLDER_CHANGE_FORM_SUBSTEPS["SIGNATURE"]) {
            setLeadId(lead_id)
            nextStep({ values })
            setError(false)
          } else {
            setCompleted(true)
            setError(true)
          }
        } else {
          setCompleted(true)
          setError(true)
        }
      })
      .catch((err) => {
        setError(true)
        console.log(err)
      })
      .finally(() => {
        setSending(false)
      })
  }

  const getStep = (props) => {
    if (activeStep === 0) {
      return <NewContractMemberSupplyPoint {...props} />
    } else if (activeStep === 1) {
      return <MemberIdentifier {...props} />
    } else if (activeStep === 2) {
      return <MemberPersonalData {...props} />
    } else if (activeStep === 3) {
      return <NewHolderChangeMemberQuestion {...props} />
    } else if (activeStep === 4) {
      return <NewContractMemberVoluntaryDonation {...props} />
    } else if (activeStep === 5) {
      return <PaymentMethod {...props} />
    } else if (activeStep === 6) {
      return <NewHolderChangeSummary {...props} />
    } else if (activeStep === 7) {
      return (
        <NewContractMemberSignature
          {...props}
          leadId={leadId}
          cups={props?.cups}
          onSuccess={handleSignatureCompleted}
        />
      )
    }
  }

  const formikRef = useRef(null)

  useEffect(() => {
    formikRef.current.validateForm()
  }, [activeStep])

  useEffect(() => {
    if (redsysURL !== "" && redsysData && formTPV.current) {
      formTPV.current.submit()
    }
  }, [redsysData, redsysURL])

  useEffect(() => {
    if (summaryField !== undefined) {
      setActiveStep(summaryField)
    }
  }, [summaryField])

  return (
    <Container
      data-cy="holder-change-form"
      aria-label="holder-change-form"
      maxWidth="md"
      disableGutters={true}
      sx={{
        padding: "2rem",
        backgroundColor: "secondary.white",
        borderRadius: "10px",
      }}>
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={validationSchemas[activeStep]}
        validateOnChange={true}
        validateOnBlur={false}>
        {(formikProps) => {
          return (
            <>
              {sending ? (
                <Loading description={t("NEW_MEMBER_SUBMIT_LOADING")} />
              ) : (
                <>
                  <Box sx={{ marginBottom: "65px" }}>
                    <SomStepper
                      activeStep={activeStep}
                      steps={NEW_HOLDER_CHANGE_FORM_SUBSTEPS}
                    />
                  </Box>
                  {completed ? (
                    <Box sx={{ mt: 2 }}>
                      <Result
                        mode={!error ? "success" : "failure"}
                        title={
                          !error
                            ? t("HOLDER_CHANGE_SUCCESS_TITLE")
                            : t("HOLDER_CHANGE_ERROR_TITLE")
                        }>
                        <Typography
                          sx={{ color: "secondary.dark" }}
                          dangerouslySetInnerHTML={{
                            __html: !error
                              ? t("HOLDER_CHANGE_SUCCESS_DESC")
                              : t("HOLDER_CHANGE_ERROR_DESC"),
                          }}
                        />
                      </Result>
                    </Box>
                  ) : (
                    <>
                      {getStep(formikProps)}
                      <Grid
                        container
                        direction="row-reverse"
                        rowSpacing={2}
                        sx={{
                          marginTop: "2rem",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}>
                        {activeStep !== 0 && (
                          <Grid item sm={2} xs={12}>
                            <PrevButton
                              disabled={sending}
                              onClick={() => prevStep(formikProps)}>
                              {t("PREV")}
                            </PrevButton>
                          </Grid>
                        )}
                        <Grid item size={{ sm: 2, xs: 12 }} order={-1}>
                          {activeStep === NEW_HOLDER_CHANGE_FORM_SUBSTEPS["SUMMARY"] ? (
                            <SubmitButton
                              disabled={loading || !formikProps.isValid}
                              onClick={() =>
                                handleCreateContract(formikProps.values)
                              }>
                              {t("NEXT")}
                            </SubmitButton>
                          ) : activeStep === NEW_HOLDER_CHANGE_FORM_SUBSTEPS["SIGNATURE"] ? (
                            <SubmitButton
                              disabled={loading || !signatureCompleted}
                              onClick={() => handleSignatureSuccess()}>
                              {t("FINISH")}
                            </SubmitButton>
                          ) : (
                            <NextButton
                              disabled={
                                loading ||
                                !formikProps.isValid ||
                                activeStep === MAX_STEP_NUMBER
                              }
                              onClick={() => nextStep(formikProps)}>
                              {t("NEXT")}
                            </NextButton>
                          )}
                        </Grid>
                      </Grid>
                    </>
                  )}
                </>
              )}
            </>
          )
        }}
      </Formik>

      {redsysData && redsysData.redsys_endpoint && redsysData.payment_data && (
        <form ref={formTPV} action={redsysData.redsys_endpoint} method="POST">
          {Object.keys(redsysData.payment_data).map((key) => (
            <input
              key={key}
              type="hidden"
              name={key}
              value={redsysData.payment_data[key]}
            />
          ))}
        </form>
      )}
    </Container>
  )
}

export default NewHolderChangeForm
