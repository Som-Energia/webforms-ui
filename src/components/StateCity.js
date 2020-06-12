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
        const provincies = {}
        const aux = response?.data?.provincies.map(({ id, name }) => provincies[id] = name)
        setStates(provincies)
        setIsLoadingStates(false)
      }).catch(error => {
        console.log(error)
        setIsLoadingStates(false)
      })
  }, [])

  useEffect(() => {
    if (state) {
      setIsLoadingCities(true)
      getMunicipis(state.id)
        .then(response => {
          const municipis = {}
          const aux = response?.data?.municipis.map(({ id, name }) => municipis[id] = name)
          setCities(municipis)
          setIsLoadingCities(false)
        }).catch(error => {
          console.log(error)
          setIsLoadingCities(false)
        })
    }
  }, [state])

  const handleStateChange = (event) => {
    const newState = { id: event.target.value, name: states[event.target.value] }
    setState(newState)
    setCity({})
    onChange({
      state: newState,
      city: {}
    })
  }

  const handleCityChange = (event) => {
    const newCity = { id: event.target.value, name: cities[event.target.value] }
    setCity(newCity)
    onChange({
      state: state,
      city: newCity
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
            Object.keys(cities).map(id => <MenuItem key={id} value={id}>{cities[id]}</MenuItem>)
          }
        </TextField>
      </Grid>
    </>
  )
}

export default StateCity
