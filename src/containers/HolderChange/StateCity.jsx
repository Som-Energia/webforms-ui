import React, { useState, useEffect, useTransition } from 'react'
import { useTranslation } from 'react-i18next'

import CircularProgress from '@mui/material/CircularProgress'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import InputAdornment from '@mui/material/InputAdornment'

import { getProvincies, getMunicipis } from '../../services/api'

const StateCity = (props) => {
  const { t } = useTranslation()
  const {
    stateName,
    stateId,
    stateInitial,
    cityName,
    cityId,
    cityInitial,
    stateError,
    stateHelperText = '',
    cityError,
    cityHelperText = '',
    onChange,
    onBlur
  } = props

  const [state, setState] = useState(stateInitial)
  const [states, setStates] = useState([])
  const [isPendingStates, startStatesTransition] = useTransition()
  const [isPendingCities, startCitiesTransition] = useTransition()

  const [city, setCity] = useState(cityInitial)
  const [cities, setCities] = useState([])
  const [citiesNames, setCitiesNames] = useState([])

  useEffect(() => {
    setState(stateInitial)
    setCity(cityInitial)
  }, [stateInitial, cityInitial])

  useEffect(() => {
    startStatesTransition(() => {
      getProvincies()
        .then((response) => {
          const provincies = {}
          response?.data?.provincies &&
            response.data.provincies.forEach(({ id, name }) => {
              provincies[id] = name
            })
          setStates(provincies)
        })
        .catch((error) => {
          console.error(error)
        })
    })
  }, [])

  useEffect(() => {
    if (state && state?.id !== '') {
      startCitiesTransition(() => {
        getMunicipis(state.id)
          .then((response) => {
            const municipisNames = {}
            response?.data?.municipis &&
              response.data.municipis.forEach(({ id, name }) => {
                municipisNames[id] = name
              })
            setCities(response?.data?.municipis)
            setCitiesNames(municipisNames)
          })
          .catch((error) => {
            console.error(error)
          })
      })

    }
  }, [state])

  const handleStateChange = (event) => {
    event.preventDefault()
    const newState = {
      id: event.target.value,
      name: states[event.target.value]
    }
    setState(newState)
    setCity({ id: '' })
    onChange({
      state: newState,
      city: { id: '' }
    })
  }

  const handleCityChange = (event) => {
    event.preventDefault()
    const newCity = {
      id: event.target.value,
      name: citiesNames[event.target.value]
    }
    setCity(newCity)
    onChange({
      state: state,
      city: newCity
    })
  }

  return (
    <>
      <Grid item xs={12} sm={6}>
        <TextField
          select
          id={stateId}
          name={stateName}
          label={t('STATE')}
          variant="outlined"
          onChange={handleStateChange}
          onBlur={onBlur}
          required
          fullWidth
          disabled={!Object.keys(states).length}
          value={state?.id}
          error={!!stateError}
          helperText={stateHelperText}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {isPendingStates && <CircularProgress size={24} />}
              </InputAdornment>
            )
          }}>
          <MenuItem key="0" value="">
            {t('STATE')}
          </MenuItem>
          {Object.keys(states).map((id) => (
            <MenuItem key={id} value={id}>
              {states[id]}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          select
          id={cityId}
          name={cityName}
          label={t('CITY')}
          variant="outlined"
          onChange={handleCityChange}
          onBlur={onBlur}
          required
          fullWidth
          disabled={!Object.keys(cities).length}
          value={city?.id}
          error={!!cityError}
          helperText={cityHelperText}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {isPendingCities && <CircularProgress size={24} />}
              </InputAdornment>
            )
          }}>
          <MenuItem key="0" value="">
            {t('CITY')}
          </MenuItem>
          {cities.map(({ id, name }) => (
            <MenuItem key={id} value={id}>
              {name}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
    </>
  )
}

export default StateCity