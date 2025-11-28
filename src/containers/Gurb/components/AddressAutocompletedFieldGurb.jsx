import React, { useEffect, useRef, useState } from 'react'
import { searchPlace } from '../../../services/googleApiClient'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { useTranslation } from 'react-i18next'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import textField from '../gurbTheme'
import InputTitle from '../../../components/InputTitle'

export default function LocationInput({
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
  onBlur = () => { }
}) {
  const { t } = useTranslation()
  const timeoutRef = useRef()

  const [suggestions, setSuggestions] = useState([])

  // normalize incoming `value` whether it's a string or object
  const normalizeValue = (v) =>
    v && typeof v === 'object'
      ? { id: v.id ?? null, street: v.street ?? v.text ?? '' }
      : { id: null, street: v ?? '' }

  const [inputValue, setInputValue] = useState(() => normalizeValue(value).street)
  const [loadingResults, setLoadingResults] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  // keep local inputValue in sync when the parent/form value changes
  useEffect(() => {
    setInputValue(normalizeValue(value).street)
  }, [value])

  // search suggestions
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
      } finally {
        setLoadingResults(false)
      }
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
      const selected = { ...newValue, street: newValue.street || newValue.text || '' }
      onChange(selected)
      setInputValue(selected.street)
    }
    setSuggestions([])
  }

  const normalizedValue = normalizeValue(value)

  return (
    <Autocomplete
      freeSolo
      data-cy={"street"}
      value={normalizedValue}
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
      isOptionEqualToValue={(option, v) => {
        const optStreet = typeof option === 'string' ? option : option.street || option.text || ''
        const valStreet = typeof v === 'string' ? v : v?.street || v?.text || ''
        const optId = option?.id ?? null
        const valId = v?.id ?? null
        return optId === valId && optStreet === valStreet
      }}
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
              label={!normalizedValue.street && !inputValue && !isFocused ? textFieldLabel : ''}
              InputLabelProps={{ shrink: false }}
              onFocus={() => setIsFocused(true)}
              onBlur={(e) => {
                setIsFocused(false)
                if (onBlur) onBlur(e)

                // Only reset id if the input string does not match the current value
                if (!normalizedValue.street || e.target.value !== normalizedValue.street) {
                  onChange({ id: null, street: e.target.value })
                } 
              }}
              error={Boolean(touched && error)}
              helperText={helperText}
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
