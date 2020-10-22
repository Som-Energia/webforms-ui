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
  const { stateName, stateId, stateInitial, cityName, cityId, cityInitial, stateError, stateHelperText, cityError, cityHelperText, onChange, onBlur } = props

  const [state, setState] = useState(stateInitial)
  const [states, setStates] = useState([])
  const [isLoadingStates, setIsLoadingStates] = useState(false)

  const [city, setCity] = useState(cityInitial)
  const [cities, setCities] = useState([])
  const [citiesNames, setCitiesNames] = useState([])
  const [isLoadingCities, setIsLoadingCities] = useState(false)

  useEffect(() => {
    setIsLoadingStates(true)
    getProvincies()
      .then(response => {
        const provincies = {}
        response?.data?.provincies &&
          response.data.provincies.forEach(({ id, name }) => {
            provincies[id] = name
          })
        setStates(provincies)
        setIsLoadingStates(false)
      }).catch(error => {
        console.log(error)
        setIsLoadingStates(false)
      })
  }, [])

  useEffect(() => {
    if (state && state?.id !== '') {
      setIsLoadingCities(true)
      getMunicipis(state.id)
        .then(response => {
          const municipisNames = {}
          response?.data?.municipis &&
            response.data.municipis.forEach(({ id, name }) => {
              municipisNames[id] = name
            })
          setCities(response?.data?.municipis)
          setCitiesNames(municipisNames)
          setIsLoadingCities(false)
        }).catch(error => {
          console.log(error)
          setIsLoadingCities(false)
        })
    }
  }, [state])

  const handleStateChange = (event) => {
    event.preventDefault()
    const newState = { id: event.target.value, name: states[event.target.value] }
    setState(newState)
    setCity({ id: '' })
    onChange({
      state: newState,
      city: { id: '' }
    })
  }

  const handleCityChange = (event) => {
    event.preventDefault()
    const newCity = { id: event.target.value, name: citiesNames[event.target.value] }
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
            Object.keys(states).map(id => <MenuItem key={id} value={id}>{states[id]}</MenuItem>)
          }
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
            cities.map(({ id, name }) => <MenuItem key={id} value={id}>{name}</MenuItem>)
          }
        </TextField>
      </Grid>
    </>
  )
}

export default StateCity
