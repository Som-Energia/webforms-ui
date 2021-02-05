import React, { useEffect } from 'react'

import { useTranslation } from 'react-i18next'

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
  const { values, handleBlur, handleChange, errors, touched, rates, setFieldValue } = props

  const handleChangeChooser = ({ option }) => {
    setFieldValue('contract.moreThan15Kw', option)
  }

  useEffect(() => {
    const tariff = calculateTariff(values.contract)
    setFieldValue('contract.rate', tariff)
  }, [values.contract.moreThan15Kw])

  return (
    <>
      <StepHeader title={t('TARIFA_I_POTENCIA')} />
      <Typography variant="body1"
        dangerouslySetInnerHTML={{ __html: t('HELP_TARIFA_CANVI_COMERCIALITZADORA') }}
      />
      { values?.contract?.has_service === false &&
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
              error={(errors?.contract?.phases && touched?.contract?.phases)}
              helperText={(touched?.contract?.phases && errors?.contract?.phases)}
            >
              <MenuItem value="mono">
                {t('PHASE_MONO')}
              </MenuItem>
              <MenuItem value="tri">
                {t('PHASE_TRI')}
              </MenuItem>
            </TextField>
          </Box>

          <Box mx={1} mt={0} mb={1}>
            <FormHelperText dangerouslySetInnerHTML={{ __html: t('HELP_INSTALL_TYPE', { url: t('HELP_INSTALL_TYPE_URL') }) }}></FormHelperText>
          </Box>
        </>
      }
      <Box mt={3} mb={1}>
        <Chooser
          question={t('POWER_QUESTION')}
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
      <Box mt={3}>
        <Typography variant="body1"
          dangerouslySetInnerHTML={{
            __html: t(values?.contract?.moreThan15Kw ? 'HELP_MORE_THAN_15KW' : 'HELP_LESS_THAN_15KW')
          }}
        />
      </Box>
      <Box mt={2} mb={1}>
        <PowerInputs numInputs={rates[values?.contract?.rate]?.num_power_periods} {...props} namePrefix='contract' values={values?.contract} errors={errors?.contract} touched={touched?.contract}/>
      </Box>
    </>
  )
}

export default PowerFare
