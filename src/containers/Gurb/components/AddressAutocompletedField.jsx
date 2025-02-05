import React, { useEffect, useRef, useState } from 'react'
import getGoogleMapsPlacesApiClient from '../../../services/googleApiClient'
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
  onLocationSelected,
  numberField = false,
  required = false
}) {
  const { t } = useTranslation()
  const timeoutRef = useRef()
  const sessionTokenRef = useRef()

  const [suggestions, setSuggestions] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [placeDetail, setPlaceDetail] = useState()
  const [loadingResults, setLoadingResults] = useState(false)

  useEffect(() => {
    setLoadingResults(true)
    clearTimeout(timeoutRef.current)
    if (!inputValue || inputValue.trim().length <= 3) {
      return
    }

    // debounce the loading of suggestions to reduce usage of the Google API
    timeoutRef.current = setTimeout(async () => {
      const places = await getGoogleMapsPlacesApiClient()
      if (!sessionTokenRef.current) {
        sessionTokenRef.current = new places.AutocompleteSessionToken()
      }

      let request = {
        region: 'es',
        sessionToken: sessionTokenRef.current,
        input: inputValue,
        includedPrimaryTypes: ['route'],
        includedRegionCodes: ['es'],
      }
      const result = await places.AutocompleteSuggestion.fetchAutocompleteSuggestions(request)
      let placesSuggestions = []
      for (let suggestion of result?.suggestions) {
        const placePrediction = suggestion.placePrediction
        placesSuggestions.push({
          id: placePrediction.placeId.toString(),
          text: placePrediction.text.toString()
        })
      }
      setSuggestions(placesSuggestions)
      setLoadingResults(false)
    }, 350)
  }, [inputValue])

  const handleSuggestionSelected = async (event, newValue) => {
    if (newValue === null) {
      setSuggestions([])
      onLocationSelected(null)
      onChange('')
      return
    }

    // update the text in the input to the full selected suggestion text
    // const suggestion = newValue
    onChange(newValue)

    // clear suggestion list
    setSuggestions([])

    const { Place } = await getGoogleMapsPlacesApiClient()

    // Clear the session token, it can only be used in one request
    const sessionToken = sessionTokenRef.current
    sessionTokenRef.current = undefined

    // @see https://developers.google.com/maps/documentation/javascript/place-details
    const place = new Place({
      id: newValue.id,
      sessionToken,  // pass the session token so all autocomplete requests are counted as part of this places request
    })
    await place.fetchFields({
      fields: ["displayName", "formattedAddress", "location", "addressComponents", "primaryType", "types", "adrFormatAddress", "primaryTypeDisplayName", "primaryTypeDisplayNameLanguageCode"]
    })
    console.log(place)
    console.log(place.formattedAddress)
    console.log(place.location.lat(), place.location.lng())
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
