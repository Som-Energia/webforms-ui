import React, { useState, useEffect, useContext } from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import { checkCnae } from '../services/api'
import LoadingContext from '../context/LoadingContext'
import InputField from './InputField'
import SelectField from './SelectField'
import InputTitle from './InputTitle'
import { textField } from '../themes/gurbTheme'

const CnaeField = (props) => {
  const { values, errors, touched, setFieldValue, setFieldTouched, setValues } =
    props

  const { t } = useTranslation()
  const { loading, setLoading } = useContext(LoadingContext)
  const [cnaeDescription, setCnaeDescription] = useState(false) // TODO: Remove it?

  const updateCNAE = async () => {
    setCnaeDescription(false)

    if (values?.supply_point?.cnae?.length > 3) {
      setLoading(true)
      let correctCNAE = undefined
      await checkCnae(values?.supply_point?.cnae)
        .then((response) => {
          correctCNAE = response?.state
          setCnaeDescription(response?.data?.description)
        })
        .catch(() => {
          correctCNAE = false
        })
      setLoading(false)
      setFieldValue('supply_point.cnae_valid', correctCNAE)
    }
  }

  useEffect(() => {
    updateCNAE()
  }, [values.supply_point.cnae])

  const handleChangeCNAE = (event) => {
    const value = event.target.value.replace(/[^0-9]/g, '')
    setFieldValue('supply_point.cnae', value)
  }

  const handleBlurCNAE = () => {
    setFieldTouched('supply_point.cnae', true)
  }

  const handleIsHousing = (event) => {
    const isHousing = event.target.value
    setValues({
      ...values,
      supply_point: {
        ...values.supply_point,
        is_housing: isHousing,
        cnae: isHousing ? 9820 : undefined,
        cnae_valid: true
      }
    })
  }

  const options = [
    { id: true, name: t('YES') },
    { id: false, name: t('NO') }
  ]

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <SelectField
              label={t('IS_HOUSING')}
              value={values?.supply_point?.is_housing ?? ''}
              fieldName={"supply_point.is_housing"}
              onChange={handleIsHousing}
              options={options}
              required={true}
              {...props}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={6}>
        <InputField
          name="cnae"
          textFieldName={t('CNAE')}
          readonlyField={values?.supply_point?.is_housing === true}
          value={values?.supply_point?.cnae}
          handleChange={handleChangeCNAE}
          handleBlur={handleBlurCNAE}
          touched={touched?.supply_point?.cnae}
          error={errors?.supply_point?.cnae || errors?.supply_point?.cnae_valid}
          textFieldHelper={
            <Typography
              variant="body.sm.regular"
              color="secondary.extraDark"
              dangerouslySetInnerHTML={{
                __html: values?.supply_point?.is_housing
                  ? t('CNAE_HELPER')
                  : t('HELP_POPOVER_CNAE')
              }}
            />
          }
          isLoading={loading}
          required={true}
        />
      </Grid>
    </Grid>
  )
}

export default CnaeField
