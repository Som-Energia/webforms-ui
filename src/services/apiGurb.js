import axios from 'axios'

const WEBFORMS_API_URL = document.getElementById('root')?.dataset?.webformsApiUrl
  ?? import.meta.env.VITE_WEBFORMS_API_URL ?? null // For tests

// const WEBFORMS_API_URL = 'http://localhost:5001'

// TODO: change this name !!!
export const getGurbData = async (gurbId) => {
  console.log('gurgId', gurbId)
  return axios({
    method: 'GET',
    url: `${WEBFORMS_API_URL}/data/gurb/${gurbId}`
  }).then((response) => {
    return {
      name: response.data.name,
      state: response.data.state,
      completedPercentage: response.data.assigned_betas_percentage
    }
  })
    // const data = {
    //   id: 1,
    //   name: 'GURB Mataró',
    //   state: 'open',
    //   assigned_betas_kw: 200,
    //   assigned_betas_percentage: 30,
    //   available_betas_kw: 400,
    //   available_betas_percentage: 70,
    //   generation_power: 200,
    //   min_power: 3,
    //   max_power: 20
    // }
    // return {
    //   name: data.name,
    //   state: data.state,
    //   completedPercentage: data.assigned_betas_percentage,
    // }
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
