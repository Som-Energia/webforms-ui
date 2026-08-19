import { useEffect, useState } from "react"

import Grid from "@mui/material/Grid"
import InputBase from "@mui/material/InputBase"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"

import { isValidPhoneNumber } from "libphonenumber-js"
import { getCountries, getCountryCallingCode } from "libphonenumber-js/core"
import metadata from "libphonenumber-js/metadata.full.json"

import InputField from "./InputField/InputField"
import InputTitle from "./InputTitle"

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
        border: "none",
        borderRadius: "0px",
        borderRight: "1px solid",
        borderColor: "secondary.light",
        backgroundColor: "transparent",
        color: "secondary.dark",
      }}>
      <MenuItem sx={{ display: "none" }} label="None" value="" />
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
    required = false,
  } = props

  const codes = getCountryDialCodesMap()

  const initialCode = values.new_member.phone_code || "+34"

  const [code, setCode] = useState(initialCode)
  const [number, setNumber] = useState(values.new_member.phone || "")

  function getCountryDialCodesMap() {
    const countries = getCountries(metadata)
    const result = {}
    countries.forEach((countryCode) => {
      const callingCode = getCountryCallingCode(countryCode, metadata)
      result[countryCode] = `+${callingCode}`
    })
    return result
  }

  const handleChangeCountry = (event) => {
    const selectedCode = event.target.value
    setCode(selectedCode)
  }

  function sanitizePhoneNumber(input) {
    const internationalPrefixRegex = /^(\+|00)+/

    return input.trim().replace(internationalPrefixRegex, "")
  }

  function validatePhoneFormat(numberParam = number, codeParam = code) {
    const sanitizedNumber = sanitizePhoneNumber(numberParam, codeParam)
    const fullPhoneNumber = `${codeParam}${sanitizedNumber}`
    const isValid =
      sanitizedNumber.length > 0 && isValidPhoneNumber(fullPhoneNumber)
    setFieldValue(`${name}_valid`, isValid)
  }

  useEffect(() => {
    setFieldValue(name, number)
    validatePhoneFormat(number, code)
  }, [number])

  useEffect(() => {
    setFieldValue(`${name}_code`, code)
    validatePhoneFormat(number, code)
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
            setNumber(sanitizePhoneNumber(event.target.value))
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
