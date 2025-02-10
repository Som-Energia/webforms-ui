import React, { useEffect, useRef, useState } from 'react'
import { searchPlace } from '../../../services/googleApiClient'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'

import { textHeader4 } from '../gurbTheme'
import InputTitle from './InputTitle'


export default function LocationInput({
  textFieldLabel,
  textFieldName,
  textFieldHelper,
  value,
  onChange,
  sessionTokenRef,
  numberField = false,
  required = false
}) {
  const { t } = useTranslation()
  const timeoutRef = useRef()

  const [suggestions, setSuggestions] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [loadingResults, setLoadingResults] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    setLoadingResults(true)
    clearTimeout(timeoutRef.current)
    if (!inputValue || inputValue.trim().length <= 3) {
      return
    }

    // debounce the loading of suggestions to reduce usage of the Google API
    timeoutRef.current = setTimeout(async () => {
      searchPlace(inputValue, sessionTokenRef)
        .then((placesSuggestions) => {
          setSuggestions(placesSuggestions)
          setLoadingResults(false)
        })
    }, 350)
  }, [inputValue])

  const handleSuggestionSelected = async (event, newValue) => {
    onChange(newValue)
    setSuggestions([])
  }

  return (
    <>
      <Autocomplete
        value={value || inputValue || ''}
        options={suggestions}
        filterOptions={(option) => option} // Required to see options without perfect match with Google Places API
        getOptionLabel={(option) => option.text ? option.text : option}
        loading={loadingResults}
        loadingText="Loading..." // TODO: Translate this!
        noOptionsText="No locations" // TODO: Translate this!
        onChange={handleSuggestionSelected}
        renderInput={(params) => (
          <Box sx={{ marginTop: '1rem', marginBottom: '1rem' }}>
            <InputTitle
              text={textFieldName}
              textStyle={textHeader4}
              required={required}
            />
            <TextField
              sx={{
                '& .MuiFormHelperText-root': { color: '#B3B3B3' },
                '& .MuiInputLabel-root': { color: '#B3B3B3' },
                '& .MuiOutlinedInput-root': { borderRadius: '8px', paddingY: '0px' },
                marginTop: '0.5rem',
              }}
              {...params}
              required={required}
              value={inputValue}
              label={!value && !inputValue && !isFocused ? textFieldLabel: ''}
              InputLabelProps={{ shrink: false }}
              helperText={textFieldHelper}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onChange={(event) => setInputValue(event.target.value)}
            />
          </Box>
        )}
      />
    </>
  )
}
