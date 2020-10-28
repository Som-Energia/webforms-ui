import axios from 'axios'

const { API_SOMSOLET_URL, SOMSOLET_API_USERNAME, SOMSOLET_API_PASSWORD } = window.config

const token = Buffer.from(
  `${SOMSOLET_API_USERNAME}:${SOMSOLET_API_PASSWORD}`, 'utf8'
).toString('base64')

export const getStages = async (data) => {
  return axios({
    method: 'GET',
    url: `${API_SOMSOLET_URL}stages/`,
    headers: {
      Authorization: `Basic ${token}`
    }
  })
    .then(response => {
      console.log(response)
      return response?.data
    })
}

export const getCampaign = async (data) => {
  return axios({
    method: 'GET',
    url: `${API_SOMSOLET_URL}campaign/`,
    headers: {
      Authorization: `Basic ${token}`
    }
  })
    .then(response => {
      console.log(response)
      return response?.data
    })
}

export const getProject = async (data) => {
  return axios({
    method: 'GET',
    url: `${API_SOMSOLET_URL}project/`,
    headers: {
      Authorization: `Basic ${token}`,
      dni: data.dni
    }
  })
    .then(response => {
      console.log(response)
      return response?.data
    })
}

export const sendContact = async (data) => {
  return axios({
    method: 'POST',
    url: `${API_SOMSOLET_URL}contact/`,
    headers: {
      Authorization: `Basic ${token}`
    }
  })
    .then(response => {
      console.log(response)
      return response
    })
}

export const sendIncidence = async (data) => {
  return axios({
    method: 'POST',
    url: `${API_SOMSOLET_URL}incidence/`,
    headers: {
      Authorization: `Basic ${token}`
    }
  })
    .then(response => {
      console.log(response)
      return response
    })
}
