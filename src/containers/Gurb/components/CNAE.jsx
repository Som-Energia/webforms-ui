import React, { useState, useEffect, useContext } from 'react'
import { useTranslation } from 'react-i18next'

import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Grid from '@mui/material/Grid'

import { checkCnae } from '../../../services/api'
import GurbLoadingContext from '../../../context/GurbLoadingContext'
import InputField from './InputField'


const CnaeField = (props) => {
  const {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
    setValues
  } = props

  const { t } = useTranslation()
  const { loading, setLoading } = useContext(GurbLoadingContext)
  const [cnaeDescription, setCnaeDescription] = useState(false)  // TODO: Remove it?

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
  };

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

  return (
    <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField  // TODO: Selector
            select
            fullWidth
            name="is_housing"
            label={t('ES_UN_HABITATGE')}
            value={values?.supply_point?.is_housing}
            onChange={handleIsHousing}
            error={errors?.supply_point?.is_housing}
            helperText=""
          >
            <MenuItem value={true}>{t('YES')}</MenuItem>
            <MenuItem value={false}>{t('NO')}</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputField
            name="cnae"
            textFieldLabel={t('CNAE')}
            textFieldName={t('CNAE')}
            readonlyField={values?.supply_point?.is_housing}
            value={values?.supply_point?.cnae}
            handleChange={handleChangeCNAE}
            handleBlur={handleBlurCNAE}
            touched={touched?.supply_point?.cnae}
            error={errors?.supply_point?.cnae || errors?.supply_point?.cnae_valid}
            isLoading={loading}
            required={true}
          />

        </Grid>
      </Grid>
  )
}

export default CnaeField
