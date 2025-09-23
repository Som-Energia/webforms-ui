import axios from 'axios'

const WEBFORMS_API_URL = document.getElementById('root')?.dataset?.webformsApiUrl
  ?? import.meta.env.VITE_WEBFORMS_API_URL ?? null // For tests

export const checkGurbDistance = async (gurbId, lat, long) => {
  // return new Promise((resolve) => {
  //   setTimeout(() => {
  //     resolve({ data: true })
  //   }, "5000");
  // })
  return axios({
    method: 'GET',
    url: `${WEBFORMS_API_URL}/check/gurb/${gurbId}?lat=${lat}&long=${long}`,
  }).then((response) => {
    return response?.data
  })
}
