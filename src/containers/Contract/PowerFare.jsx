import React, { useEffect } from 'react'

import { useTranslation } from 'react-i18next'

import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import FormHelperText from '@mui/material/FormHelperText'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import Chooser from '../../components/Chooser'
import StepHeader from '../../components/StepHeader'
import PowerInputs from '../../components/PowerInputs'

import { calculateTariff } from '../../services/utils'

const PowerFare = (props) => {
  const { t } = useTranslation()
  const {
    values,
    handleBlur,
    handleChange,
    errors,
    touched,
    rates,
    setFieldValue,
    isIndexedContractEnabled,
    is30ContractEnabled = false
  } = props

  const handleChangeChooser = ({ option }) => {
    setFieldValue('contract.moreThan15Kw', option)
  }

  useEffect(() => {
    const tariff = calculateTariff(values.contract)
    setFieldValue('contract.rate', tariff)
  }, [values.contract, values.contract.moreThan15Kw])

  return (
    <>
      <StepHeader
        title={
          values?.contract?.has_service === true
            ? t('POWER')
            : t('TENSION_AND_POWER')
        }
      />
      <Typography
        variant="body1"
        dangerouslySetInnerHTML={{
          __html:
            values?.contract?.has_service === true
              ? t('HELP_POWER_CANVI')
              : t('HELP_TENSION_POWER_ALTA')
        }}
      />
      {values?.contract?.has_service === false && (
        <>
          <Box mt={3} mb={0}>
            <TextField
              select
              required
              id="phases"
              name="contract.phases"
              label={t('TIPUS_INSTALLACIO_CONTRACTACIO')}
              variant="outlined"
              margin="normal"
              fullWidth
              onChange={handleChange}
              onBlur={handleBlur}
              value={values?.contract?.phases}
              error={errors?.contract?.phases && touched?.contract?.phases}
              helperText={touched?.contract?.phases && errors?.contract?.phases}
            >
              <MenuItem value="mono">{t('PHASE_MONO')}</MenuItem>
              <MenuItem value="tri">{t('PHASE_TRI')}</MenuItem>
            </TextField>
          </Box>

          <Box mx={1} mt={0} mb={1}>
            <FormHelperText
              dangerouslySetInnerHTML={{
                __html: t('HELP_INSTALL_TYPE', {
                  url: t('HELP_INSTALL_TYPE_URL')
                })
              }}
            ></FormHelperText>
          </Box>
        </>
      )}
      <Box mt={3} mb={1}>
        <Chooser
          name="moreThan15Kw"
          condensed
          canBeEmpty={false}
          question={
            !values?.contract?.has_service
              ? t('POTENCIA_A_CONTRACTAR_CONTRACTACIO')
              : t('QUINA_POTENCIA_TENS_CONTRACTADA')
          }
          onChange={handleChangeChooser}
          value={values?.contract?.moreThan15Kw}
          options={[
            {
              id: 'lower-15kw',
              value: false,
              label: t('MENOR_IGUAL_A_15KW_CONTRACTACIO')
            },
            {
              id: 'higher-15kw',
              value: true,
              label: t('MES_GRAN_DE_15KW_CONTRACTACIO')
            }
          ]}
        />
      </Box>
      {values?.contract?.moreThan15Kw && !is30ContractEnabled && (
        <>
          <Box mt={3}>
            <Alert severity="warning">
              <Typography
                variant="body1"
                dangerouslySetInnerHTML={{
                  __html: t('TARIFF_NOT_AVAILABLE')
                }}
              />
            </Alert>
          </Box>
        </>
      )}
      {(!values?.contract?.moreThan15Kw || is30ContractEnabled) && (
        <>
          <Box mt={3}>
            {isIndexedContractEnabled ? (
              <FormHelperText
                dangerouslySetInnerHTML={{
                  __html: t('POWER_PERIODS_MORE_INFO', {
                    tariff: values?.tariff,
                    periods_url: values?.contract?.moreThan15Kw
                      ? t('POWER_PERIODS_30TD_MORE_INFO_URL')
                      : t('POWER_PERIODS_20TD_MORE_INFO_URL'),
                    indexed_url: values?.contract?.moreThan15Kw
                      ? t('POWER_INDEXED_30TD_MORE_INFO_URL')
                      : t('POWER_INDEXED_20TD_MORE_INFO_URL')
                  })
                }}
              ></FormHelperText>
            ) : (
              <FormHelperText
                dangerouslySetInnerHTML={{
                  __html: t('POWER_PERIODS_MORE_INFO__DEPRECATED', {
                    tariff: values?.tariff,
                    url: values?.contract?.moreThan15Kw
                      ? t('POWER_PERIODS_30TD_MORE_INFO_URL')
                      : t('POWER_PERIODS_20TD_MORE_INFO_URL')
                  })
                }}
              ></FormHelperText>
            )}
          </Box>
          <Box mt={2} mb={1}>
            <PowerInputs
              namePrefix="contract"
              numInputs={rates[values?.contract?.rate]?.num_power_periods}
              {...props}
              values={values?.contract}
              errors={errors?.contract}
              touched={touched?.contract}
            />
          </Box>
        </>
      )}
    </>
  )
}

export default PowerFare
