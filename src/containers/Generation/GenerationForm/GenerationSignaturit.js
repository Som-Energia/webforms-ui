import React, { useCallback, useEffect, useState } from 'react'
import { createGenerationkWhSignature } from '../../../services/api'
import { useTranslation } from 'react-i18next'
import cuca from '../../../images/cuca.svg'
import { makeStyles } from '@material-ui/core/styles'
import { CircularProgress, Typography } from '@material-ui/core/'
import StepHeader from '../../../components/StepHeader'

let signaturitHook = () => undefined

window.addEventListener('message', function (e) {
  signaturitHook(e)
})

const useStyles = makeStyles((theme) => ({
  logo: {
    width: '70px',
    margin: theme.spacing(2)
  },
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '700px',
    flexDirection: 'column',
    gap: "5px"
  }
}))

function GenerationSignaturit(props) {
  const [signaturitResponseUrl, setSignaturitResponseUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [completed, setCompleted] = useState(false)
  const { i18n } = useTranslation()
  const { submit, values, setFieldValue, title } = props
  const { t } = useTranslation()
  const classes = useStyles()
  const getSignaturit = useCallback(() => {
    createGenerationkWhSignature({
      partner_number: values?.member?.partner_number,
      nif: values?.member?.vat,
      full_name:
        values?.member?.name +
        ' ' +
        values?.member?.surname1 +
        ' ' +
        values?.member?.surname2,
      address: values?.member?.address,
      postal_code: values?.member?.postal_code,
      state: values?.member?.state.name,
      city: values?.member?.city.name,
      language: i18n.language,
      number_of_actions: values?.number_of_actions,
      iban: values?.payment?.iban,
      email: values?.member?.email
    })
      .then((response) => {
        setLoading(false)
        setFieldValue('signaturit', response?.data?.signaturit)
        setFieldValue('mandate_name', response?.data?.mandate_name)
        setSignaturitResponseUrl(response?.data?.signaturit?.url)
      })
      .catch((err) => {
        setLoading(false)
        console.log(err)
      })
  }, [i18n, values, setFieldValue])

  signaturitHook = useCallback(
    (e) => {
      if (e?.data?.event === 'completed') {
        submit(values)
        setCompleted(true)
      }
    },
    [values, submit]
  )

  useEffect(() => {
    getSignaturit()
  }, [])

  return (
    <>
      <Typography component="h1" variant="h3">
        {title}
      </Typography>

      {loading || completed ? (
        <div className={classes.root}>
          <img className={classes.logo} alt="Cuca de Som Energia" src={cuca} />
          <CircularProgress color="secondary" />
          {completed ? (
            <>
              <Typography
                variant="body2"
                dangerouslySetInnerHTML={{
                  __html: t('GENERATION_FORM_IN_PROCESS')
                }}
              />
            </>
          ) : null}
        </div>
      ) : (
        <iframe
          title="signaturit_iframe"
          id="iframe_signaturit"
          src={signaturitResponseUrl}
          style={{ height: '700px', width: '100%' }}
        />
      )}
    </>
  )
}

export default GenerationSignaturit
