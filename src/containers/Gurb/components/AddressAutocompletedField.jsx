import React, { useEffect, useRef, useState } from 'react'
import { searchPlace } from '../../../services/googleApiClient'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { useTranslation } from 'react-i18next'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import { textField } from '../../../themes/gurbTheme'
import InputTitle from '../../../components/InputTitle'

export default function LocationInput({
  id,
  textFieldLabel,
  textFieldName,
  textFieldHelper,
  value,
  onChange,
  sessionTokenRef,
  required = false,
  error = false,
  helperText = '',
  touched = false,
  onBlur = () => {}
}) {
  const { t } = useTranslation()
  const timeoutRef = useRef()

  const [suggestions, setSuggestions] = useState([])
  const [inputValue, setInputValue] = useState(value?.street || '')
  const [loadingResults, setLoadingResults] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    setInputValue(value?.street || '')
  }, [value])

  useEffect(() => {
    if (!inputValue || inputValue.trim().length <= 3) {
      setSuggestions([])
      setLoadingResults(false)
      return
    }

    setLoadingResults(true)
    clearTimeout(timeoutRef.current)

    timeoutRef.current = setTimeout(async () => {
      try {
        const placesSuggestions = await searchPlace(inputValue, sessionTokenRef)
        setSuggestions(placesSuggestions)
      } catch (e) {
        setSuggestions([])
      }
      setLoadingResults(false)
    }, 350)
  }, [inputValue, sessionTokenRef])

  const handleSuggestionSelected = (event, newValue) => {
    if (!newValue) {
      onChange(null)
      setInputValue('')
      setSuggestions([])
      return
    }

    if (typeof newValue === 'string') {
      onChange({ id: null, street: newValue })
      setInputValue(newValue)
    } else {
      const selected = {
        ...newValue,
        street: newValue.street || newValue.text || ''
      }
      onChange(selected)
      setInputValue(selected.street)
    }
    setSuggestions([])
  }

  return (
    <Autocomplete
      freeSolo
      data-cy={id}
      value={value || { id: null, street: '' }}
      inputValue={inputValue}
      options={suggestions}
      filterOptions={(option) => option}
      getOptionLabel={(option) =>
        typeof option === 'string' ? option : option.street || option.text || ''
      }
      loading={loadingResults}
      loadingText={t('AUTOCOMPLETE_LOADING_TEXT')}
      noOptionsText={t('AUTOCOMPLETE_WITHOUT_OPTIONS')}
      onChange={handleSuggestionSelected}
      onInputChange={(event, newInputValue, reason) => {
        if (reason === 'input') {
          setInputValue(newInputValue)
        } else if (reason === 'clear') {
          setInputValue('')
          onChange(null)
        }
      }}
      isOptionEqualToValue={(option, value) =>
        option?.id === value?.id && option?.street === value?.street
      }
      renderInput={(params) => (
        <Grid container spacing={1}>
          <Grid item xs={12} sx={{ mb: '6px' }}>
            <InputTitle text={textFieldName} required={required} />
          </Grid>

          <Grid item xs={12}>
            <TextField
              {...params}
              sx={{
                ...textField,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  paddingY: '0px'
                }
              }}
              label={
                !value?.street && !inputValue && !isFocused
                  ? textFieldLabel
                  : ''
              }
              InputLabelProps={{ shrink: false }}
              onFocus={() => setIsFocused(true)}
              onBlur={(e) => {
                setIsFocused(false)
                if (onBlur) onBlur(e)

                // Only reset id if the input string does not match the current value
                if (!value || e.target.value !== value.street) {
                  onChange({ id: null, street: e.target.value })
                } else {
                  // Keep the selected address object intact
                  onChange(value)
                }
              }}
              error={Boolean(touched && error)}
            />
          </Grid>

          {touched && error && (
            <Grid item xs={12}>
              <Typography variant="error" color="error">
                {t(error)}
              </Typography>
            </Grid>
          )}
        </Grid>
      )}
    />
  )
}
