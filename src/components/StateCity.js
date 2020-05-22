import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'

import { getProvincies, getMunicipis } from '../services/api'

const StateCity = (props) => {
  const { t } = useTranslation()
  const { stateName, stateId, cityName, cityId } = props

  const [state, setState] = useState()

  const [states, setStates] = useState([])
  const [cities, setcities] = useState([])

  useEffect(() => {
    getProvincies()
      .then(response => {
        console.log(response?.data?.provincies)
        setStates(response?.data?.provincies)
      })
  }, [])

  useEffect(() => {
    getMunicipis(state)
      .then(response => {
        console.log(response?.data?.municipis)
      })
  }, [state])

  const handleStateChange = (event) => {
    console.log(event.target.value)
    setState(event.target.value)
  }

  const handleCityChange = (event) => {
    console.log(event.target.value)
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
