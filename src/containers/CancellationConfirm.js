import React, { useEffect, useState } from 'react'

import { useTranslation } from 'react-i18next'
import { useParams, useNavigate } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'

import Alert from '@material-ui/lab/Alert'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import CircularProgress from '@material-ui/core/CircularProgress'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import SendIcon from '@material-ui/icons/Send'

import ContractDetails from 'containers/Cancellation/ContractDetails'
import CancellationWarning from 'containers/Cancellation/CancellationWarning'

import Header from 'components/oficinavirtual/Header'
import Card from 'components/oficinavirtual/Card'

import Failure from './Failure'
import Success from './Success'

import { confirmCancelContract } from 'services/api'

const CancellationConfirm = (props) => {
  const classes = useStyles()
  const { language, contract_id, token } = useParams()
  const { t, i18n } = useTranslation()
  const { contract } = props

  const [sending, setSending] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [error, setError] = useState(false)
  const [result, setResult] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    language && i18n.changeLanguage(language)
  }, [language, i18n])

  const handleSubmit = (event) => {
    event.preventDefault()
    setSending(true)

    const csrfInput = document.querySelector(
      "input[name='csrfmiddlewaretoken']"
    )
    console.log(`csrfmiddlewaretoken: ${csrfInput?.value}`)
    const params = { contract_id, csrfToken: csrfInput?.value, token }

    confirmCancelContract(params)
      .then((response) => {
        setResult(response)
      })
      .catch((error) => {
        console.error(error)
        const errorResp = error?.response?.data?.error
          ? error?.response?.data?.error
          : { code: 'UNEXPECTED' }
        setError(errorResp)
      })
      .finally(() => {
        setSending(false)
        setCompleted(true)
      })
  }

  if (!contract?.number || !contract?.address) {
    return (
      <Alert severity="error">
        <Typography
          className={classes.disclaimer}
          variant="body1"
          dangerouslySetInnerHTML={{
            __html: t('CANCELLATION_NO_AVAILABLE')
          }}
        />
      </Alert>
    )
  }

  return (
    <Box className={classes.root}>
      <form onSubmit={handleSubmit}>
        <Container maxWidth="lg" disableGutters={true}>
          {!completed && (
            <>
              <ContractDetails
                contract_number={contract?.number}
                cups_address={contract?.address}
              />
              <CancellationWarning />
              <Box className={classes.contentWrapper}>
                <Header>{t('CANCELLATION_CONFIRM_TITLE')}</Header>
                <Card>
                  <div
                    style={{ width: '100%' }}
                    dangerouslySetInnerHTML={{
                      __html: t('CANCELLATION_CONFIRM_BODY', {
                        url_new: t('FAQ_ALTA_SUMINISTRAMENT_URL'),
                        url_holderchange: t('FAQ_HOLDERCHANGE_URL')
                      })
                    }}
                  />
                </Card>
              </Box>
              <Box mx={0} mt={2} mb={3}>
                <div className={classes.actionsContainer}>
                  <Button
                    data-cy="prev"
                    className={classes.button}
                    onClick={() => navigate('/')}>
                    {t('CANCEL')}
                  </Button>
                  <Button
                    type="submit"
                    data-cy="submit"
                    className={classes.button}
                    variant="contained"
                    color="primary"
                    startIcon={
                      sending ? <CircularProgress size={24} /> : <SendIcon />
                    }
                    disabled={sending}>
                    {t('CONFIRM_CANCELLATION')}
                  </Button>
                </div>
              </Box>
            </>
          )}
          {completed && (
            <Paper elevation={0} className={classes.stepContainer}>
              {result ? (
                <Success
                  showHeader={false}
                  title={t('CANCELLATION_CONFIRM_SUCCESS_TITLE')}
                  description={t('CANCELLATION_CONFIRM_SUCCESS_DESC')}
                />
              ) : (
                <Failure error={error} showHeader={false} />
              )}
            </Paper>
          )}
        </Container>
      </form>
    </Box>
  )
}

export default CancellationConfirm

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#f2f2f2',
    color: theme.palette.text.primary,
    display: 'flex',
    paddingBottom: '2rem',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  contentWrapper: {},
  stepContainer: {
    padding: '4rem',
    marginTop: 0,
    marginBottom: theme.spacing(4),
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.backgroundColor
  },
  step: {
    position: 'absolute',
    width: '100%'
  },
  actionsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: '0.25rem'
  },
  disclaimer: {
    fontSize: '14px',
    fontWeight: 400
  }
}))
