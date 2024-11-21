import React, { useRef, useState } from 'react'
import getGoogleMapsPlacesApiClient from '../../../services/googleApiClient'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { textHeader4 } from '../gurbTheme'
import { HelperText } from './InputField'

export default function LocationInput({
  textFieldLabel,
  textFieldName,
  textFieldHelper,
  value,
  onChange,
  onLocationSelected
}) {
  const { t } = useTranslation()
  const timeoutRef = useRef()
  const sessionTokenRef = useRef()

  const [suggestions, setSuggestions] = useState([])
  const [placeDetail, setPlaceDetail] = useState()

  const loadSuggestions = async (inputValue) => {
    clearTimeout(timeoutRef.current)
    if (!inputValue || inputValue.trim().length <= 3) {
      setSuggestions([])
      return
    }

    // debounce the loading of suggestions to reduce usage of the Google API
    timeoutRef.current = setTimeout(async () => {
      const places = await getGoogleMapsPlacesApiClient()
      if (!sessionTokenRef.current) {
        sessionTokenRef.current = new places.AutocompleteSessionToken()
      }

      new places.AutocompleteService().getPlacePredictions(
        {
          input: inputValue,
          sessionToken: sessionTokenRef.current
        },
        (predictions, status) => {
          // when the status is 'ZERO_RESULTS', we treat it as if there are 0 suggestions, no error
          // you could change this behavior if you require users to pick a suggestion
          if (status === places.PlacesServiceStatus.ZERO_RESULTS) {
            setSuggestions([])
            return
          }
          if (status !== places.PlacesServiceStatus.OK || !predictions) {
            // if you allow your users to enter arbitrary locations that aren't autocompleted,
            // then you can fail silently here and track the error (with Sentry for example)
            return
          }
          setSuggestions(predictions)
        }
      )
    }, 350)
  }

  const handleSuggestionSelected = async (event, newValue) => {
    if (newValue === null) {
      setSuggestions([])
      onLocationSelected(null)
      onChange('')
      return
    }

    // update the text in the input to the full selected suggestion text
    const suggestion = newValue
    onChange(suggestion.description)

    // clear suggestion list
    setSuggestions([])

    const places = await getGoogleMapsPlacesApiClient()

    // Clear the session token, it can only be used in one request
    const sessionToken = sessionTokenRef.current
    sessionTokenRef.current = undefined

    // @see https://developers.google.com/maps/documentation/javascript/places
    new places.PlacesService(
      // this is the node to populate attribution details on
      document.getElementById('googlemaps-attribution-container')
    ).getDetails(
      {
        placeId: suggestion.place_id,
        fields: [
          // you can pick the fields you want for your application
          // @see https://developers.google.com/maps/documentation/javascript/place-data-fields
          'formatted_address',
          'name',
          'geometry.location',
          'place_id',
          'plus_code',
          'address_components',
          'geometry.location_type'
        ],
        // pass the session token so all autocomplete requests are counted as part of this places request
        sessionToken
      },
      (place, status) => {
        if (status === places.PlacesServiceStatus.OK) {
          // set the place detail in this state component
          // you can use this info to show the detail in the UI, or maybe a checkmark
          setPlaceDetail(place)

          // notify up the tree that a location is selected
          onLocationSelected(place)
        } else {
          // silently fail here and track it with an error tracker like Sentry
          // or fail loudly if users are required to use a suggestion from the list
        }
      }
    )
  }
  return (
    <>
      <Autocomplete
        debug
        autoHighlight
        autoComplete
        includeInputInList
        filterSelectedOptions
        value={value}
        getOptionLabel={(option) =>
          typeof option === 'string' ? option : option.description
        }
        options={suggestions}
        noOptionsText="No locations"
        onChange={handleSuggestionSelected}
        renderInput={(params) => (
          <Box sx={{ marginTop: '1rem', marginBottom: '1rem' }}>
            <Typography sx={textHeader4}>{textFieldName}</Typography>
            <TextField
              sx={{
                '& .MuiFormHelperText-root': { color: '#B3B3B3' },
                '& .MuiInputLabel-root': { color: '#B3B3B3' },
                '& .MuiOutlinedInput-root': { borderRadius: '8px' },
                marginTop: '0.5rem'
              }}
              {...params}
              label={textFieldLabel}
              helperText={textFieldHelper}
              onChange={(event) => {
                const newValue = event.target.value
                // update controlled input value
                onChange(newValue)
                // clear any previously loaded place details
                setPlaceDetail(undefined)
                // trigger the load of suggestions
                loadSuggestions(newValue)
              }}
            />
          </Box>
        )}
      />
      <div id="googlemaps-attribution-container"></div>
    </>
  )
}
