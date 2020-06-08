import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import InputAdornment from '@material-ui/core/InputAdornment'

import { getProvincies, getMunicipis } from '../services/api'

const StateCity = (props) => {
  const { t } = useTranslation()
  const { stateName, stateId, stateInitial, cityName, cityId, cityInitial, stateError, stateHelperText, cityError, cityHelperText, onChange } = props

  const [state, setState] = useState(stateInitial)
  const [states, setStates] = useState([])
  const [isLoadingStates, setIsLoadingStates] = useState(false)

  const [city, setCity] = useState(cityInitial)
  const [cities, setCities] = useState([])
  const [isLoadingCities, setIsLoadingCities] = useState(false)

  useEffect(() => {
    setIsLoadingStates(true)
    getProvincies()
      .then(response => {
        setStates(response?.data?.provincies)
        setIsLoadingStates(false)
      }).catch(error => {
        console.log(error)
        setIsLoadingStates(false)
      })
  }, [])

  useEffect(() => {
    if (state) {
      setIsLoadingCities(true)
      getMunicipis(state)
        .then(response => {
          setCities(response?.data?.municipis)
          setIsLoadingCities(false)
        }).catch(error => {
          console.log(error)
          setIsLoadingCities(false)
        })
    }
  }, [state])

  const getStateName = (value) => {
    const state = states.find(state => value === state.id)
    return state?.name
  }

  const getCityName = (value) => {
    const city = cities.find(city => value === city.id)
    return city?.name
  }

  const handleStateChange = (event) => {
    setState(event.target.value)
    setCity('')
    onChange({
      state: event.target.value,
      city: '',
      stateName: '',
      cityName: ''
    })
  }

  const handleCityChange = (event) => {
    setCity(event.target.value)
    onChange({
      state: state,
      city: event.target.value,
      stateName: getStateName(state),
      cityName: getCityName(event.target.value)
    })
  }

  return (
    <>
      <Grid item xs={6}>
        <TextField
          select
          id={stateId}
          name={stateName}
          label={t('STATE')}
          variant="outlined"
          onChange={handleStateChange}
          required
          fullWidth
          disabled={!states.length}
          value={state}
          error={stateError}
          helperText={stateHelperText}
          InputProps={{
            endAdornment:
              <InputAdornment position="end">
                { isLoadingStates &&
                  <CircularProgress size={24} />
                }
              </InputAdornment>
          }}
        >
          <MenuItem key="0" value="">{t('STATE')}</MenuItem>
          {
            states.map(state => <MenuItem key={state.id} value={state.id}>{state.name}</MenuItem>)
          }
        </TextField>
      </Grid>
      <Grid item xs={6}>
        <TextField
          select
          id={cityId}
          name={cityName}
          label={t('CITY')}
          variant="outlined"
          onChange={handleCityChange}
          required
          fullWidth
          disabled={!cities.length}
          value={city}
          error={cityError}
          helperText={cityHelperText}
          InputProps={{
            endAdornment:
              <InputAdornment position="end">
                { isLoadingCities &&
                  <CircularProgress size={24} />
                }
              </InputAdornment>
          }}
        >
          <MenuItem key="0" value="">{t('CITY')}</MenuItem>
          {
            cities.map(city => <MenuItem key={city.id} value={city.id}>{city.name}</MenuItem>)
          }
        </TextField>
      </Grid>
    </>
  )
}

export default StateCity
