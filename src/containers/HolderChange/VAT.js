import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { makeStyles } from '@material-ui/core/styles'

import { checkVat } from '../../services/api'

import Box from '@material-ui/core/Box'
import FormHelperText from '@material-ui/core/FormHelperText'
import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'

import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined'

import StepHeader from '../../components/StepHeader'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  margin: {
    margin: theme.spacing(1)
  },
  title: {
    marginBottom: theme.spacing(3),
    color: '#96b633',
    textTransform: 'uppercase',
    fontWeight: 500
  },
  withoutLabel: {
    marginTop: theme.spacing(3)
  },
  textField: {
    width: '25ch'
  }
}))

function VAT (props) {
  const classes = useStyles()
  const { t } = useTranslation()

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const value = props.values.holder.vat
    if (value.length > 8) {
      setIsLoading(true)
      checkVat(value)
        .then(response => {
          const validVat = response?.data?.valid === true
          props.setFieldValue('holder.vatvalid', validVat)
          props.validateForm()
          setIsLoading(false)
        })
    } else {
      props.setFieldValue('holder.vatvalid', false)
    }
  }, [props.values.holder.vat])

  return (
    <>
      <StepHeader title={t('HOLDER_CHANGE')} />
      <Typography variant="body1"
        dangerouslySetInnerHTML={{ __html: t('FILL_VAT') }}
      />
      <Box mt={3} mb={1}>
        <TextField
          id="vat"
          name="holder.vat"
          label={t('VAT_LABEL')}
          variant="outlined"
          fullWidth
          required
          autoFocus
          value={props.values.holder.vat}
          onChange={props.handleChange}
          onBlur={props.handleBlur}
          error={(props.errors?.holder?.vat && props.touched?.holder?.vat) ||
            (props.touched?.holder?.vat && props.values?.holder?.vatvalid === false)
          }
          helperText={(props.touched?.holder?.vat && props.errors?.holder?.vat) ||
            (props.touched?.holder?.vat && props.errors?.holder?.vatvalid)
          }
          InputProps={{
            endAdornment:
              <InputAdornment position="end">
                { isLoading &&
                  <CircularProgress size={24} />
                }
                { !isLoading && props.values.holder.vatvalid &&
                  <CheckOutlinedIcon color="primary" />
                }
              </InputAdornment>
          }}
        />
        <input
          type="hidden"
          id="vatvalid"
          name="holder.vatvalid"
          onChange={props.handleChange}
          value={props.values.holder.vatvalid}
        />
      </Box>
      <Box mt={4} mb={3}>
        <FormHelperText dangerouslySetInnerHTML={{ __html: t('NO_VAT_HELP') }}></FormHelperText>
      </Box>
    </>
  )
}

export default VAT
