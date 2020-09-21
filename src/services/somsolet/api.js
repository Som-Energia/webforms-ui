import axios from 'axios'

const { API_SOMSOLET_URL } = window.config

export const getStages = async (data) => {
  return axios({
    method: 'GET',
    url: `${API_SOMSOLET_URL}stages`
  })
    .then(response => {
      console.log(response)
      return response?.data
    })
}

export const getCampaign = async (data) => {
  return axios({
    method: 'GET',
    url: `${API_SOMSOLET_URL}campaign`
  })
    .then(response => {
      console.log(response)
      return response?.data
    })
}

export const getProject = async (data) => {
  return axios({
    method: 'GET',
    url: `${API_SOMSOLET_URL}project`
  })
    .then(response => {
      console.log(response)
      return response?.data
    })
}
