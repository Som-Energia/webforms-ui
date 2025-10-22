import axios from 'axios'

const WEBFORMS_API_URL = document.getElementById('root')?.dataset?.webformsApiUrl
  ?? import.meta.env.VITE_WEBFORMS_API_URL ?? null // For tests

export const checkGurbDistance = async (gurbId, lat, long) => {
  return axios({
    method: 'GET',
    url: `${WEBFORMS_API_URL}/check/gurb/${gurbId}?lat=${lat}&long=${long}`,
  }).then((response) => {
    return response?.data
  })
}

export const createGurbSignature = async (data) => {
    return axios({
    method: 'POST',
    url: `${WEBFORMS_API_URL}/procedures/gurb/join`,
    data: data,
  }).then((response) => {
    return response?.data
  })
}
