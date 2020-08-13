import React, { useState, useEffect } from 'react'

import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'

import Box from '@material-ui/core/Box'
import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid'
import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined'

import Chooser from '../../components/Chooser'
import StepHeader from '../../components/StepHeader'
import { checkCups } from '../../services/api'

const useStyles = makeStyles((theme) => ({
  memberChecked: {
    fontWeight: 500,
    color: theme.palette.primary.main
  },
  chooserContainer: {
    '& h6': {
      fontSize: '1rem',
      marginTop: theme.spacing(2)
    }
  }
}))

const CupsHelperText = () => {
  const { t } = useTranslation()
  return <a
    href={t('CUPS_HELP_URL')}
    target="_blank"
    rel="noopener noreferrer"
  >
    {t('CUPS_HELP')}
  </a>
}

const CUPS = (props) => {
  const { t } = useTranslation()
  const classes = useStyles()

  const { values, handleBlur, errors, touched, setFieldValue, setFieldTouched } = props
  const [isLoading, setLoading] = useState(false)

  const handleInputCups = (event) => {
    let value = event.target.value.match(/[0-9A-Za-z]{0,22}/)
    value = value[0].toUpperCase()
    setFieldValue('supply_point.cups', value, true)
  }

  const handleChangeService = ({ option }) => {
    setFieldValue('supply_point.has_service', option)
  }

  useEffect(() => {
    const value = values.supply_point.cups
    if (value.length > 18) {
      setLoading(true)
      checkCups(value)
        .then(response => {
          console.log(response)
          const status = response?.data?.status
          setFieldValue('supply_point.status', status)
          setFieldTouched('supply_point.cups', true)
          setLoading(false)
        })
        .catch(error => {
          console.log(error.response)
          const errorStatus = error?.response?.data?.data?.status
            ? error?.response?.data?.data?.status
            : 'error'
          setFieldValue('supply_point.status', errorStatus)
          setLoading(false)
        })
    } else {
      setFieldValue('supply_point.status', 'error')
    }
  }
  , [values.supply_point.cups, setFieldValue, setFieldTouched])

  return (
    <>
      <StepHeader title={t('CUPS_TITLE')} />
      <Typography variant="body1"
        dangerouslySetInnerHTML={{ __html: t('FILL_CUPS') }}
      />
      <Box mt={3} mb={1}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              required
              id="cups"
              name="supply_point.cups"
              label={t('CUPS')}
              onChange={handleInputCups}
              onBlur={handleBlur}
              value={values.supply_point.cups}
              fullWidth
              variant="outlined"
              margin="normal"
              InputProps={{
                endAdornment:
                  <InputAdornment position="end">
                    { isLoading &&
                      <CircularProgress size={24} />
                    }
                    { !isLoading && (values?.supply_point?.status === 'new' || values?.supply_point?.status === 'inactive') &&
                      <CheckOutlinedIcon color="primary" />
                    }
                  </InputAdornment>
              }}
              error={ errors?.supply_point?.cups && touched?.supply_point?.cups }
              helperText={(touched?.supply_point?.cups && errors?.supply_point?.cups) ||
                <CupsHelperText />
              }
            />

          </Grid>
        </Grid>
      </Box>

      <Box mt={1} mb={1} className={classes.chooserContainer}>
        <Chooser
          question={t('HI_HA_LLUM_AL_PUNT_DE_SUBMINISTRAMENT')}
          onChange={handleChangeService}
          value={values.supply_point.has_service}
          disabled={(values.supply_point.status !== 'new' && values.supply_point.status !== 'inactive')}
          options={[
            {
              value: true,
              label: t('AVIS_CANVI_COMERCIALITZADORA_LABEL'),
              description: t('AVIS_CANVI_COMERCIALITZADORA_DESC')
            },
            {
              value: false,
              label: t('AVIS_ALTA_DE_SERVEI_LABEL'),
              description: t('AVIS_ALTA_DE_SERVEI_DESC')
            }
          ]}
        />
      </Box>
    </>
  )
}

export default CUPS