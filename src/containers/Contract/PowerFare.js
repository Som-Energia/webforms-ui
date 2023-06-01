import React, { useEffect } from 'react'

import { useTranslation } from 'react-i18next'

import Alert from '@material-ui/lab/Alert'
import Box from '@material-ui/core/Box'
import FormHelperText from '@material-ui/core/FormHelperText'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

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
        title={t(
          values?.contract?.has_service === true ? 'POWER' : 'TENSION_AND_POWER'
        )}
      />
      <Typography
        variant="body1"
        dangerouslySetInnerHTML={{
          __html: t(
            values?.contract?.has_service === true
              ? 'HELP_POWER_CANVI'
              : 'HELP_TENSION_POWER_ALTA'
          )
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
          question={t(
            !values?.contract?.has_service
              ? t('POTENCIA_A_CONTRACTAR_CONTRACTACIO')
              : t('QUINA_POTENCIA_TENS_CONTRACTADA')
          )}
          onChange={handleChangeChooser}
          value={values?.contract?.moreThan15Kw}
          options={[
            {
              value: false,
              label: t('MENOR_IGUAL_A_15KW_CONTRACTACIO')
            },
            {
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
            <FormHelperText
              dangerouslySetInnerHTML={{
                __html: t('POWER_PERIODS_MORE_INFO', {
                  tariff: values?.tariff,
                  periods_url: values?.moreThan15Kw
                    ? t('POWER_PERIODS_30TD_MORE_INFO_URL')
                    : t('POWER_PERIODS_20TD_MORE_INFO_URL'),
                  indexed_url: values?.moreThan15Kw
                    ? t('POWER_INDEXED_30TD_MORE_INFO_URL')
                    : t('POWER_INDEXED_20TD_MORE_INFO_URL')
                })
              }}
            ></FormHelperText>
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
