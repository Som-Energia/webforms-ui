import React, { useState } from 'react'

import { useTranslation } from 'react-i18next'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'

import SendIcon from '@mui/icons-material/Send'
import PrevButton from '../../components/Buttons/PrevButton'

export default function ModifyResume({
  prevStep,
  nextStep,
  handleStepChanges,
  postSubmit,
  params
}) {
  const { t } = useTranslation()
  const [sending, setSending] = useState(false)

  const handleSubmit = async () => {
    setSending(true)
    await postSubmit(params)
    setSending(false)
  }

  return (
    <Paper sx={{ mt: 2, padding: 2 }} elevation={0}>
      <Box mt={1} mx={1} mb={2}>
        <Typography gutterBottom>{t('REVIEW_DATA_AND_CONFIRM')}</Typography>
      </Box>

      <Box mx={1} mb={1}>
        <Divider />
      </Box>

      {params?.subsection && (
        <Box mt={2} mx={1}>
          <Typography
            sx={{ textTransform: 'uppercase' }}
            variant="subtitle2"
            gutterBottom>
            {t('SUBSECTION_AUTO')}
          </Typography>
          <Grid container spacing={2}>
            <Grid item>
              <Typography data-cy="tariff" variant="body1" gutterBottom>
                {params.subsection}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      )}

      {params.modify?.phases && (
        <Box mt={2} mx={1}>
          <Typography
            sx={{ textTransform: 'uppercase' }}
            variant="subtitle2"
            gutterBottom>
            {t('INSTALL_TYPE')}
          </Typography>
          <Typography
            data-cy={params.modify?.phases}
            variant="body1"
            gutterBottom>
            {params.modify?.phases === 'mono'
              ? t('MONOFASICA_NORMAL')
              : t('TRIFASICA')}
          </Typography>
        </Box>
      )}

      {params.modify?.power && (
        <Box mt={2} mx={1}>
          <Typography
            sx={{ textTransform: 'uppercase' }}
            variant="subtitle2"
            gutterBottom>
            {t('POWER')}
          </Typography>

          <Grid container spacing={4}>
            <Grid item>
              <Typography data-cy="power" variant="body1" gutterBottom>
                <Typography component="body1" sx={{ mr: 1, color: 'secondary.dark' }}>
                  {params?.modify?.moreThan15Kw ? 'P1' : t('PEAK')}
                </Typography>{' '}
                {params.modify?.power} kW
              </Typography>
            </Grid>
            <Grid item>
              <Typography data-cy="power2" variant="body1" gutterBottom>
                <Typography component="body1" sx={{ mr: 1, color: 'secondary.dark' }}>
                  {params?.modify?.moreThan15Kw ? 'P2' : t('VALLEY')}
                </Typography>{' '}
                {params.modify?.power2} kW
              </Typography>
            </Grid>

            {params?.modify?.moreThan15Kw && (
              <>
                {[...Array(4).keys()].map((item) => {
                  const num = item + 3
                  return (
                    <Grid item>
                      <Typography
                        data-cy={`power${num}`}
                        variant="body1"
                        gutterBottom>
                        <Typography
                          component="body1"
                          sx={{
                            mr: 1,
                            color: 'secondary.dark'
                          }}>{`P${num}`}</Typography>{' '}
                        {params.modify?.[`power${num}`]} kW
                      </Typography>
                    </Grid>
                  )
                })}
              </>
            )}
          </Grid>
        </Box>
      )}
      {params.modify?.changePower && (
        <Box mt={2} mx={1}>
          <Typography
            sx={{ textTransform: 'uppercase' }}
            variant="subtitle2"
            gutterBottom>
            {t('FARE')}
          </Typography>
          <Grid container spacing={4}>
            {params.modify?.tariff && (
              <Grid item>
                <Typography data-cy="tariff" variant="body1" gutterBottom>
                  {params.modify?.tariff}
                </Typography>
              </Grid>
            )}
          </Grid>
        </Box>
      )}

      <Box mt={2} mb={3} mx={1}>
        <Typography
          sx={{ textTransform: 'uppercase' }}
          variant="subtitle2"
          gutterBottom>
          {t('CONTACT_PHONE')}
        </Typography>
        <Typography data-cy="contact" variant="body1" gutterBottom>
          {params.contact?.phone} ({params.contact?.contactName}{' '}
          {params.contact?.contactSurname})
        </Typography>
      </Box>

      <Box mt={1} mx={1} mb={2}>
        <Typography gutterBottom>{t('REVIEW_DATA_INFO')}</Typography>
      </Box>

      <Box mx={1} mb={1}>
        <Divider />
      </Box>

      <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}>
        {prevStep && (
          <PrevButton
            onClick={prevStep}
            title={t('PAS_ANTERIOR')}
          />
        )}
        {
          <>
            <Button
              type="submit"
              onClick={handleSubmit}
              sx={{ mt: 1, mr: 1 }}
              color="primary"
              variant="contained"
              startIcon={
                sending ? <CircularProgress size={24} /> : <SendIcon />
              }
              disabled={sending}>
              {t('ENVIAR')}
            </Button>
          </>
        }
      </Box>
    </Paper>
  )
}
