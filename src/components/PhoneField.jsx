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

const SelectCountry = ({ code, setCode, setCountry, codes }) => {
  const handleChange = (event) => {
    setCode(event.target.value)
    setCountry(event.target.name)
  }
  return (
    <Select
      fullWidth
      value={code}
      renderValue={(value) => {
        return value
      }}
      variant="outlined"
      input={<InputBase />}
      sx={{
        border: 'none',
        borderRadius: '0px',
        borderRight: '1px solid',
        borderColor: 'secondary.light',
        borderHeight: '50%',
        backgroundColor: 'transparent',
        color: 'secondary.dark'
      }}
      onChange={handleChange}>
      <MenuItem sx={{ display: 'none' }} label="None" value="" />
      {Object.keys(codes).map((id) => (
        <MenuItem id={`${id}`} key={id} name={id} value={codes[id]}>
          {`${codes[id]} (${id})`}
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
  const [code, setCode] = useState(values.new_member.phone_code)
  const [country, setCountry] = useState('ES')
  const [number, setNumber] = useState(values.new_member.phone)
  const codes = getCountryDialCodesMap()

  function getCountryDialCodesMap() {
    const countries = getCountries(metadata)
    const result = {}
    countries.forEach((countryCode) => {
      const callingCode = getCountryCallingCode(countryCode, metadata)
      result[countryCode] = `+${callingCode}`
    })
    return result
  }

  function validatePhoneFormat() {
    const isValid = isValidPhoneNumber(number, country)
    setFieldValue(`${name}_valid`, isValid)
  }

  useEffect(() => {
    setFieldValue(name, number)
  }, [number])

  useEffect(() => {
    setFieldValue(`${name}_code`, code)
  }, [code])

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
            setNumber(event.target.value)
          }}
          handleBlur={() => {
            validatePhoneFormat()
            setFieldTouched(name, true)
          }}
          startAdornmentText={
            <SelectCountry
              code={code}
              setCode={setCode}
              setCountry={setCountry}
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
