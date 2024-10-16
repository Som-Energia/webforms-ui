import axios from 'axios'

const WEBFORMS_API_URL = document.getElementById('root')?.dataset?.webformsApiUrl
  ?? import.meta.env.VITE_WEBFORMS_API_URL ?? null // For tests

// const WEBFORMS_API_URL = 'http://localhost:5001'

// TODO: change this name !!!
export const getGurbData = async (gurbId) => {
  return axios({
    method: 'GET',
    url: `${WEBFORMS_API_URL}/data/gurb/${gurbId}`
  }).then((response) => {
    return response?.data
  })
}

// export const checkGurbPercentage = async (gurbId) => {
//   return axios({
//     method: 'GET',
//     url: `${WEBFORMS_API_URL}/gurb/${gurbId}/percentage`,
//   }).then((response) => {
//     return response?.data
//   })
// }

// export const checkGurbDistance = async (gurbId, localization) => {
//   return axios({
//     method: 'GET',
//     url: `${WEBFORMS_API_URL}/gurb/${gurbId}?localization=${localization}`,
//   }).then((response) => {
//     return response?.data
//   })
// }

// // CUPS from Som?
// export const checkGurbCups = async (data, token) => {
//   return axios({
//     method: 'GET',
//     url: `${WEBFORMS_API_URL}/gurb/`,
//     headers: {
//       Authorization: token
//     },
//     data: data
//   }).then((response) => {
//     return response?.data
//   })
// }
