import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Grid from '@mui/material/Grid'
import SelectField from './SelectField'
import { getProvincies, getMunicipis } from '../services/api'


const StateCityForm = (props) => {
  const { t } = useTranslation()
  const {
    stateName,
    state,
    cityName,
    city,
    cities,
    states,
    handleStateChange,
    handleCityChange,
  } = props

  return (
    <>
      <Grid item xs={12} sm={6}>
        <SelectField
          label={t('STATE')}
          value={state?.id}
          fieldName={stateName}
          options={states}
          required={true}
          disabled={!Object.keys(states).length}
          onChange={handleStateChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <SelectField
          label={t('CITY')}
          value={city?.id}
          fieldName={cityName}
          options={cities}
          required={true}
          disabled={!Object.keys(cities).length}
          onChange={handleCityChange}
        />
      </Grid>
    </>
  )

}


const StateCity = (props) => {

  const {
    state,
    onChange,
  } = props


  const [states, setStates] = useState([])
  const [cities, setCities] = useState([])

  const sortData = (a,b) => {
   if( a.name < b.name ) return -1;
   if( a.name > b.name ) return 1;
   return 0;
  }


  useEffect(() => {
    getProvincies()
      .then((response) => {
        const provincies = []
        response?.data?.provincies &&
          response.data.provincies.forEach(({ id, name }) => {
            provincies.push({ id: id, name: name })
          })
        setStates(provincies.sort(sortData))
      })
      .catch((error) => {
        console.error(error)
      })
  }, [])

  useEffect(() => {
    if (state && state?.id !== '') {
      getMunicipis(state.id)
        .then((response) => {
          const municipis = []
          response?.data?.municipis &&
            response.data.municipis.forEach(({ id, name }) => {
              municipis.push({ id: id, name: name })
            })
          setCities(municipis.sort(sortData))
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }, [state])

  const handleStateChange = (event) => {
    event.preventDefault()
    const newState = {
      id: event.target.value,
      name: states[event.target.value]
    }
    onChange({
      state: newState,
      city: { id: '', name: '' }
    })
  }

  const handleCityChange = (event) => {
    event.preventDefault()
    const newCity = {
      id: event.target.value,
      name: cities[event.target.value]
    }
    onChange({
      state: state,
      city: newCity
    })
  }

  const fullProps = {
    ...props, states, cities, handleStateChange, handleCityChange
  }

  return (
    <StateCityForm {...fullProps} />
  )
}

export default StateCity
