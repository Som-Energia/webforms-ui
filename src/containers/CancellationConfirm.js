import React, { useEffect, useState } from 'react'

import { useTranslation } from 'react-i18next'
import { useParams, useNavigate } from 'react-router-dom'

import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

import SendIcon from '@mui/icons-material/Send'

import ContractDetails from 'containers/Cancellation/ContractDetails'
import CancellationWarning from 'containers/Cancellation/CancellationWarning'

import Header from 'components/oficinavirtual/Header'
import Card from 'components/oficinavirtual/Card'

import Failure from './Failure'
import Success from './Success'

import { confirmCancelContract } from 'services/api'

const CancellationConfirm = (props) => {
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
          sx={{ fontSize: '14px', fontWeight: 400 }}
          variant="body1"
          dangerouslySetInnerHTML={{
            __html: t('CANCELLATION_NO_AVAILABLE')
          }}
        />
      </Alert>
    )
  }

  return (
    <Box
      sx={{
        pb: '2rem',
        backgroundColor: '#f2f2f2',
        color: 'primary',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column'
      }}>
      <form onSubmit={handleSubmit}>
        <Container maxWidth="lg" disableGutters={true}>
          {!completed && (
            <>
              <ContractDetails
                contract_number={contract?.number}
                cups_address={contract?.address}
              />
              <CancellationWarning />
              <Box>
                <Header>{t('CANCELLATION_CONFIRM_TITLE')}</Header>
                <Card>
                  <Box
                    sx={{ width: '100%' }}
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
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    pt: '0.25rem'
                  }}>
                  <Button data-cy="prev" onClick={() => navigate('/')}>
                    {t('CANCEL')}
                  </Button>
                  <Button
                    type="submit"
                    data-cy="submit"
                    variant="contained"
                    color="primary"
                    startIcon={
                      sending ? <CircularProgress size={24} /> : <SendIcon />
                    }
                    disabled={sending}>
                    {t('CONFIRM_CANCELLATION')}
                  </Button>
                </Box>
              </Box>
            </>
          )}
          {completed && (
            <Paper
              elevation={0}
              sx={{
                padding: '4rem',
                mt: 0,
                mb: 4,
                width: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}>
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
