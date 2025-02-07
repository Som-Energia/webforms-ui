import React, { useEffect, useRef, useState } from 'react'
import getGoogleMapsPlacesApiClient, { getPlaceDetails, searchPlace } from '../../../services/googleApiClient'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'

import Typography from '@mui/material/Typography'
import { textHeader4 } from '../gurbTheme'

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
            <Typography sx={textHeader4}>
              {textFieldName}
            </Typography>
            <TextField
              sx={{
                '& .MuiFormHelperText-root': { color: '#B3B3B3' },
                '& .MuiInputLabel-root': { color: '#B3B3B3' },
                '& .MuiOutlinedInput-root': { borderRadius: '8px' },
                marginTop: '0.5rem'
              }}
              {...params}
              value={inputValue}
              label={textFieldLabel}
              helperText={textFieldHelper}
              onChange={(event) => setInputValue(event.target.value)}
            />
          </Box>
        )}
      />
    </>
  )
}
