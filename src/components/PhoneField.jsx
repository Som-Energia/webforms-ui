import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@mui/material/Grid'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputBase from '@mui/material/InputBase'

import metadata from 'libphonenumber-js/metadata.full.json'
import { getCountryCallingCode, getCountries } from 'libphonenumber-js/core'
import { isValidPhoneNumber } from 'libphonenumber-js'

import InputTitle from './InputTitle'
import InputField from './InputField'

const SelectCountry = ({ code, handleChange, codes }) => {
  return (
    <Select
      fullWidth
      value={code}
      onChange={handleChange}
      renderValue={(value) => value}
      variant="outlined"
      input={<InputBase />}
      sx={{
        border: 'none',
        borderRadius: '0px',
        borderRight: '1px solid',
        borderColor: 'secondary.light',
        backgroundColor: 'transparent',
        color: 'secondary.dark'
      }}>
      <MenuItem sx={{ display: 'none' }} label="None" value="" />
      {Object.keys(codes).map((countryCode) => (
        <MenuItem key={countryCode} value={codes[countryCode]}>
          {`${codes[countryCode]} (${countryCode})`}
        </MenuItem>
      ))}
    </Select>
  )
}

const PhoneField = (props) => {
  const {
    name = false,
    textFieldName,
    values,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
    required = false
  } = props
  const { t } = useTranslation()

  const codes = getCountryDialCodesMap()

  const initialCode = values.new_member.phone_code || '+34'
  const initialCountry =
    Object.keys(codes).find((c) => codes[c] === initialCode) || 'ES'

  const [code, setCode] = useState(initialCode)
  const [country, setCountry] = useState(initialCountry)
  const [number, setNumber] = useState(values.new_member.phone || '')

  function getCountryDialCodesMap() {
    const countries = getCountries(metadata)
    const result = {}
    countries.forEach((countryCode) => {
      const callingCode = getCountryCallingCode(countryCode, metadata)
      result[countryCode] = `+${callingCode}`
    })
    return result
  }

  function getCountryFromCode(code) {
    return Object.keys(codes).find((country) => codes[country] === code)
  }

  const handleChangeCountry = (event) => {
    const selectedCode = event.target.value
    setCode(selectedCode)
    const countryFromCode = getCountryFromCode(selectedCode)
    if (countryFromCode) setCountry(countryFromCode)
  }

  function validatePhoneFormat(numberParam = number, countryParam = country) {
    const isValid = isValidPhoneNumber(numberParam, countryParam)
    setFieldValue(`${name}_valid`, isValid)
  }

  useEffect(() => {
    setFieldValue(name, number)
    validatePhoneFormat(number, country)
  }, [number])

  useEffect(() => {
    setFieldValue(`${name}_code`, code)
    validatePhoneFormat(number, country)
  }, [code, country])

  return (
    <Grid container>
      <Grid item xs={12}>
        <InputTitle text={textFieldName} required={required} />
      </Grid>
      <Grid item xs={12}>
        <InputField
          name={name}
          value={number}
          handleChange={(event) => {
            const input = event.target.value

            // Regex to delete prefixes if they are written
            const prefix = code.replace('+', '')
            const regex = new RegExp(`^(\\+|00)?${prefix}`)
            const cleaned = input.replace(regex, '')

            setNumber(cleaned)
          }}
          handleBlur={() => {
            validatePhoneFormat()
            setFieldTouched(name, true)
          }}
          startAdornmentText={
            <SelectCountry
              code={code}
              handleChange={handleChangeCountry}
              codes={codes}
            />
          }
          numInputs={2}
          touched={touched?.new_member?.phone}
          error={errors?.new_member?.phone || errors?.new_member?.phone_valid}
        />
      </Grid>
    </Grid>
  )
}

export default PhoneField
