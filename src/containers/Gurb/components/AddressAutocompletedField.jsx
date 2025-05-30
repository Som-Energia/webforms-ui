import React, { useEffect, useRef, useState } from 'react'
import { searchPlace } from '../../../services/googleApiClient'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'

import { textHeader4, textField } from '../gurbTheme'
import InputTitle from '../../../components/InputTitle'

export default function LocationInput({
  id,
  textFieldLabel,
  textFieldName,
  textFieldHelper,
  value,
  onChange,
  sessionTokenRef,
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
      searchPlace(inputValue, sessionTokenRef).then((placesSuggestions) => {
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
        data-cy={id}
        value={value || inputValue || ''}
        options={suggestions}
        filterOptions={(option) => option} // Required to see options without perfect match with Google Places API
        getOptionLabel={(option) => (option.text ? option.text : option)}
        loading={loadingResults}
        loadingText={t('AUTOCOMPLETE_LOADING_TEXT')}
        noOptionsText={t('AUTOCOMPLETE_WITHOUT_OPTIONS')}
        onChange={handleSuggestionSelected}
        renderInput={(params) => (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <InputTitle
                text={textFieldName}
                textStyle={textHeader4}
                required={required}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                sx={{
                  ...textField,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    paddingY: '0px'
                  }
                }}
                {...params}
                value={inputValue}
                label={
                  !value && !inputValue && !isFocused ? textFieldLabel : ''
                }
                InputLabelProps={{ shrink: false }}
                helperText={textFieldHelper}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChange={(event) => setInputValue(event.target.value)}
              />
            </Grid>
          </Grid>
        )}
      />
    </>
  )
}
